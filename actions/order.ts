'use server';

import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc, eq, and, count, ilike } from 'drizzle-orm';

export async function fetchAllOrders(searchParams?: URLSearchParams) {
  // Get query parameters
  const type = searchParams?.get('type') || 'all';
  const page = parseInt(searchParams?.get('page') || '1');
  const limit = parseInt(searchParams?.get('limit') || '10');
  const search = searchParams?.get('search') || '';
  const offset = (page - 1) * limit;

  // Build where conditions
  let whereConditions;
  
  const conditions = [];
  
  // Add type filter
  if (type === 'subscriptions') {
    conditions.push(eq(orders.purchaseType, 'monthly'));
  } else if (type === 'onetime') {
    conditions.push(eq(orders.purchaseType, 'one_time'));
  }
  
  // Add email search filter
  if (search.trim()) {
    conditions.push(ilike(orders.customerEmail, `%${search.trim()}%`));
  }
  
  // Combine conditions
  if (conditions.length > 0) {
    whereConditions = conditions.length === 1 ? conditions[0] : and(...conditions);
  }

  // Get total count
  const [totalCountResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(whereConditions);

  const totalCount = totalCountResult.count;

  // Get all orders for stats (without pagination but with filters)
  const allOrders = await db
    .select()
    .from(orders)
    .where(whereConditions);

  // Calculate overall stats
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const completedOrders = allOrders.filter(order => order.status === 'completed').length;

  // Get paginated orders
  const rows = await db
    .select()
    .from(orders)
    .where(whereConditions)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const transformedData = rows.map(row => ({
    ...row,
    createdAt: row.createdAt ?? new Date(),
    customerEmail: row.customerEmail ?? undefined,
    customerId: row.customerId ?? undefined,
    stripeCustomerId: row.stripeCustomerId ?? undefined,
    purchaseType: row.purchaseType ?? undefined,
    amount: row.amount ? Number(row.amount) : 0,
    status: row.status,
  }));

  return {
    data: transformedData,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    },
    stats: {
      totalRevenue,
      completedOrders,
      totalOrders: totalCount
    }
  };
}
