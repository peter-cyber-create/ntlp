import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, connectToMongoose } from '@/lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB native driver connection
    const { client, db } = await connectToDatabase();
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    // Test Mongoose connection
    await connectToMongoose();
    
    // Get database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      mongodb: {
        ping: result.ok === 1 ? 'success' : 'failed',
        database: db.databaseName,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize
      },
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
    const { db } = await connectToDatabase();
    
    // Create a test document
    const testCollection = db.collection('test');
    const testDoc = {
      message: 'Hello from Uganda Health Conference!',
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    };
    
    const result = await testCollection.insertOne(testDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Test document created successfully',
      insertedId: result.insertedId,
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
