'use client'

import { useState, useEffect } from 'react'

export default function TestAPIPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true)
        setError(null)

        const [registrationsResponse, abstractsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts`)
        ])

        if (registrationsResponse.ok && abstractsResponse.ok) {
          const registrationsData = await registrationsResponse.json()
          const abstractsData = await abstractsResponse.json()

          setData({
            registrations: registrationsData,
            abstracts: abstractsData
          })
        } else {
          setError(`API calls failed: registrations=${registrationsResponse.status}, abstracts=${abstractsResponse.status}`)
        }
      } catch (error) {
        setError(`Error: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing API calls...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ API Test Failed</div>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Registrations</h2>
            <div className="space-y-2">
              <p><strong>Total:</strong> {data.registrations.pagination.total}</p>
              <p><strong>Status:</strong> {data.registrations.registrations.map((r: any) => r.status).join(', ')}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Abstracts</h2>
            <div className="space-y-2">
              <p><strong>Total:</strong> {data.abstracts.pagination.total}</p>
              <p><strong>Status:</strong> {data.abstracts.abstracts.map((a: any) => a.status).join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-green-600 text-lg">✅ API calls successful! Frontend can connect to backend.</p>
        </div>
      </div>
    </div>
  )
}
