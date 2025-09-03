import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll return mock data since we don't have payment proofs in DataManager
    // In a real implementation, this would fetch from the database
    const mockPayments = [
      {
        id: '1',
        registrationId: 'REG001',
        attendeeName: 'Dr. Sarah Johnson',
        email: 'sarah@health.go.ug',
        amount: 150,
        currency: 'USD',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN123456',
        status: 'pending',
        fileName: 'payment-proof-001.pdf',
        fileUrl: '/uploads/payment-proof-001.pdf',
        fileSize: 1024000,
        uploadedAt: '2025-08-30T10:00:00Z',
        verifiedAt: undefined,
        verifiedBy: undefined,
        comments: undefined
      },
      {
        id: '2',
        registrationId: 'REG002',
        attendeeName: 'Michael Chen',
        email: 'michael@startup.co',
        amount: 100,
        currency: 'USD',
        paymentMethod: 'Mobile Money',
        transactionId: 'TXN789012',
        status: 'verified',
        fileName: 'payment-proof-002.jpg',
        fileUrl: '/uploads/payment-proof-002.jpg',
        fileSize: 512000,
        uploadedAt: '2025-08-29T15:30:00Z',
        verifiedAt: '2025-08-30T09:00:00Z',
        verifiedBy: 'Admin',
        comments: 'Payment verified successfully'
      },
      {
        id: '3',
        registrationId: 'REG003',
        attendeeName: 'Amina Kone',
        email: 'amina@innovations.ng',
        amount: 120,
        currency: 'USD',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN345678',
        status: 'rejected',
        fileName: 'payment-proof-003.png',
        fileUrl: '/uploads/payment-proof-003.png',
        fileSize: 768000,
        uploadedAt: '2025-08-28T14:20:00Z',
        verifiedAt: '2025-08-29T11:00:00Z',
        verifiedBy: 'Admin',
        comments: 'Payment proof unclear, please resubmit'
      }
    ]
    
    return NextResponse.json({
      success: true,
      payments: mockPayments
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
