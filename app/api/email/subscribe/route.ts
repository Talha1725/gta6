// app/api/email/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { email } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering since this route uses request body
export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool, { schema: { email } });

export async function POST(request: NextRequest) {
  try {
    const { email: emailAddress } = await request.json();

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = emailAddress.trim().toLowerCase();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(email)
      .where(eq(email.emailAddress, cleanEmail))
      .limit(1);

    if (existing.length > 0) {
      // Update the existing record
      await db.update(email)
        .set({ status: 'active', updatedAt: new Date() })
        .where(eq(email.emailAddress, cleanEmail));
      return NextResponse.json({
        success: true,
        message: 'Email subscription updated!'
      });
    }

    // Insert new email with verification
    const insertResult = await db.insert(email).values({
      emailAddress: cleanEmail,
      status: 'active',
      subscribedAt: new Date(),
      createdAt: new Date()
    }).returning();

    // Check if insert was successful
    if (!insertResult || insertResult.length === 0) {
      console.error('❌ Insert failed - no result returned');
      return NextResponse.json({
        success: false,
        error: 'Failed to store email. Please try again.'
      }, { status: 500 });
    }

    const storedEmail = insertResult[0];

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to GTA 6 updates!'
    });

  } catch (error: any) {
    console.error('❌ Email subscription error:', error);

    // Handle duplicate email constraint
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json({
        success: false,
        error: 'This email is already subscribed to our updates!'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe. Please try again.'
    }, { status: 500 });
  }
}