import { NextRequest, NextResponse } from 'next/server';
import { preorderService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const preorders = await preorderService.getAllPreorders();
    
    return NextResponse.json({
      success: true,
      data: preorders
    });
  } catch (error) {
    console.error('❌ Error fetching preorders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch preorders',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}