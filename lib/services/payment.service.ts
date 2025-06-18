import { PaymentIntentRequest, PaymentIntentResponse, Order, Transaction } from '@/types/payment';
import { API_ENDPOINTS } from '@/lib/constants';

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  static async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          productName: request.productName,
          customerEmail: request.customerEmail,
          purchaseType: request.purchaseType,
          totalLeaks: request.totalLeaks
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment intent creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(API_ENDPOINTS.admin.orders);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch('/api/admin/transactions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.orders}/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.orders}/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transaction by ID error:', error);
      throw error;
    }
  }

  // New method to get orders by customer email
  async getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.orders}?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get customer orders error:', error);
      throw error;
    }
  }
}

export const paymentService = PaymentService.getInstance();

export async function fetchOrdersServer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/orders`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return await res.json();
} 