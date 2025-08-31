import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // In a real implementation, this would update the database
    // For now, we'll return a success response
    if (body.status) {
      return NextResponse.json({
        success: true,
        message: `Payment status updated to ${body.status}`,
        payment: {
          id,
          status: body.status,
          comments: body.comments,
          verifiedAt: body.status === 'verified' ? new Date().toISOString() : undefined,
          verifiedBy: body.status === 'verified' ? 'Admin' : undefined
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // In a real implementation, this would fetch from the database
    // For now, we'll return a mock payment
    const mockPayment = {
      id,
      registrationId: `REG${id.padStart(3, '0')}`,
      attendeeName: 'Sample Attendee',
      email: 'sample@example.com',
      amount: 100,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      status: 'pending',
      fileName: 'payment-proof.pdf',
      fileUrl: '/uploads/payment-proof.pdf',
      fileSize: 1024000,
      uploadedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      payment: mockPayment
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}
