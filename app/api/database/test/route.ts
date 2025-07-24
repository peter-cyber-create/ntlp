import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    const healthCheck = await db.healthCheck();
    
    return NextResponse.json({
      success: healthCheck.status === 'healthy',
      message: healthCheck.status === 'healthy' ? 'MySQL connection successful' : 'MySQL connection failed',
      mysql: healthCheck.details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Create a test record
    const testDoc = {
      message: 'Hello from Uganda Health Conference!',
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    };
    
    await db.execute(`
      INSERT INTO test_records (message, timestamp, environment)
      VALUES (?, NOW(), ?)
    `, [testDoc.message, testDoc.environment]);
    
    return NextResponse.json({
      success: true,
      message: 'Test record created successfully',
      document: testDoc
    });
  } catch (error) {
    console.error('Database write error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database write failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
