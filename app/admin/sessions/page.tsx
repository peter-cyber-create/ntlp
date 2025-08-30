'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Presentation } from 'lucide-react'

export default function SessionsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      window.location.href = '/admin'
      return
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
        <p className="text-gray-600">Manage conference sessions and schedules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Keynote Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Keynote Sessions</p>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Presentation className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Published Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published Sessions</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conference Sessions</h3>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Yet</h3>
          <p className="text-gray-500">Session information will appear here once sessions are created.</p>
        </div>
      </div>
    </div>
  )
}
