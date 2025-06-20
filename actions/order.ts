'use server';

import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function fetchAllOrders() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return rows.map(row => ({
    ...row,
    createdAt: row.createdAt ?? new Date(),
    customerEmail: row.customerEmail ?? undefined,
    customerId: row.customerId ?? undefined,
    stripeCustomerId: row.stripeCustomerId ?? undefined,
    purchaseType: row.purchaseType ?? undefined,
    amount: row.amount ? Number(row.amount) : 0,
    status: row.status,
  }));
}