import { NextRequest, NextResponse } from 'next/server';
import { 
  createRegistrationPayment, 
  createSponsorshipPayment,
  PaymentType,
  formatCurrency,
  BANK_DETAILS 
} from '../../../lib/payment';
import DatabaseManager from '../../../lib/mysql';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      paymentType, 
      registrationType, 
      packageType,
      userEmail, 
      userName, 
      userPhone,
      companyName,
      formData
    } = body;

    // Validate required fields
    if (!paymentType || !userEmail || !userName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: paymentType, userEmail, userName'
      }, { status: 400 });
    }

    let paymentResponse;
    
    if (paymentType === PaymentType.REGISTRATION) {
      if (!registrationType) {
        return NextResponse.json({
          success: false,
          error: 'Missing required fields for registration: registrationType'
        }, { status: 400 });
      }

      // Create registration payment (without registrationId since we pay first)
      paymentResponse = await createRegistrationPayment(
        registrationType,
        userEmail,
        userName,
        userPhone || '',
        undefined // No registration ID yet since we pay first
      );

    } else if (paymentType === PaymentType.SPONSORSHIP) {
      if (!packageType || !companyName) {
        return NextResponse.json({
          success: false,
          error: 'Missing required fields for sponsorship: packageType, companyName'
        }, { status: 400 });
      }

      // Create sponsorship payment (without sponsorshipId since we pay first)
      paymentResponse = await createSponsorshipPayment(
        packageType,
        userEmail,
        companyName,
        userPhone || '',
        undefined // No sponsorship ID yet since we pay first
      );

    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment type'
      }, { status: 400 });
    }

    if (paymentResponse.status === 'success') {
      // Store payment record in database with form data
      const db = DatabaseManager.getInstance();
      
      try {
        const connection = await db.getConnection();
        await connection.execute(
          `INSERT INTO payments (
            reference_id, payment_type, amount, currency, email, name, phone,
            status, gateway_response, form_data, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            paymentResponse.reference,
            paymentType,
            paymentResponse.data?.amount || 0,
            paymentResponse.data?.currency || 'UGX',
            userEmail,
            userName,
            userPhone || null,
            'pending',
            JSON.stringify(paymentResponse.data),
            JSON.stringify(formData) // Store form data to create registration/sponsorship after payment
          ]
        );
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even if database insert fails
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentUrl: paymentResponse.paymentUrl,
          reference: paymentResponse.reference,
          amount: paymentResponse.data?.amount,
          currency: paymentResponse.data?.currency,
          message: 'Payment link created successfully',
          bankDetails: BANK_DETAILS,
          // Add inline payment data for frontend
          inlinePayment: {
            publicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
            email: userEmail,
            name: userName,
            phone: userPhone || '',
            description: paymentType === 'registration' ? `Conference Registration` : `Conference Sponsorship`
          }
        }
      });

    } else {
      // Payment creation failed, provide bank transfer option
      const db = DatabaseManager.getInstance();
      
      try {
        const connection = await db.getConnection();
        await connection.execute(
          `INSERT INTO payments (
            reference_id, payment_type, amount, currency, email, name, phone,
            status, gateway_response, form_data, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            paymentResponse.reference || `MANUAL_${Date.now()}`,
            paymentType,
            paymentResponse.data?.amount || 0,
            paymentResponse.data?.currency || 'UGX',
            userEmail,
            userName,
            userPhone || null,
            'pending_manual',
            JSON.stringify({ error: paymentResponse.message, fallback: 'bank_transfer' }),
            JSON.stringify(formData)
          ]
        );
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      return NextResponse.json({
        success: true, // Still success but with manual payment option
        data: {
          paymentUrl: null,
          reference: paymentResponse.reference || `MANUAL_${Date.now()}`,
          amount: paymentResponse.data?.amount,
          currency: paymentResponse.data?.currency,
          message: 'Online payment temporarily unavailable. Please use bank transfer.',
          bankDetails: BANK_DETAILS,
          fallbackPayment: true
        }
      });
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Payment reference is required'
      }, { status: 400 });
    }

    // Get payment details from database
    const db = DatabaseManager.getInstance();
    const connection = await db.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM payments WHERE reference_id = ?',
      [reference]
    );
    
    const payments = rows as any[];
    const payment = payments[0];

    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: payment.reference_id,
        paymentType: payment.payment_type,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        formattedAmount: formatCurrency(payment.amount, payment.currency),
        bankDetails: BANK_DETAILS
      }
    });

  } catch (error: any) {
    console.error('Payment retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
