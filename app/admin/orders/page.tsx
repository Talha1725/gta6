// app/admin/orders/page.tsx
import { fetchOrdersServer } from '@/lib/services/payment.service';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

export default async function AdminOrdersPage() {
  const orders = await fetchOrdersServer();
  return <AdminOrdersClient orders={orders} />;
}
