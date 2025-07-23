import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import { Registration } from '@/lib/models';

export async function GET() {
  try {
    await connectToMongoose();
    
    const registrations = await Registration.find({})
      .sort({ registrationDate: -1 })
      .limit(50);
    
    const stats = {
      total: await Registration.countDocuments(),
      verified: await Registration.countDocuments({ isVerified: true }),
      pending: await Registration.countDocuments({ paymentStatus: 'pending' }),
      completed: await Registration.countDocuments({ paymentStatus: 'completed' }),
      byType: {
        earlyBird: await Registration.countDocuments({ registrationType: 'early-bird' }),
        regular: await Registration.countDocuments({ registrationType: 'regular' }),
        student: await Registration.countDocuments({ registrationType: 'student' })
      }
    };
    
    return NextResponse.json({
      success: true,
      data: registrations,
      stats,
      count: registrations.length
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
    await connectToMongoose();
    
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
    const existingRegistration = await Registration.findOne({ email: body.email });
    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered'
        },
        { status: 409 }
      );
    }
    
    // Create new registration
    const registration = new Registration(body);
    const savedRegistration = await registration.save();
    
    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      data: savedRegistration
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
