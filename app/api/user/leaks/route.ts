// app/api/user/leaks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/user/leaks - Get user's current leak count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 401 });
    }

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        leaks: users.leaks,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(res => res[0]);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        leaks: user.leaks || 0,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error fetching user leaks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user leaks'
    }, { status: 500 });
  }
}