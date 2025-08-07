'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Clock, ArrowRight, CreditCard, Building } from 'lucide-react'

interface PaymentDetails {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  paymentType: string;
  formattedAmount: string;
}

// Bank details for alternative payment methods
const BANK_DETAILS = {
  bankName: 'Stanbic Bank Uganda',
  accountName: 'Makerere University School of Public Health',
  accountNumber: '9030005611449',
  branchCode: 'SBICUGKXXXX'
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id')
    const reference = searchParams.get('tx_ref')
    const status = searchParams.get('status')

    if (transactionId && reference) {
      verifyPayment(transactionId, reference)
    } else if (reference) {
      // Get payment details from our database
      fetchPaymentDetails(reference)
    } else {
      setError('Invalid payment callback parameters')
      setLoading(false)
    }
  }, [searchParams])

  const verifyPayment = async (transactionId: string, reference: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, reference }),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentDetails({
          reference: result.data.reference,
          status: result.data.status,
          amount: result.data.amount,
          currency: result.data.currency,
          paymentType: 'registration', // Default, will be updated when we fetch details
          formattedAmount: formatCurrency(result.data.amount, result.data.currency)
        })
      } else {
        setError(result.error || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setError('Failed to verify payment')
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentDetails = async (reference: string) => {
    try {
      const response = await fetch(`/api/payments?reference=${reference}`)
      const result = await response.json()

      if (result.success) {
        setPaymentDetails({
          reference: result.data.reference,
          status: result.data.status,
          amount: result.data.amount,
          currency: result.data.currency,
          paymentType: result.data.paymentType,
          formattedAmount: result.data.formattedAmount
        })
      } else {
        setError(result.error || 'Payment not found')
      }
    } catch (error) {
      console.error('Payment fetch error:', error)
      setError('Failed to fetch payment details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'successful':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'pending':
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed':
      case 'successful':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          color: 'text-green-600'
        }
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          color: 'text-red-600'
        }
      case 'pending':
      default:
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. You will receive a confirmation shortly.',
          color: 'text-yellow-600'
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/register" 
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Return to Registration
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-gray-600">No payment details found</p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusMessage(paymentDetails.status)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Payment Status</h1>
            <p className="text-primary-100 mt-2">NACNDC & JASHConference 2025</p>
          </div>

          {/* Status Section */}
          <div className="p-8 text-center">
            <div className="mb-6">
              {getStatusIcon(paymentDetails.status)}
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
              {statusInfo.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {statusInfo.message}
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-sm">{paymentDetails.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{paymentDetails.formattedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{paymentDetails.paymentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`capitalize font-medium ${statusInfo.color}`}>
                    {paymentDetails.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Payment Methods */}
            {(paymentDetails.status === 'pending' || paymentDetails.status === 'failed') && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Alternative Payment Method
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can also pay directly via bank transfer using the details below:
                </p>
                <div className="bg-white rounded border p-4 text-left text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <strong>Account Name:</strong><br />
                      {BANK_DETAILS.accountName}
                    </div>
                    <div>
                      <strong>Account Number:</strong><br />
                      {BANK_DETAILS.accountNumber}
                    </div>
                    <div>
                      <strong>Bank:</strong><br />
                      {BANK_DETAILS.bankName}
                    </div>
                    <div>
                      <strong>Swift Code:</strong><br />
                      {BANK_DETAILS.branchCode}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      For USD payments: Use intermediary bank Citibank New York (CITIUS33)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {paymentDetails.status === 'completed' || paymentDetails.status === 'successful' ? (
                <>
                  <a 
                    href="/" 
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Return to Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <a 
                    href="/register" 
                    className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Register Another Person
                  </a>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Check Payment Status
                  </button>
                  <a 
                    href="/register" 
                    className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• If you experience any issues with your payment, please contact our support team.</p>
            <p>• Keep your payment reference number for future correspondence.</p>
            <p>• For bank transfer payments, please email the transaction receipt to: conference@idi.co.ug</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              Support: conference@idi.co.ug | +256 XXX XXX XXX
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Clock className="mx-auto h-16 w-16 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mt-4">Loading payment details...</h2>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
