export async function fetchSubscriptionsServer(cookie: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/subscriptions`, {
    headers: { Cookie: cookie },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return await res.json();
} 