import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get registrations with pagination
    const registrations = await db.execute(`
      SELECT 
        id,
        first_name as firstName,
        last_name as lastName,
        email,
        phone,
        organization,
        position,
        district,
        registration_type as registrationType,
        is_verified as isVerified,
        registration_date as registrationDate,
        payment_status as paymentStatus,
        special_requirements as specialRequirements,
        status,
        created_at as createdAt
      FROM registrations 
      ORDER BY registration_date DESC 
      LIMIT 50
    `);
    
    // Get stats
    const statsQueries = await Promise.all([
      db.executeOne('SELECT COUNT(*) as total FROM registrations'),
      db.executeOne('SELECT COUNT(*) as verified FROM registrations WHERE is_verified = 1'),
      db.executeOne('SELECT COUNT(*) as pending FROM registrations WHERE payment_status = ?', ['pending']),
      db.executeOne('SELECT COUNT(*) as completed FROM registrations WHERE payment_status = ?', ['completed']),
      db.execute(`
        SELECT registration_type, COUNT(*) as count 
        FROM registrations 
        GROUP BY registration_type
      `)
    ]);
    
    const stats = {
      total: statsQueries[0]?.total || 0,
      verified: statsQueries[1]?.verified || 0,
      pending: statsQueries[2]?.pending || 0,
      completed: statsQueries[3]?.completed || 0,
      byType: {} as any
    };
    
    // Process type stats
    statsQueries[4].forEach((row: any) => {
      stats.byType[row.registration_type] = row.count;
    });
    
    // Transform registrations to match frontend expectations
    const transformedRegistrations = registrations.map((reg: any) => ({
      _id: reg.id,
      firstName: reg.firstName,
      lastName: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      organization: reg.organization,
      position: reg.position,
      district: reg.district,
      registrationType: reg.registrationType,
      isVerified: reg.isVerified === 1,
      registrationDate: reg.registrationDate,
      paymentStatus: reg.paymentStatus,
      specialRequirements: reg.specialRequirements,
      status: reg.status || 'pending',
      createdAt: reg.createdAt || reg.registrationDate
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedRegistrations,
      stats,
      count: transformedRegistrations.length
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch registrations',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Connect to MySQL and handle submission
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'organization', 'position', 'district', 'registrationType'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const db = DatabaseManager.getInstance();
    
    const existingRegistration = await db.executeOne(
      'SELECT id FROM registrations WHERE email = ?',
      [body.email]
    );
    
    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered'
        },
        { status: 409 }
      );
    }
    
    // Insert new registration
    await db.execute(`
      INSERT INTO registrations (
        first_name, last_name, email, phone, organization, position, district,
        registration_type, is_verified, payment_status, special_requirements,
        status, registration_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, 'pending', NOW(), NOW())
    `, [
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.organization,
      body.position,
      body.district,
      body.registrationType,
      body.specialRequirements || null
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        registrationType: body.registrationType,
        status: 'pending',
        registrationDate: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance();
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { success: false, message: 'Registration IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',');
    const placeholders = idArray.map(() => '?').join(',');
    
    await db.execute(
      `DELETE FROM registrations WHERE id IN (${placeholders})`,
      idArray
    );

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${idArray.length} registration(s)`,
      deletedCount: idArray.length
    });

  } catch (error) {
    console.error('Error deleting registrations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete registrations',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance();
    const { ids, status } = await request.json();
    
    if (!ids || !status) {
      return NextResponse.json(
        { success: false, message: 'Registration IDs and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, confirmed, or cancelled' },
        { status: 400 }
      );
    }

    const placeholders = ids.map(() => '?').join(',');
    await db.execute(
      `UPDATE registrations SET status = ? WHERE id IN (${placeholders})`,
      [status, ...ids]
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${ids.length} registration(s)`,
      updatedCount: ids.length
    });

  } catch (error) {
    console.error('Error updating registrations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update registrations',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
