import React from 'react'
import { 
  BarChart3, Users, FileText, CreditCard, Building, Mail, 
  Award, Calendar, BookOpen, TrendingUp, LogOut, Menu
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3, href: '/admin/dashboard' },
    { id: 'registrations', name: 'Registrations', icon: Users, href: '/admin/registrations' },
    { id: 'abstracts', name: 'Abstracts', icon: FileText, href: '/admin/abstracts' },
    { id: 'contacts', name: 'Contacts', icon: Mail, href: '/admin/contacts' },
    { id: 'speakers', name: 'Speakers', icon: Award, href: '/admin/speakers' },
    { id: 'sessions', name: 'Sessions', icon: Calendar, href: '/admin/sessions' },
    { id: 'sponsorships', name: 'Sponsorships', icon: Building, href: '/admin/sponsorships' },
    { id: 'payments', name: 'Payments', icon: CreditCard, href: '/admin/payments' },
    { id: 'reviews', name: 'Reviews', icon: BookOpen, href: '/admin/reviews' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, href: '/admin/analytics' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_session')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gray-50 admin-content">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">NACNDC & JASHConference 2025</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
