import { getServerSession } from 'next-auth';
import { fetchSubscriptionsServer } from '@/lib/services/subscription.service';
import SubscriptionsClient from '@/components/subscriptions/SubscriptionsClient';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { cookies } from 'next/headers';

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return <SubscriptionsClient subscriptions={[]} status="unauthenticated" />;
  }

  try {
    // Get all cookies from the request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    // Fetch subscriptions using the HTTP API with proper cookies
    const data = await fetchSubscriptionsServer(cookieHeader);
    return <SubscriptionsClient subscriptions={data.subscriptions} status="authenticated" />;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return <SubscriptionsClient subscriptions={[]} status="unauthenticated" />;
  }
}
