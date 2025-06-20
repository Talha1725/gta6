// app/admin/orders/page.tsx
import { fetchAllOrders } from '@/actions/order';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

export default async function AdminOrdersPage() {
  const orders = await fetchAllOrders();
  return <AdminOrdersClient orders={orders} />;
}
