import { NextRequest, NextResponse } from 'next/server';
import { createPreorderEntry } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notes, selectedDate } = body;

    // Validate required fields
    if (!selectedDate) {
      return NextResponse.json({
        success: false,
        error: 'selectedDate is required'
      }, { status: 400 });
    }

    // Validate selectedDate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(selectedDate)) {
      return NextResponse.json({
        success: false,
        error: 'selectedDate must be in YYYY-MM-DD format'
      }, { status: 400 });
    }

    // Create releaseDate from selectedDate (set to end of day)
    const releaseDateTime = new Date(selectedDate + 'T23:59:59.999Z');
    
    // Validate the created date
    if (isNaN(releaseDateTime.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date provided'
      }, { status: 400 });
    }

  

    // Create the preorder entry
    const result = await createPreorderEntry(notes, selectedDate, releaseDateTime);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Preorder created successfully'
      });
    } else {
      console.error('Preorder creation error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Preorder creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}