import { fetchAllPreordersServer } from '@/lib/services/preorder.service';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
  const preorders = await fetchAllPreordersServer();
  return <AdminDashboardClient preorders={preorders} />;
}
