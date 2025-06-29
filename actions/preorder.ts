'use server';

import { db } from '@/lib/db';
import { orders, preorder } from '@/lib/db/schema';
import { and, desc, eq, isNotNull } from 'drizzle-orm';

// Server action to fetch all preorders
export async function fetchAllPreorders() {
  const rows = await db.select({
    id: preorder.id,
    notes: preorder.notes,
    selectedDate: preorder.selectedDate,
    releaseDate: preorder.releaseDate,
    createdAt: preorder.createdAt,
  })
  .from(preorder)
  .orderBy(desc(preorder.createdAt));

  return rows.map(row => ({
    ...row,
    releaseDate: row.releaseDate ? row.releaseDate.toISOString() : '',
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
  }));
}

export async function createPreorderAction({
  notes,
  selectedDate,
  releaseDate,
}: {
  notes?: string;
  selectedDate: string;
  releaseDate?: string | Date;
}) {
  try {
    const insertData: any = {
      notes,
      selectedDate,
      releaseDate: new Date(selectedDate),
    };
    if (releaseDate) {
      insertData.releaseDate = typeof releaseDate === 'string'
        ? new Date(releaseDate)
        : releaseDate;
    }
    const result = await db.insert(preorder).values(insertData).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create preorder' };
  }
}

export async function fetchLatestPreorder() {
  const rows = await db
    .select()
    .from(preorder)
    .orderBy(desc(preorder.createdAt))
    .limit(1);
  return rows[0] || null;
}

export async function getPreOrderByEmail(email: string) {
  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.purchaseType, 'pre_order'), eq(orders.customerEmail, email)));
  return rows;
}