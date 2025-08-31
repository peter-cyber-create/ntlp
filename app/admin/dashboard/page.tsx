'use client'

import React, { useState, useEffect } from 'react'
import {
  Users, FileText, CreditCard, Building, Mail,
  Award, LogOut
} from 'lucide-react'

interface DashboardData {
  registrations: {
    total: number
    approved: number
    submitted: number
    underReview: number
    rejected: number
    newThisWeek: number
  }
  abstracts: {
    total: number
    approved: number
    submitted: number
    underReview: number
    accepted: number
    rejected: number
    newThisWeek: number
  }
  contacts: {
    total: number
    submitted: number
    underReview: number
    responded: number
    requiresFollowup: number
    newThisWeek: number
  }
  sponsorships: {
    total: number
    submitted: number
    underReview: number
    approved: number
    negotiating: number
  }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Backend API URL
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Starting to load dashboard data...')
      setIsLoading(true)
      setError(null)

      console.log('Fetching from:', `${BACKEND_API_URL}/api/registrations`)
      
      // Fetch real data from backend endpoints
      const [registrationsResponse, abstractsResponse] = await Promise.all([
        fetch(`${BACKEND_API_URL}/api/registrations`),
        fetch(`${BACKEND_API_URL}/api/abstracts`)
      ])

      console.log('Responses received:', { 
        registrations: registrationsResponse.status, 
        abstracts: abstractsResponse.status 
      })

      if (registrationsResponse.ok && abstractsResponse.ok) {
        const registrationsData = await registrationsResponse.json()
        const abstractsData = await abstractsResponse.json()

        console.log('Data received:', { registrationsData, abstractsData })

        // Process the data for dashboard display
        const dashboardStats: DashboardData = {
          registrations: {
            total: registrationsData.pagination?.total || 0,
            approved: registrationsData.registrations?.filter((r: any) => r.status === 'approved').length || 0,
            submitted: registrationsData.registrations?.filter((r: any) => r.status === 'submitted').length || 0,
            underReview: registrationsData.registrations?.filter((r: any) => r.status === 'under_review').length || 0,
            rejected: registrationsData.registrations?.filter((r: any) => r.status === 'rejected').length || 0,
            newThisWeek: 0 // Calculate this if needed
          },
          abstracts: {
            total: abstractsData.pagination?.total || 0,
            approved: abstractsData.abstracts?.filter((a: any) => a.status === 'approved').length || 0,
            submitted: abstractsData.abstracts?.filter((a: any) => a.status === 'submitted').length || 0,
            underReview: abstractsData.abstracts?.filter((a: any) => a.status === 'under_review').length || 0,
            accepted: abstractsData.abstracts?.filter((a: any) => a.status === 'accepted').length || 0,
            rejected: abstractsData.abstracts?.filter((a: any) => a.status === 'rejected').length || 0,
            newThisWeek: 0 // Calculate this if needed
          },
          contacts: {
            total: 0,
            submitted: 0,
            underReview: 0,
            responded: 0,
            requiresFollowup: 0,
            newThisWeek: 0
          },
          sponsorships: {
            total: 0,
            submitted: 0,
            underReview: 0,
            approved: 0,
            negotiating: 0
          }
        }

        console.log('Dashboard stats processed:', dashboardStats)
        setDashboardData(dashboardStats)
      } else {
        console.error('Failed to load data:', { registrations: registrationsResponse.status, abstracts: abstractsResponse.status })
        setError('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      console.log('Setting loading to false')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comprehensive dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">NACNDC & JASHConference 2025 - Conference Management</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.registrations?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-green-600">✓ {dashboardData?.registrations?.approved || 0} Approved</div>
            <div className="text-yellow-600">⏳ {dashboardData?.registrations?.submitted || 0} Pending</div>
          </div>
        </div>

        {/* Abstracts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.abstracts?.total || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-green-600">✓ {dashboardData?.abstracts?.approved || 0} Approved</div>
            <div className="text-yellow-600">⏳ {dashboardData?.abstracts?.submitted || 0} Pending</div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.contacts?.total || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-green-600">✓ {dashboardData?.contacts?.responded || 0} Responded</div>
            <div className="text-yellow-600">⏳ {dashboardData?.contacts?.submitted || 0} Pending</div>
          </div>
        </div>

        {/* Sponsorships */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sponsorships</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.sponsorships?.total || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-green-600">✓ {dashboardData?.sponsorships?.approved || 0} Approved</div>
            <div className="text-yellow-600">⏳ {dashboardData?.sponsorships?.submitted || 0} Pending</div>
          </div>
        </div>
      </div>

      {/* Data Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.registrations?.newThisWeek || 0}</div>
            <div className="text-sm text-gray-600">New Registrations This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{dashboardData?.abstracts?.newThisWeek || 0}</div>
            <div className="text-sm text-gray-600">New Abstracts This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{dashboardData?.contacts?.newThisWeek || 0}</div>
            <div className="text-sm text-gray-600">New Contacts This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{dashboardData?.sponsorships?.total || 0}</div>
            <div className="text-sm text-gray-600">Total Sponsorships</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-900 font-medium">Review Registrations</span>
          </button>
          <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-green-900 font-medium">Review Abstracts</span>
          </button>
          <button className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Mail className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-purple-900 font-medium">Respond to Contacts</span>
          </button>
          <button className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <Building className="h-5 w-5 text-orange-600 mr-3" />
            <span className="text-orange-900 font-medium">Review Sponsorships</span>
          </button>

          <button className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <LogOut className="h-5 w-5 text-red-600 mr-3" />
            <span className="text-red-900 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Dashboard last updated: {new Date().toLocaleString()}</p>
        <p>Total records in system: {(dashboardData?.registrations?.total || 0) + (dashboardData?.abstracts?.total || 0) + (dashboardData?.contacts?.total || 0) + (dashboardData?.sponsorships?.total || 0)}</p>
      </div>
    </div>
  )
}
