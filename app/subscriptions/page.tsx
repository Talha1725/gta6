import { getServerSession } from 'next-auth';
import { fetchSubscriptionsServer } from '@/lib/services/subscription.service';
import SubscriptionsClient from '@/components/subscriptions/SubscriptionsClient';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <SubscriptionsClient subscriptions={[]} status="unauthenticated" />;
  }
  // Get the session cookie from headers (for SSR fetch)
  // This is a simplified example; you may need to adjust for your auth setup
  const cookie = '';
  const data = await fetchSubscriptionsServer(cookie);
  return <SubscriptionsClient subscriptions={data.subscriptions} status="authenticated" />;
}
