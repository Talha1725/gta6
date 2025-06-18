// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { paymentService } from '@/lib/services';
import { USER_ROLES } from '@/lib/constants';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders using the payment service
    const orders = await paymentService.getOrders();
    const transactions = await paymentService.getTransactions();

    // Combine orders with their transactions
    const formattedOrders = orders.map(order => {
      const transaction = transactions.find(t => t.orderId === order.id);
      return {
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
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}