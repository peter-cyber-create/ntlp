import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Helper function to get ticket price based on registration type
function getTicketPrice(registrationType: string): number {
  const prices = {
    'undergrad': 100000, // UGX 100,000
    'grad': 150000,      // UGX 150,000
    'local': 350000,     // UGX 350,000
    'intl': 300,         // USD 300
    'online': 50         // USD 50 (will be converted to UGX for local users)
  };
  return prices[registrationType as keyof typeof prices] || 0;
}

// Helper function to get currency based on registration type
function getTicketCurrency(registrationType: string): string {
  const currencies = {
    'undergrad': 'UGX',
    'grad': 'UGX',
    'local': 'UGX',
    'intl': 'USD',
    'online': 'USD' // Can be USD or UGX depending on location
  };
  return currencies[registrationType as keyof typeof currencies] || 'UGX';
}

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get registrations with pagination
    const registrations = await db.execute(`
      SELECT 
        id,
        firstName,
        lastName,
        email,
        phone,
        organization,
        position,
        district,
        registrationType,
        specialRequirements,
        is_verified as isVerified,
        payment_status as paymentStatus,
        payment_amount as paymentAmount,
        payment_currency as paymentCurrency,
        payment_reference as paymentReference,
        status,
        registration_date as registrationDate,
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
      first_name: reg.firstName,
      last_name: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      organization: reg.organization,
      position: reg.position,
      district: reg.district,
      registrationType: reg.registrationType,
      isVerified: reg.isVerified === 1,
      registrationDate: reg.registrationDate,
      paymentStatus: reg.paymentStatus,
      specialRequirements: reg.specialRequirements || reg.specialrequirements,
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
    
    // Validate required fields based on frontend form
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'organization', 'position', 'district', 'registrationType'];
    const missingFields = requiredFields.filter(field => {
      const value = field === 'registrationType' ? body.registrationType : body[field];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
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

    // Validate registration type
    const validRegistrationTypes = ['undergrad', 'grad', 'local', 'intl', 'online'];
    if (!validRegistrationTypes.includes(body.registrationType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid registration type',
          validTypes: validRegistrationTypes
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format'
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
    const registrationData = {
      firstName: body.firstName || body.first_name,
      lastName: body.lastName || body.last_name,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
      position: body.position,
      district: body.district,
      registrationType: body.registrationType,
      specialRequirements: body.special_needs || body.specialRequirements || null,
      payment_amount: getTicketPrice(body.registrationType),
      payment_currency: getTicketCurrency(body.registrationType)
    };

    const result = await db.execute(`
      INSERT INTO registrations (
        firstName, lastName, email, phone, organization, position, district,
        registrationType, specialRequirements, is_verified, payment_status, 
        payment_amount, payment_currency, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?, 'pending', NOW(), NOW())
    `, [
      registrationData.firstName,
      registrationData.lastName,
      registrationData.email,
      registrationData.phone,
      registrationData.organization,
      registrationData.position,
      registrationData.district,
      registrationData.registrationType,
      registrationData.specialRequirements,
      registrationData.payment_amount,
      registrationData.payment_currency
    ]) as any;

    // Get the newly created registration ID
    const newRegistrationId = result.insertId || Date.now();
    
    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      data: {
        id: newRegistrationId,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        registrationType: registrationData.registrationType,
        district: registrationData.district,
        organization: registrationData.organization,
        payment_amount: registrationData.payment_amount,
        payment_currency: registrationData.payment_currency,
        status: 'pending',
        payment_status: 'pending',
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
