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
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user[0].id,
        leaks: user[0].leaks || 0,
        email: user[0].email
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