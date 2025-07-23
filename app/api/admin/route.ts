import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/databaseManager';

export async function GET() {
  try {
    const dbManager = DatabaseManager.getInstance();
    const stats = await dbManager.getStatistics();
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    const dbManager = DatabaseManager.getInstance();
    
    let result;
    
    switch (type) {
      case 'registration':
        result = await dbManager.createRegistration(data);
        break;
      case 'contact':
        result = await dbManager.createContact(data);
        break;
      case 'speaker':
        result = await dbManager.createSpeaker(data);
        break;
      case 'partner':
        result = await dbManager.createPartner(data);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type specified' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `${type} created successfully`,
      data: result
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create record',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
