import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get contacts with pagination
    const contacts = await db.execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        organization,
        subject,
        message,
        status,
        submitted_at as submittedAt,
        responded_at as respondedAt
      FROM contacts 
      ORDER BY submitted_at DESC 
      LIMIT 50
    `);
    
    // Get stats
    const statsQueries = await Promise.all([
      db.executeOne('SELECT COUNT(*) as total FROM contacts'),
      db.executeOne('SELECT COUNT(*) as new FROM contacts WHERE status = ?', ['new']),
      db.executeOne('SELECT COUNT(*) as inProgress FROM contacts WHERE status = ?', ['in-progress']),
      db.executeOne('SELECT COUNT(*) as resolved FROM contacts WHERE status = ?', ['resolved'])
    ]);
    
    const stats = {
      total: statsQueries[0]?.total || 0,
      new: statsQueries[1]?.new || 0,
      inProgress: statsQueries[2]?.inProgress || 0,
      resolved: statsQueries[3]?.resolved || 0
    };
    
    // Transform contacts to match frontend expectations
    const transformedContacts = contacts.map((contact: any) => ({
      _id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      organization: contact.organization,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      submittedAt: contact.submittedAt,
      respondedAt: contact.respondedAt,
      createdAt: contact.submittedAt // For backward compatibility
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedContacts,
      stats,
      count: transformedContacts.length
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contacts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance();
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
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
    
    // Insert new contact
    await db.execute(`
      INSERT INTO contacts (
        name, email, phone, organization, subject, message, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
    `, [
      body.name,
      body.email,
      body.phone || null,
      body.organization || null,
      body.subject,
      body.message
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        status: 'new',
        submittedAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact message',
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
        { success: false, message: 'Contact IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',');
    const placeholders = idArray.map(() => '?').join(',');
    
    const result = await db.execute(
      `DELETE FROM contacts WHERE id IN (${placeholders})`,
      idArray
    );

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${idArray.length} contact(s)`,
      deletedCount: idArray.length
    });

  } catch (error) {
    console.error('Error deleting contacts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete contacts',
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
        { success: false, message: 'Contact IDs and status are required' },
        { status: 400 }
      );
    }

    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be new, in-progress, or resolved' },
        { status: 400 }
      );
    }

    const placeholders = ids.map(() => '?').join(',');
    const result = await db.execute(
      `UPDATE contacts SET status = ?, responded_at = NOW() WHERE id IN (${placeholders})`,
      [status, ...ids]
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${ids.length} contact(s)`,
      updatedCount: ids.length
    });

  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update contacts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
