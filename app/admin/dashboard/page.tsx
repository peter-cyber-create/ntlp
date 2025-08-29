'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import DataManager from '../../../lib/dataManager'
import AnalyticsCharts from '../../../components/AnalyticsCharts'
import { 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  UserPlus,
  MessageSquare,
  Globe,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Upload,
  Menu,
  X,
  ExternalLink,
  CreditCard,
  Building
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [selectedAbstracts, setSelectedAbstracts] = useState<string[]>([])
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [selectedSponsorships, setSelectedSponsorships] = useState<string[]>([])
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalRegistrations: 9,
      pendingRegistrations: 6,
      totalSpeakers: 5,
      contactSubmissions: 12,
      totalPayments: 8,
      completedPayments: 3,
      totalSponsorships: 4,
      confirmedSponsorships: 2,
      totalRevenue: 2500000,
      websiteViews: 15420,
      conversionRate: 75
    }
  })
  const [dataManager, setDataManager] = useState<DataManager | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [abstractsData, setAbstractsData] = useState<any[]>([])
  const [abstractStats, setAbstractStats] = useState<any>({})
  const [loadingAbstracts, setLoadingAbstracts] = useState(false)
  const [registrationsData, setRegistrationsData] = useState<any[]>([])
  const [registrationStats, setRegistrationStats] = useState<any>({
    total: 9,
    submitted: 6,
    approved: 3
  })
  const [contactsData, setContactsData] = useState<any[]>([])
  const [contactStats, setContactStats] = useState<any>({})
  const [paymentsData, setPaymentsData] = useState<any[]>([])
  const [paymentStats, setPaymentStats] = useState<any>({})
  const [sponsorshipsData, setSponsorshipsData] = useState<any[]>([])
  const [sponsorshipStats, setSponsorshipStats] = useState<any>({})
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formSubmissions, setFormSubmissions] = useState<any[]>([]);
  const [submissionStats, setSubmissionStats] = useState<any>({});

  // Notification helper function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const sessionTime = localStorage.getItem('admin_session')
    
    if (!isAuthenticated || !sessionTime) {
      window.location.href = '/admin'
      return
    }
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - parseInt(sessionTime)
    if (sessionAge > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_session')
      window.location.href = '/admin'
      return
    }

    console.log('✅ Authentication passed, dashboard should render');
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_session')
    window.location.href = '/admin'
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{dashboardData.stats.totalRegistrations}</p>
              <p className="text-xs sm:text-sm text-green-600">+12% from last week</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="text-primary-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{dashboardData.stats.pendingRegistrations}</p>
              <p className="text-xs sm:text-sm text-orange-600">Requires attention</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Speakers</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalSpeakers}</p>
              <p className="text-sm text-blue-600">3 pending confirmation</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.contactSubmissions}</p>
              <p className="text-sm text-purple-600">8 new today</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Website Views</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.websiteViews?.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.conversionRate}%</p>
              <p className="text-sm text-green-600">Above industry avg</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <Image
                src="/images/uganda-coat-of-arms.png"
                alt="Uganda Coat of Arms"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600">NACNDC & JASHConference 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => window.open(window.location.origin, '_blank')}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
              title="View Main Site"
            >
              <Globe size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          w-64 bg-white border-r border-gray-200
          lg:min-h-screen
        `}>
          <nav className="p-4 sm:p-6">
            <ul className="space-y-1 sm:space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'registrations', label: 'Registrations', icon: Users },
                { id: 'abstracts', label: 'Abstracts', icon: FileText },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'sponsorships', label: 'Sponsorships', icon: Building },
                { id: 'contacts', label: 'Contacts', icon: Mail },
                { id: 'export', label: 'Export', icon: Download },
                { id: 'speakers', label: 'Speakers', icon: UserPlus }
              ].map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 p-2 sm:p-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 lg:ml-0 min-h-screen">
          {/* Professional Header */}
          <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  NACNDC & JASHConference 2025 - Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage registrations, abstracts, and communications
                </p>
              </div>
              <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex-1 sm:flex-none text-center">
                  <span className="text-blue-600 font-medium">
                    {registrationsData.length || 9} Registrations
                  </span>
                </div>
                <div className="bg-green-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex-1 sm:flex-none text-center">
                  <span className="text-green-600 font-medium">
                    {abstractsData.length || 5} Abstracts
                  </span>
                </div>
                <div className="bg-purple-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex-1 sm:flex-none text-center">
                  <span className="text-purple-600 font-medium">
                    {contactsData.length || 12} Contacts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'registrations' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Registrations</h2>
              <p className="text-gray-600">Registration management coming soon.</p>
            </div>
          )}
          {activeTab === 'abstracts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstracts</h2>
              <p className="text-gray-600">Abstract management coming soon.</p>
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments</h2>
              <p className="text-gray-600">Payment management coming soon.</p>
            </div>
          )}
          {activeTab === 'sponsorships' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sponsorships</h2>
              <p className="text-gray-600">Sponsorship management coming soon.</p>
            </div>
          )}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacts</h2>
              <p className="text-gray-600">Contact management coming soon.</p>
            </div>
          )}
          {activeTab === 'export' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Export</h2>
              <p className="text-gray-600">Export functionality coming soon.</p>
            </div>
          )}
          {activeTab === 'speakers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Speaker Management</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-600">Speaker management functionality coming soon.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification!.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
          notification!.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
          'bg-blue-100 border-blue-500 text-blue-800'
        } border-l-4`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">{notification!.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
