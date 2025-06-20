import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { preorder } from '@/lib/db/schema';
import { desc, isNotNull } from 'drizzle-orm';

// Force dynamic rendering since this route uses database queries
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const latestPreorder = await db
      .select({
        id: preorder.id,
        notes: preorder.notes,
        selectedDate: preorder.selectedDate,
        releaseDate: preorder.releaseDate,
        createdAt: preorder.createdAt,
      })
      .from(preorder)
      .where(isNotNull(preorder.releaseDate)) // Only get preorders with release dates
      .orderBy(desc(preorder.createdAt))
      .limit(1);

    if (latestPreorder.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No preorders with release dates found'
      });
    }

    return NextResponse.json({
      success: true,
      data: latestPreorder[0]
    });

  } catch (error) {
    console.error('Error fetching latest preorder:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch latest preorder' 
    }, { status: 500 });
  }
}