export async function fetchSubscriptionsServer(cookie: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}/api/subscriptions`, {
    headers: { Cookie: cookie },
    cache: 'no-store'
  });
  console.log('res', res)
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return await res.json();
} 