// app/admin/orders/page.tsx
import { fetchAllOrders } from '@/actions/order';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

interface AdminOrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  // Convert searchParams to URLSearchParams
  const urlSearchParams = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  });

  const orders = await fetchAllOrders(urlSearchParams);
  return <AdminOrdersClient orders={orders} />;
}