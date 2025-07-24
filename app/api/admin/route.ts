import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get counts for each table
    const [
      registrationsCount,
      contactsCount, 
      abstractsCount
    ] = await Promise.all([
      db.executeOne('SELECT COUNT(*) as count FROM registrations'),
      db.executeOne('SELECT COUNT(*) as count FROM contacts'),
      db.executeOne('SELECT COUNT(*) as count FROM abstracts')
    ]);

    const stats = {
      registrations: registrationsCount?.count || 0,
      contacts: contactsCount?.count || 0,
      abstracts: abstractsCount?.count || 0,
      totalUsers: (registrationsCount?.count || 0) + (contactsCount?.count || 0)
    };
    
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
    const db = DatabaseManager.getInstance();
    
    let result;
    
    switch (type) {
      case 'registration':
        result = await db.executeOne(
          `INSERT INTO registrations (firstName, lastName, email, phone, organization, position, district, registrationType, specialRequirements, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [data.firstName, data.lastName, data.email, data.phone, data.organization, data.position, data.district, data.registrationType, data.specialRequirements || null]
        );
        break;
      case 'contact':
        result = await db.executeOne(
          `INSERT INTO contacts (name, email, phone, organization, subject, message, status, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())`,
          [data.name, data.email, data.phone || null, data.organization || null, data.subject, data.message]
        );
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
