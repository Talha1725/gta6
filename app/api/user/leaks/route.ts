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

// POST /api/user/leaks - Decrement user's leak count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount = 1 } = body;
    const userId = body.userId || request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 401 });
    }

    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be greater than 0'
      }, { status: 400 });
    }

    // First, get current user data to check if they have enough leaks
    const currentUser = await db
      .select({
        id: users.id,
        email: users.email,
        leaks: users.leaks,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const userLeaks = currentUser[0].leaks || 0;

    if (userLeaks < amount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient leaks',
        data: {
          currentLeaks: userLeaks,
          requested: amount
        }
      }, { status: 400 });
    }

    // Decrement leaks using atomic operation
    const updatedUser = await db
      .update(users)
      .set({ 
        leaks: sql`${users.leaks} - ${amount}`
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        leaks: users.leaks
      });

    return NextResponse.json({
      success: true,
      message: `Successfully decremented ${amount} leak(s)`,
      data: {
        userId: updatedUser[0].id,
        previousLeaks: userLeaks,
        currentLeaks: updatedUser[0].leaks,
        decremented: amount
      }
    });

  } catch (error) {
    console.error('Error decrementing user leaks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to decrement user leaks'
    }, { status: 500 });
  }
}

// app/api/user/leaks/add/route.ts
// POST /api/user/leaks/add - Add leaks to user account
export async function addLeaks(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount = 1 } = body;
    const userId = body.userId || request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 401 });
    }

    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be greater than 0'
      }, { status: 400 });
    }

    // Get current user data
    const currentUser = await db
      .select({
        id: users.id,
        email: users.email,
        leaks: users.leaks,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const previousLeaks = currentUser[0].leaks || 0;

    // Add leaks using atomic operation
    const updatedUser = await db
      .update(users)
      .set({ 
        leaks: sql`${users.leaks} + ${amount}`
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        leaks: users.leaks
      });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${amount} leak(s)`,
      data: {
        userId: updatedUser[0].id,
        previousLeaks: previousLeaks,
        currentLeaks: updatedUser[0].leaks,
        added: amount
      }
    });

  } catch (error) {
    console.error('Error adding user leaks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add user leaks'
    }, { status: 500 });
  }
}

/*
Usage Examples:

GET /api/user/leaks?userId=user123
Headers: { "user-id": "user123" }

Response:
{
  "success": true,
  "data": {
    "userId": "user123",
    "leaks": 5,
    "email": "user@example.com"
  }
}

POST /api/user/leaks
Headers: { 
  "Content-Type": "application/json",
  "user-id": "user123" 
}
Body: { "amount": 2 }

Response:
{
  "success": true,
  "message": "Successfully decremented 2 leak(s)",
  "data": {
    "userId": "user123",
    "previousLeaks": 5,
    "currentLeaks": 3,
    "decremented": 2
  }
}

Error Response (Insufficient leaks):
{
  "success": false,
  "error": "Insufficient leaks",
  "data": {
    "currentLeaks": 1,
    "requested": 2
  }
}
*/