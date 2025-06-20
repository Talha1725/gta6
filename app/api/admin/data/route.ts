import { NextResponse } from 'next/server';
import { getAdminDashboardData } from '@/lib/db/queries';

// Force dynamic rendering since this route uses database queries
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    
    const data = await getAdminDashboardData();
    
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ API Error fetching admin data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}