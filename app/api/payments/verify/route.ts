import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '../../../../lib/payment';
import DatabaseManager from '../../../../lib/mysql';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, reference } = body;

    if (!transactionId && !reference) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID or reference is required'
      }, { status: 400 });
    }

    // Verify payment with Flutterwave
    const verificationResult = await verifyPayment(transactionId);
    
    const db = DatabaseManager.getInstance();

    if (verificationResult.status === 'successful') {
      // Update payment status in database
      try {
        await db.execute(
          `UPDATE payments SET 
            status = 'completed',
            transaction_id = ?,
            gateway_response = ?,
            updated_at = NOW()
          WHERE reference_id = ?`,
          [
            transactionId,
            JSON.stringify(verificationResult.gatewayResponse),
            verificationResult.reference
          ]
        );

        // Get the payment record to update related entities
        const payment = await db.executeOne(
          'SELECT * FROM payments WHERE reference_id = ?',
          [verificationResult.reference]
        );

        if (payment) {
          // Update registration payment status if applicable
          if (payment.payment_type === 'registration' && payment.registration_id) {
            await db.execute(
              'UPDATE registrations SET payment_status = "completed", payment_reference = ? WHERE id = ?',
              [verificationResult.reference, payment.registration_id]
            );
          }

          // Update sponsorship payment status if applicable
          if (payment.payment_type === 'sponsorship' && payment.sponsorship_id) {
            await db.execute(
              'UPDATE sponsorships SET payment_status = "completed", payment_reference = ? WHERE id = ?',
              [verificationResult.reference, payment.sponsorship_id]
            );
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            status: 'completed',
            reference: verificationResult.reference,
            amount: verificationResult.amount,
            currency: verificationResult.currency,
            message: 'Payment verified successfully'
          }
        });

      } catch (dbError) {
        console.error('Database update error:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Payment verified but database update failed'
        }, { status: 500 });
      }

    } else if (verificationResult.status === 'failed') {
      // Update payment status as failed
      try {
        await db.execute(
          `UPDATE payments SET 
            status = 'failed',
            transaction_id = ?,
            gateway_response = ?,
            updated_at = NOW()
          WHERE reference_id = ?`,
          [
            transactionId,
            JSON.stringify(verificationResult.gatewayResponse),
            verificationResult.reference
          ]
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }

      return NextResponse.json({
        success: false,
        error: 'Payment verification failed'
      }, { status: 400 });

    } else {
      return NextResponse.json({
        success: true,
        data: {
          status: 'pending',
          reference: verificationResult.reference,
          message: 'Payment is still pending'
        }
      });
    }

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
