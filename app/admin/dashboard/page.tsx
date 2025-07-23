'use client'

import React, { useState, useEffect } from 'react'
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
  X
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dataManager, setDataManager] = useState<DataManager | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (!isAuthenticated) {
      window.location.href = '/admin'
      return
    }

    // Initialize data manager
    const dm = DataManager.getInstance()
    dm.seedDemoData() // Add some demo data if empty
    setDataManager(dm)
    
    // Load dashboard data
    loadDashboardData(dm)
  }, [])

  const loadDashboardData = (dm: DataManager) => {
    const stats = dm.getStats()
    const registrations = dm.getRegistrations()
    const contacts = dm.getContactSubmissions()
    
    setDashboardData({
      stats: {
        totalRegistrations: stats.totalRegistrations,
        pendingRegistrations: stats.pendingRegistrations,
        totalSpeakers: stats.approvedSpeakers + stats.pendingSpeakers,
        contactSubmissions: stats.totalContacts,
        websiteViews: 15420, // Mock data
        conversionRate: stats.conversionRate
      },
      recentRegistrations: registrations.slice(0, 5).map(reg => ({
        id: reg.id,
        name: `${reg.firstName} ${reg.lastName}`,
        email: reg.email,
        ticket: reg.ticketType,
        date: new Date(reg.createdAt).toLocaleDateString(),
        status: reg.status
      })),
      contactSubmissions: contacts.slice(0, 4).map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        date: new Date(contact.createdAt).toLocaleDateString(),
        status: contact.status
      })),
      speakers: [
        { id: 1, name: 'DR JANE RUTH ACENG', title: 'Minister for Health', status: 'confirmed', sessions: 2 },
        { id: 2, name: 'Dr. Jane Aceng', title: 'Minister of Health, Uganda', status: 'confirmed', sessions: 1 },
        { id: 3, name: 'Dr. Aisha Patel', title: 'Chief AI Officer, MedTech', status: 'pending', sessions: 1 },
        { id: 4, name: 'Sarah Johnson', title: 'VC Partner', status: 'confirmed', sessions: 1 }
      ]
    })
  }

  // Handle client-side only rendering for localStorage
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      new: 'bg-blue-100 text-blue-800',
      replied: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const getFilteredRegistrations = () => {
    if (!dataManager || !dashboardData) return []
    
    const allRegistrations = dataManager.getRegistrations({ 
      status: filterStatus, 
      search: searchTerm 
    })
    
    return allRegistrations.map(reg => ({
      id: reg.id,
      name: `${reg.firstName} ${reg.lastName}`,
      email: reg.email,
      ticket: reg.ticketType,
      date: new Date(reg.createdAt).toLocaleDateString(),
      status: reg.status
    }))
  }

  const handleExportCSV = () => {
    if (!dataManager) return
    
    const csvData = dataManager.exportRegistrationsCSV()
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleStatusUpdate = (id: string, newStatus: string) => {
    if (!dataManager) return
    
    dataManager.updateRegistrationStatus(id, newStatus as any)
    loadDashboardData(dataManager) // Refresh data
  }

  const filteredRegistrations = getFilteredRegistrations()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.totalRegistrations || 0}</p>
              <p className="text-sm text-green-600">+12% from last week</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.pendingRegistrations || 0}</p>
              <p className="text-sm text-orange-600">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Speakers</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.totalSpeakers || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.contactSubmissions || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.websiteViews?.toLocaleString() || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.conversionRate || 0}%</p>
              <p className="text-sm text-green-600">Above industry avg</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {dashboardData?.recentRegistrations?.slice(0, 5).map((reg: any) => (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{reg.name}</p>
                  <p className="text-sm text-gray-600">{reg.ticket} • {reg.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reg.status)}`}>
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Submissions</h3>
          <div className="space-y-3">
            {dashboardData?.contactSubmissions?.slice(0, 4).map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.subject} • {contact.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                  {contact.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegistrations = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Registrations</h2>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-secondary text-sm">
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          <button className="btn-primary text-sm">
            <Plus size={16} className="mr-2" />
            Add Registration
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Ticket</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.map((reg: any) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{reg.name}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.email}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.ticket}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-green-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
          <button className="btn-secondary text-sm">
            <Calendar size={16} className="mr-2" />
            Date Range
          </button>
        </div>
      </div>
      
      {dataManager && (
        <AnalyticsCharts 
          registrations={dataManager.getRegistrations()}
          contacts={dataManager.getContactSubmissions()}
          speakers={dataManager.getSpeakerApplications()}
        />
      )}
    </div>
  )

  // Batch action handlers
  const handleBatchDelete = (type: 'contacts' | 'registrations') => {
    if (window.confirm(`Are you sure you want to delete ${type === 'contacts' ? selectedContacts.length : selectedRegistrations.length} selected ${type}?`)) {
      if (type === 'contacts') {
        selectedContacts.forEach(id => {
          // Here you would call dataManager.deleteContact(id)
          console.log(`Deleting contact: ${id}`)
        })
        setSelectedContacts([])
      } else {
        selectedRegistrations.forEach(id => {
          // Here you would call dataManager.deleteRegistration(id)
          console.log(`Deleting registration: ${id}`)
        })
        setSelectedRegistrations([])
      }
      // Refresh data
      if (dataManager) loadDashboardData(dataManager)
    }
  }

  const handleBatchMarkRead = (type: 'contacts') => {
    selectedContacts.forEach(id => {
      // Here you would call dataManager.markContactAsRead(id)
      console.log(`Marking contact as read: ${id}`)
    })
    setSelectedContacts([])
    // Refresh data
    if (dataManager) loadDashboardData(dataManager)
  }

  const handleBatchExport = (type: 'contacts' | 'registrations') => {
    let csv = ''
    if (type === 'contacts') {
      const selectedContactsData = dataManager?.getContactSubmissions().filter(c => selectedContacts.includes(c.id))
      csv = selectedContactsData?.map(c => `${c.name},${c.email},${c.subject},${c.status},${c.createdAt}`).join('\n') || ''
    } else {
      const selectedRegistrationsData = dataManager?.getRegistrations().filter(r => selectedRegistrations.includes(r.id))
      csv = selectedRegistrationsData?.map(r => `${r.firstName} ${r.lastName},${r.email},${r.organization},${r.ticketType}`).join('\n') || ''
    }
    
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `selected-${type}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'contacts', label: 'Inquiries', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'export', label: 'Data Export', icon: Download },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600">The Communicable and Non-Communicable Diseases Conference 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => window.open(window.location.origin, '_blank')}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
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
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:min-h-screen
        `}>
          <nav className="p-4 sm:p-6">
            <ul className="space-y-1 sm:space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false) // Close sidebar on mobile when item is selected
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                        activeTab === item.id
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50'
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
        <main className="flex-1 p-4 sm:p-6 lg:ml-0 min-h-screen">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'registrations' && renderRegistrations()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
                <div className="flex gap-3">
                  {selectedContacts.length > 0 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleBatchDelete('contacts')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete ({selectedContacts.length})
                      </button>
                      <button 
                        onClick={() => handleBatchMarkRead('contacts')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <Check size={16} />
                        Mark Replied ({selectedContacts.length})
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      const csv = dataManager?.exportContactsCSV()
                      if (csv) {
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
                        a.click()
                        window.URL.revokeObjectURL(url)
                      }
                    }}
                    className="btn-secondary text-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Contact Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dataManager?.getContactSubmissions().length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {dataManager?.getContactSubmissions().filter(c => c.status === 'new').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-orange-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Replied To</p>
                      <p className="text-2xl font-bold text-green-600">
                        {dataManager?.getContactSubmissions().filter(c => c.status === 'replied').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {dataManager?.getContactSubmissions().filter(c => {
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return new Date(c.createdAt) > weekAgo
                        }).length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Status</option>
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedContacts.length === dataManager?.getContactSubmissions().length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts(dataManager?.getContactSubmissions().map(c => c.id) || [])
                              } else {
                                setSelectedContacts([])
                              }
                            }}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dataManager?.getContactSubmissions()
                        .filter(contact => {
                          const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
                          const matchesFilter = filterStatus === 'all' || contact.status === filterStatus
                          return matchesSearch && matchesFilter
                        })
                        .map((contact) => (
                          <tr key={contact.id} className={selectedContacts.includes(contact.id) ? 'bg-primary-50' : ''}>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedContacts([...selectedContacts, contact.id])
                                  } else {
                                    setSelectedContacts(selectedContacts.filter(id => id !== contact.id))
                                  }
                                }}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{contact.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                contact.status === 'new' ? 'bg-orange-100 text-orange-800' :
                                contact.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                                contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button className="text-primary-600 hover:text-primary-900">View</button>
                                <button className="text-blue-600 hover:text-blue-900">Reply</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'speakers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Speaker Management</h2>
                <div className="flex gap-3">
                  <button className="btn-secondary text-sm">
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button className="btn-primary text-sm">
                    <Plus size={16} className="mr-2" />
                    Add Speaker
                  </button>
                </div>
              </div>

              {/* Speaker Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dataManager?.getSpeakerApplications().length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {dataManager?.getSpeakerApplications().filter(s => s.status === 'approved').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Review</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {dataManager?.getSpeakerApplications().filter(s => s.status === 'pending').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-orange-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">
                        {dataManager?.getSpeakerApplications().filter(s => s.status === 'rejected').length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Trash2 className="text-red-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo message since we don't have real speaker data yet */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Speaker Applications</h3>
                  <p className="text-gray-600 mb-4">This section will display speaker applications when available.</p>
                  <p className="text-sm text-gray-500">
                    Features: Application review, speaker approval/rejection, session assignment, and speaker profiles.
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <button className="btn-primary text-sm">
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Configuration */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                      <input 
                        type="text" 
                        defaultValue="The Communicable and Non-Communicable Diseases Conference 2025"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                      <input 
                        type="date" 
                        defaultValue="2025-03-15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
                      <input 
                        type="text" 
                        defaultValue="Speke Resort Munyonyo, Kampala, Uganda"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="waitlist">Waitlist Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Email Configuration */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                      <input 
                        type="email" 
                        defaultValue="noreply@health.go.ug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input 
                        type="email" 
                        defaultValue="support@health.go.ug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Send confirmation emails</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Send reminder emails</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Ticket Configuration */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Early Bird</p>
                          <p className="text-sm text-gray-600">$299</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Regular</p>
                          <p className="text-sm text-gray-600">$399</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">VIP</p>
                          <p className="text-sm text-gray-600">$599</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      + Add New Ticket Type
                    </button>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Require HTTPS</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Two-factor authentication</span>
                      </label>
                    </div>
                    <button className="w-full px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 hover:bg-yellow-100">
                      Change Admin Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-blue-200 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100">
                    <Download className="mx-auto mb-2" size={24} />
                    <p className="font-medium">Export All Data</p>
                    <p className="text-sm text-blue-600">Download complete backup</p>
                  </button>
                  <button className="p-4 border border-green-200 rounded-lg text-green-700 bg-green-50 hover:bg-green-100">
                    <Upload className="mx-auto mb-2" size={24} />
                    <p className="font-medium">Import Data</p>
                    <p className="text-sm text-green-600">Upload CSV files</p>
                  </button>
                  <button className="p-4 border border-red-200 rounded-lg text-red-700 bg-red-50 hover:bg-red-100">
                    <Trash2 className="mx-auto mb-2" size={24} />
                    <p className="font-medium">Clear Data</p>
                    <p className="text-sm text-red-600">Reset all records</p>
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>
              </div>

              {/* Export Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalRegistrations || 0}</p>
                    </div>
                    <Users className="text-primary-600" size={24} />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.contactSubmissions || 0}</p>
                    </div>
                    <Mail className="text-primary-600" size={24} />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data Records</p>
                      <p className="text-2xl font-bold text-gray-900">{(dashboardData?.stats?.totalRegistrations || 0) + (dashboardData?.stats?.contactSubmissions || 0)}</p>
                    </div>
                    <BarChart3 className="text-primary-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Export Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => {
                      const csv = dataManager?.exportRegistrationsCSV()
                      if (csv) {
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
                        a.click()
                        window.URL.revokeObjectURL(url)
                      }
                    }}
                    className="p-6 border-2 border-dashed border-primary-300 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                  >
                    <Download className="mx-auto mb-3" size={32} />
                    <p className="font-semibold mb-2">Export Registrations</p>
                    <p className="text-sm text-primary-600">Download all registration data as CSV</p>
                    <p className="text-xs text-gray-500 mt-2">Includes personal info, ticket types, preferences</p>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const csv = dataManager?.exportContactsCSV()
                      if (csv) {
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
                        a.click()
                        window.URL.revokeObjectURL(url)
                      }
                    }}
                    className="p-6 border-2 border-dashed border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Download className="mx-auto mb-3" size={32} />
                    <p className="font-semibold mb-2">Export Inquiries</p>
                    <p className="text-sm text-green-600">Download all contact submissions as CSV</p>
                    <p className="text-xs text-gray-500 mt-2">Includes messages, subjects, contact details</p>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800">Data Privacy Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Exported data contains personal information. Ensure compliance with data protection regulations 
                        and handle files securely. Do not share or store in unsecured locations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
