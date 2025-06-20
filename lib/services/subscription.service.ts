// lib/services/subscription.service.ts

import { API_BASE_URL } from '@/lib/constants';

export async function fetchSubscriptionsServer(
  cookie: string,
  type: string = 'all',
  page: number = 1,
  limit: number = 10
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}/api/subscriptions?type=${type}&page=${page}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { Cookie: cookie },
    cache: 'no-store'
  });


  if (!res.ok) throw new Error('Failed to fetch subscriptions');

  return await res.json();
}

export async function fetchLatestSubscriptionServer(cookieHeader: string): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/api/subscriptions?type=subscriptions&page=1&limit=1`;
    
    // Fetch the latest subscription with type=subscriptions, limit=1
    const response = await fetch(url, {
      headers: {
        Cookie: cookieHeader
      },
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!data.success) {
      return false;
    }

    if (!data.data || data.data.length === 0) {
      return false;
    }

    const subscription = data.data[0];
    
    // Check if subscription is active and not expired
    const isActive = subscription.status === 'completed';
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    
 
    const result = isActive && endDate > now;
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    return false;
  }
}


