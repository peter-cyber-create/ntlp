import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, verifyPayment } from '../../../../lib/payment';
import DatabaseManager from '../../../../lib/mysql';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature
    const body = await request.text();
    const signature = request.headers.get('verif-hash') || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({
        success: false,
        error: 'Invalid signature'
      }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    const { event, data } = webhookData;

    console.log('Webhook received:', event, data);

    if (event === 'charge.completed' && data) {
      const { id: transactionId, tx_ref: reference, status } = data;

      // Verify the payment status
      const verificationResult = await verifyPayment(transactionId);
      
      const db = DatabaseManager.getInstance();

      if (verificationResult.status === 'successful') {
        try {
          // Update payment status in database
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
              reference
            ]
          );

          // Get the payment record to process form data
          const [rows] = await db.getConnection().then(conn => 
            conn.execute('SELECT * FROM payments WHERE reference_id = ?', [reference])
          );
          const payments = rows as any[];
          const payment = payments[0];

          if (payment && payment.form_data) {
            const formData = JSON.parse(payment.form_data);
            
            // Create registration if payment was for registration
            if (payment.payment_type === 'registration') {
              try {
                const [result] = await db.getConnection().then(conn =>
                  conn.execute(`
                    INSERT INTO registrations (
                      firstName, lastName, email, phone, organization, position,
                      district, country, registrationType, specialRequirements,
                      dietary_requirements, payment_status, payment_amount,
                      payment_currency, payment_reference, status, registration_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?, 'confirmed', NOW())
                  `, [
                    formData.firstName,
                    formData.lastName,
                    formData.email,
                    formData.phone,
                    formData.organization,
                    formData.position,
                    formData.district || 'Kampala',
                    formData.country || 'Uganda',
                    formData.registrationType,
                    formData.specialRequirements || null,
                    formData.dietaryRequirements || null,
                    payment.amount,
                    payment.currency,
                    reference
                  ])
                );

                const registrationId = (result as any).insertId;
                
                // Update payment record with registration_id
                await db.getConnection().then(conn =>
                  conn.execute(
                    'UPDATE payments SET registration_id = ? WHERE reference_id = ?',
                    [registrationId, reference]
                  )
                );
                
                console.log(`Registration created: ${registrationId} for payment: ${reference}`);
              } catch (regError) {
                console.error('Registration creation error:', regError);
              }
            }

            // Create sponsorship if payment was for sponsorship
            if (payment.payment_type === 'sponsorship') {
              try {
                const [result] = await db.getConnection().then(conn =>
                  conn.execute(`
                    INSERT INTO sponsorships (
                      company_name, contact_person, email, phone, package_type,
                      payment_status, payment_amount, payment_currency, payment_reference,
                      status, created_at
                    ) VALUES (?, ?, ?, ?, ?, 'completed', ?, ?, ?, 'confirmed', NOW())
                  `, [
                    formData.companyName,
                    formData.contactPerson,
                    formData.email,
                    formData.phone,
                    formData.packageType,
                    payment.amount,
                    payment.currency,
                    reference
                  ])
                );

                const sponsorshipId = (result as any).insertId;
                
                // Update payment record with sponsorship_id
                await db.getConnection().then(conn =>
                  conn.execute(
                    'UPDATE payments SET sponsorship_id = ? WHERE reference_id = ?',
                    [sponsorshipId, reference]
                  )
                );
                
                console.log(`Sponsorship created: ${sponsorshipId} for payment: ${reference}`);
              } catch (sponsorError) {
                console.error('Sponsorship creation error:', sponsorError);
              }
            }
          }

          // Send confirmation emails here if needed
          // await sendPaymentConfirmationEmail(payment);

        } catch (dbError) {
          console.error('Database update error in webhook:', dbError);
        }

      } else if (verificationResult.status === 'failed') {
        try {
          // Update payment status as failed
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
              reference
            ]
          );
          
          console.log(`Payment failed: ${reference}`);
        } catch (dbError) {
          console.error('Database update error for failed payment:', dbError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed'
    }, { status: 500 });
  }
}
