import { fetchAllPreorders } from '@/actions/preorder';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
  const preorders = await fetchAllPreorders();
  return <AdminDashboardClient preorders={preorders} />;
}
