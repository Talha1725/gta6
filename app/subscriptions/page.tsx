import { getServerSession } from 'next-auth';
import { fetchSubscriptionsServer } from '@/lib/services/subscription.service';
import SubscriptionsClient from '@/components/subscriptions/SubscriptionsClient';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { cookies } from 'next/headers';

type SearchParams = {
  type?: 'all' | 'subscriptions' | 'onetime';
  page?: string;
  limit?: string;
};

type SubscriptionsPageProps = {
  searchParams: SearchParams;
};

export default async function SubscriptionsPage({ searchParams }: SubscriptionsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <SubscriptionsClient data={null} status="unauthenticated" />;
  }

  try {
    // Get URL parameters
    const type = searchParams.type || 'all';
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');

    // Get all cookies from the request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Fetch subscriptions using your existing service function with pagination parameters
    const data = await fetchSubscriptionsServer(cookieHeader, type, page, limit);
    
    
    return (
      <SubscriptionsClient 
        data={data} 
        status="authenticated" 
      />
    );
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return (
      <SubscriptionsClient 
        data={{
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
          },
          type: 'all',
          message: 'Error fetching data'
        }} 
        status="authenticated" 
      />
    );
  }
}