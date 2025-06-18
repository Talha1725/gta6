// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { db } from '@/lib/db';
import { orders, transactions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders with their transactions
    const allOrders = await db
      .select({
        order: orders,
        transaction: transactions,
      })
      .from(orders)
      .leftJoin(transactions, eq(orders.id, transactions.orderId))
      .orderBy(desc(orders.createdAt));

    // Transform the data
    const formattedOrders = allOrders.map(({ order, transaction }) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      productName: order.productName,
      amount: Number(order.amount),
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt,
      paymentId: transaction?.paymentId || '',
      transactionStatus: transaction?.status || null,
      transactionCreatedAt: transaction?.createdAt || null,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}