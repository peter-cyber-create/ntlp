'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart3, Users, FileText, Building, Mail, LogOut, Menu
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.clear()
    router.push('/admin/login')
  }

  // If on login page or index page, don't show admin layout
  if (pathname === '/admin' || pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/images/uganda-coat-of-arms.png" alt="Uganda Coat of Arms" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">NACNDC & JASHConference 2025</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-64 bg-white shadow-lg min-h-screen">
            <nav className="mt-8 px-4">
              <div className="space-y-2">
                <Link
                  href="/admin/dashboard"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === '/admin/dashboard'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Overview
                </Link>
                <Link
                  href="/admin/registrations"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === '/admin/registrations'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Users className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Registrations
                </Link>
                <Link
                  href="/admin/abstracts"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === '/admin/abstracts'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FileText className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Abstracts
                </Link>
                <Link
                  href="/admin/contacts"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === '/admin/contacts'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Mail className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Contacts
                </Link>
                <Link
                  href="/admin/sponsorships"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === '/admin/sponsorships'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Building className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Sponsorships
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
