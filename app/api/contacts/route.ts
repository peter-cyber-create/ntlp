import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import { Contact } from '@/lib/models';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToMongoose();
    
    const contacts = await Contact.find({})
      .sort({ submittedAt: -1 })
      .limit(50);
    
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      inProgress: await Contact.countDocuments({ status: 'in-progress' }),
      resolved: await Contact.countDocuments({ status: 'resolved' })
    };
    
    return NextResponse.json({
      success: true,
      data: contacts,
      stats,
      count: contacts.length
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
    await connectToMongoose();
    
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
    
    // Create new contact
    const contact = new Contact(body);
    const savedContact = await contact.save();
    
    return NextResponse.json({
      success: true,
      message: 'Contact message submitted successfully',
      data: savedContact
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
    await connectToMongoose();
    
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { success: false, message: 'Contact IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',');
    const result = await Contact.deleteMany({ _id: { $in: idArray } });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} contact(s)`,
      deletedCount: result.deletedCount
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
    await connectToMongoose();
    
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

    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      { status, updatedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} contact(s)`,
      updatedCount: result.modifiedCount
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
