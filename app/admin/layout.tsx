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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return
      
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')
      
      if (!token || !session) {
        setIsAuthenticated(false)
        setIsLoading(false)
        if (pathname !== '/admin/login') {
          setIsRedirecting(true)
          router.replace('/admin/login')
        }
        return
      }

      const sessionTime = parseInt(session)
      const currentTime = Date.now()
      const sessionValid = currentTime - sessionTime < 24 * 60 * 60 * 1000

      if (!sessionValid) {
        localStorage.clear()
        setIsAuthenticated(false)
        setIsLoading(false)
        setIsRedirecting(true)
        router.replace('/admin/login')
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    router.replace('/admin/login')
  }

  // If on login page, don't show admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verifying access...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if not authenticated
  if (!isAuthenticated || isRedirecting) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 mb-4 text-xl font-semibold'>Access Denied</div>
          <p className='text-gray-600 mb-4'>You must be logged in to access this page.</p>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
          <p className='text-gray-500 mt-2'>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
              >
                <Menu className='h-6 w-6' />
              </button>
              <div className='flex items-center space-x-3'>
                <img src='/images/uganda-coat-of-arms.png' alt='Uganda Coat of Arms' className='w-8 h-8' />
                <h1 className='text-xl font-semibold text-gray-900'>Admin Panel</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
            >
              <LogOut className='h-4 w-4' />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className='h-full flex flex-col'>
            <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
              <nav className='mt-5 flex-1 px-2 space-y-1'>
                <Link href='/admin/dashboard' className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/dashboard' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <BarChart3 className='mr-3 h-5 w-5' />
                  Dashboard
                </Link>
                <Link href='/admin/registrations' className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/registrations' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Users className='mr-3 h-5 w-5' />
                  Registrations
                </Link>
                <Link href='/admin/abstracts' className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/abstracts' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <FileText className='mr-3 h-5 w-5' />
                  Abstracts
                </Link>
                <Link href='/admin/contacts' className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/contacts' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Mail className='mr-3 h-5 w-5' />
                  Contacts
                </Link>
                <Link href='/admin/sponsorships' className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/sponsorships' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Building className='mr-3 h-5 w-5' />
                  Sponsorships
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 lg:pl-0'>
          <main className='py-6'>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className='fixed inset-0 z-40 lg:hidden' onClick={() => setIsSidebarOpen(false)}>
          <div className='fixed inset-0 bg-gray-600 bg-opacity-75'></div>
        </div>
      )}
    </div>
  )
}
