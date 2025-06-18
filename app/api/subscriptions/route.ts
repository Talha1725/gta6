// app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { db } from '@/lib/db';
import { orders, transactions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('session', session)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders and their transactions for the user using email
    const userOrders = await db
      .select({
        order: orders,
        transaction: transactions,
      })
      .from(orders)
      .leftJoin(transactions, eq(orders.id, transactions.orderId))
      .where(
        and(
          eq(orders.customerEmail, session.user.email),
          eq(orders.status, 'completed')
        )
      )
      .orderBy(orders.createdAt);

    if (userOrders.length === 0) {
      return NextResponse.json({
        subscriptions: [],
        message: 'No orders found for this user'
      });
    }

    // Transform the data to match the frontend format
    const subscriptions = userOrders.map(({ order, transaction }) => ({
      id: order.orderNumber,
      status: order.status,
      plan: order.productName,
      amount: Number(order.amount),
      currency: order.currency,
      startDate: order.createdAt,
      endDate: transaction?.createdAt || order.createdAt,
      paymentId: transaction?.paymentId || '',
      lastPaymentDate: transaction?.createdAt || order.createdAt,
      nextBillingDate: order.status === 'completed' && order.createdAt ?
        new Date(new Date(order.createdAt).setMonth(new Date(order.createdAt).getMonth() + 1)) :
        undefined
    }));

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}