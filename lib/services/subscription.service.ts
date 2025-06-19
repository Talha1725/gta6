// lib/services/subscription.service.ts

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
  
  console.log('res', res);
  
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  
  return await res.json();
}