'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, Users, FileText, CreditCard, Building, Mail, 
  Download, UserPlus, Eye, Edit, Trash2, CheckCircle, 
  AlertCircle, Search, X, Menu, LogOut, Globe, TrendingUp,
  Upload, MessageSquare, CheckCircle2, Clock, DollarSign,
  Calendar, Award, BookOpen, Phone, MapPin, ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import AnalyticsCharts from '@/components/AnalyticsCharts'

interface Notification {
  type: 'success' | 'error' | 'info'
  message: string
}

interface DashboardData {
  registrations: {
    total: number
    pending: number
    approved: number
    newThisWeek: number
  }
  abstracts: {
    total: number
    pending: number
    accepted: number
    newThisWeek: number
  }
  reviews: {
    total: number
    averageScore: number
    acceptRecommendations: number
    rejectRecommendations: number
  }
  contacts: {
    total: number
    submitted: number
    underReview: number
    responded: number
    requiresFollowup: number
    newThisWeek: number
  }
  sessions: {
    total: number
    keynotes: number
    presentations: number
    published: number
  }
  speakers: {
    total: number
    keynotes: number
    approved: number
  }
  sponsorships: {
    total: number
    submitted: number
    underReview: number
    approved: number
    negotiating: number
  }
}

interface ActivityItem {
  type: string
  id: number
  name: string
  last_name: string
  email: string
  status: string
  activity_date: string
}

interface PendingItem {
  type: string
  id: number
  name: string
  email: string
  subject: string
  status: string
  priority?: string
  date: string
}

export default function AdminDashboard() {
  // Core state
  const [activeTab, setActiveTab] = useState('overview')
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const [pendingItems, setPendingItems] = useState<{
    contacts: PendingItem[]
    abstracts: PendingItem[]
    registrations: PendingItem[]
    sponsorships: PendingItem[]
  } | null>(null)
  
  // Selection states
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [selectedAbstracts, setSelectedAbstracts] = useState<string[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      window.location.href = '/admin'
      return
    }

    // Load all data
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      
      // Load dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard')
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setDashboardData(statsData.data)
      }
      
      // Load recent activities
      const activitiesResponse = await fetch('/api/admin/activity')
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData.activities)
      }
      
      // Load pending items
      const pendingResponse = await fetch('/api/admin/pending')
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json()
        setPendingItems(pendingData.pending)
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      showNotification('error', 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleBulkAction = async (action: string, ids: string[], entityType: string) => {
    try {
      const response = await fetch('/api/admin/bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ids, entityType })
      })
      
      if (response.ok) {
        showNotification('success', `Bulk action completed successfully`)
        loadAllData() // Refresh data
      } else {
        showNotification('error', 'Failed to perform bulk action')
      }
    } catch (error) {
      showNotification('error', 'Error performing bulk action')
    }
  }

  const handleDownloadAbstract = async (abstractId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/abstracts/download/${abstractId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `abstract-${abstractId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('success', 'Abstract downloaded successfully');
      } else {
        showNotification('error', 'Failed to download abstract');
      }
    } catch (error) {
      console.error('Error downloading abstract:', error);
      showNotification('error', 'Error downloading abstract');
    }
  }

  const handleDownloadPaymentProof = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`/api/uploads/file/${filePath}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'payment-proof.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('success', 'Payment proof downloaded successfully');
      } else {
        showNotification('error', 'Failed to download payment proof');
      }
    } catch (error) {
      console.error('Error downloading payment proof:', error);
      showNotification('error', 'Error downloading payment proof');
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'approved': 'bg-green-100 text-green-800',
      'accepted': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'under_review': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'negotiating': 'bg-purple-100 text-purple-800',
      'responded': 'bg-blue-100 text-blue-800',
      'requires_followup': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg border ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardData.registrations?.total || 0}</p>
                  <p className="text-xs text-gray-500">+{dashboardData.registrations?.newThisWeek || 0} this week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardData.abstracts?.total || 0}</p>
                  <p className="text-xs text-gray-500">+{dashboardData.abstracts?.newThisWeek || 0} this week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contact Submissions</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardData.contacts?.total || 0}</p>
                  <p className="text-xs text-gray-500">+{dashboardData.contacts?.newThisWeek || 0} this week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Speakers</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardData.speakers?.total || 0}</p>
                  <p className="text-xs text-gray-500">{dashboardData.speakers?.keynotes || 0} keynote speakers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(45000000)} {/* Mock data */}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add Speaker</p>
                    <p className="text-sm text-gray-500">Register new speaker</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Review Abstracts</p>
                    <p className="text-sm text-gray-500">Process submissions</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Contact Management</p>
                    <p className="text-sm text-gray-500">Handle inquiries</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'registration' ? 'bg-blue-100' :
                    activity.type === 'abstract' ? 'bg-green-100' :
                    activity.type === 'contact' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'registration' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'abstract' && <FileText className="h-4 w-4 text-green-600" />}
                    {activity.type === 'contact' && <Mail className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'sponsorship' && <Building className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.name} {activity.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{activity.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.activity_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Items */}
          {pendingItems && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending Items Requiring Attention</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Contacts */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Pending Contacts ({pendingItems.contacts.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingItems.contacts.slice(0, 3).map((contact, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-600">{contact.email}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Abstracts */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Pending Abstracts ({pendingItems.abstracts.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingItems.abstracts.slice(0, 3).map((abstract, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{abstract.name}</p>
                            <p className="text-xs text-gray-600">{abstract.email}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(abstract.status)}`}>
                            {abstract.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other tabs would be implemented here */}
      {activeTab !== 'overview' && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500">This section is under development and will be available soon.</p>
        </div>
      )}
    </div>
  )
}
