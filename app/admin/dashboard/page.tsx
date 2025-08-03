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
  ExternalLink
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [selectedAbstracts, setSelectedAbstracts] = useState<string[]>([])
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dataManager, setDataManager] = useState<DataManager | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [abstractsData, setAbstractsData] = useState<any[]>([])
  const [abstractStats, setAbstractStats] = useState<any>({})
  const [loadingAbstracts, setLoadingAbstracts] = useState(false)
  const [registrationsData, setRegistrationsData] = useState<any[]>([])
  const [registrationStats, setRegistrationStats] = useState<any>({})
  const [contactsData, setContactsData] = useState<any[]>([])
  const [contactStats, setContactStats] = useState<any>({})
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

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

    // Load real data from APIs
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      // Load data in parallel for better performance
      const [regResponse, contactResponse] = await Promise.all([
        fetch('/api/registrations').catch(() => null),
        fetch('/api/contacts').catch(() => null)
      ]);
      
      let regData, contactData;
      
      // Process registration data
      if (regResponse && regResponse.ok) {
        regData = await regResponse.json()
        setRegistrationsData(regData.data || [])
        setRegistrationStats(regData.stats || {})
      }

      // Process contact data  
      if (contactResponse && contactResponse.ok) {
        contactData = await contactResponse.json()
        setContactsData(contactData.data || [])
        setContactStats(contactData.stats || {})
      }

      // Load abstracts asynchronously (doesn't block dashboard loading)
      loadAbstractsData()

      // Set dashboard overview data
      setDashboardData({
        stats: {
          totalRegistrations: regData?.stats?.total || 0,
          pendingRegistrations: regData?.stats?.pending || 0,
          totalSpeakers: 0, // Will be updated when we have speaker data
          contactSubmissions: contactData?.stats?.total || 0,
          websiteViews: 15420, // Mock data for now
          conversionRate: 75 // Mock data for now
        }
      })
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

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

  const loadAbstractsData = async () => {
    setLoadingAbstracts(true)
    try {
      const response = await fetch('/api/abstracts')
      if (response.ok) {
        const result = await response.json()
        setAbstractsData(result.data || [])
        setAbstractStats(result.stats || {})
      } else {
        console.error('Failed to fetch abstracts:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching abstracts:', error)
    } finally {
      setLoadingAbstracts(false)
    }
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
    if (!registrationsData) return []
    
    return registrationsData.filter(reg => {
      const matchesSearch = searchTerm === '' || 
        (reg.first_name || reg.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.last_name || reg.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.organization.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || reg.status === filterStatus
      
      return matchesSearch && matchesStatus
    }).map(reg => ({
      id: reg._id,
      name: `${reg.first_name || reg.firstName} ${reg.last_name || reg.lastName}`,
      email: reg.email,
      phone: reg.phone,
      organization: reg.organization,
      position: reg.position,
      district: reg.district,
      ticket: reg.registrationType || 'Standard',
      paymentStatus: reg.paymentStatus || 'pending',
      date: new Date(reg.createdAt).toLocaleDateString(),
      status: reg.status || 'pending'
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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: [id],
          status: newStatus
        })
      });

      if (response.ok) {
        // Refresh data
        loadRealData();
      } else {
        console.error('Failed to update registration status');
        alert('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Error updating status. Please try again.');
    }
  }

  const handleSingleDelete = async (id: string, type: 'contact' | 'registration' | 'abstract') => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const endpoint = type === 'contact' ? '/api/contacts' : 
                        type === 'registration' ? '/api/registrations' : '/api/abstracts';
        
        const response = await fetch(`${endpoint}?ids=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Successfully deleted ${type}`);
          
          // Refresh data
          if (type === 'abstract') {
            loadAbstractsData();
          } else {
            loadRealData();
          }
        } else {
          console.error(`Failed to delete ${type}:`, response.statusText);
          alert(`Failed to delete ${type}. Please try again.`);
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}. Please try again.`);
      }
    }
  }

  // View handlers
  const handleViewItem = (item: any, type: 'contact' | 'registration' | 'abstract') => {
    // Find the full user data from registrationsData
    if (type === 'registration') {
      const fullUserData = registrationsData.find(reg => reg._id === item.id);
      setSelectedUser({
        ...fullUserData,
        type: 'registration'
      });
    } else {
      setSelectedUser({
        ...item,
        type
      });
    }
    setShowDetailModal(true);
  };

  // Edit handlers (for now using prompts, could be enhanced with modals)
  const handleEditItem = async (item: any, type: 'contact' | 'registration' | 'abstract') => {
    switch (type) {
      case 'contact':
        const newContactStatus = prompt(`Edit Contact Status for ${item.name}:`, item.status);
        if (newContactStatus && newContactStatus !== item.status) {
          await updateItemStatus(item._id, newContactStatus, 'contact');
        }
        break;
      case 'registration':
        const newRegStatus = prompt(`Edit Registration Status for ${item.name}:`, item.status);
        if (newRegStatus && newRegStatus !== item.status) {
          await handleStatusUpdate(item._id, newRegStatus);
        }
        break;
      case 'abstract':
        const newAbstractStatus = prompt(`Edit Abstract Status for "${item.title}":`, item.status);
        if (newAbstractStatus && newAbstractStatus !== item.status && (newAbstractStatus === 'accepted' || newAbstractStatus === 'rejected')) {
          await handleAbstractStatusUpdate(item._id, newAbstractStatus as 'accepted' | 'rejected');
        }
        break;
    }
  };

  // Generic status update function
  const updateItemStatus = async (id: string, newStatus: string, type: 'contact' | 'registration' | 'abstract') => {
    try {
      const endpoint = type === 'contact' ? '/api/contacts' : 
                      type === 'registration' ? '/api/registrations' : '/api/abstracts';
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: newStatus,
          updatedBy: 'admin'
        }),
      });

      if (response.ok) {
        console.log(`Successfully updated ${type} status`);
        // Refresh data
        if (type === 'abstract') {
          loadAbstractsData();
        } else {
          loadRealData();
        }
      } else {
        console.error(`Failed to update ${type} status:`, response.statusText);
        alert(`Failed to update ${type} status. Please try again.`);
      }
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      alert(`Error updating ${type} status. Please try again.`);
    }
  };

  // Abstract-specific handlers
  const handleAbstractStatusUpdate = async (id: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/abstracts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: newStatus,
          reviewComments: `Status updated to ${newStatus} by admin`
        })
      })

      if (response.ok) {
        // Refresh abstracts data
        loadAbstractsData()
      } else {
        console.error('Failed to update abstract status')
      }
    } catch (error) {
      console.error('Error updating abstract status:', error)
    }
  };

  const handleAbstractDownload = (abstract: any) => {
    if (abstract._id || abstract.fileName) {
      // Primary method: Use secure API endpoint
      const downloadUrl = abstract._id 
        ? `/api/abstracts/download/?id=${abstract._id}`
        : `/api/abstracts/download/?filename=${abstract.fileName}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = abstract.fileName || `abstract_${abstract._id}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloaded: ${abstract.fileName || abstract._id}`);
    } else {
      alert('File information not available for download');
      console.error('Abstract download failed - missing file information:', abstract);
    }
  };

  const handleAbstractPreview = (abstract: any) => {
    if (abstract.fileName) {
      // Use direct file access for preview
      const previewUrl = `/uploads-abstracts/${abstract.fileName}`;
      window.open(previewUrl, '_blank');
    } else {
      alert('File not available for preview');
    }
  };

  // Bulk download functionality for multiple abstracts
  const handleBulkAbstractDownload = async () => {
    if (selectedAbstracts.length === 0) {
      alert('No abstracts selected for download');
      return;
    }

    try {
      // Get the selected abstract data
      const selectedAbstractData = abstractsData.filter(abstract => 
        selectedAbstracts.includes(abstract._id)
      );

      if (selectedAbstractData.length === 0) {
        alert('Selected abstracts not found');
        return;
      }

      // Download each file individually (since browsers limit simultaneous downloads)
      for (let i = 0; i < selectedAbstractData.length; i++) {
        const abstract = selectedAbstractData[i];
        
        // Add a small delay between downloads to prevent browser blocking
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Trigger download using the existing function
        handleAbstractDownload(abstract);
      }

      // Clear selection after download
      setSelectedAbstracts([]);
      
      console.log(`Bulk download initiated for ${selectedAbstractData.length} abstracts`);
    } catch (error) {
      console.error('Error in bulk download:', error);
      alert('Error occurred during bulk download. Please try again.');
    }
  };

  // Export selected abstracts metadata to CSV
  const handleExportSelectedAbstracts = () => {
    if (selectedAbstracts.length === 0) {
      alert('No abstracts selected for export');
      return;
    }

    const selectedAbstractData = abstractsData.filter(abstract => 
      selectedAbstracts.includes(abstract._id)
    );

    const csvData = selectedAbstractData.map(abstract => {
      return [
        `"${abstract.title}"`,
        `"${abstract.primaryAuthor.firstName} ${abstract.primaryAuthor.lastName}"`,
        `"${abstract.primaryAuthor.email}"`,
        `"${abstract.primaryAuthor.institution || abstract.primaryAuthor.affiliation || ''}"`,
        `"${abstract.category}"`,
        `"${abstract.presentationType}"`,
        `"${abstract.status}"`,
        `"${new Date(abstract.submittedAt).toLocaleDateString()}"`,
        `"${abstract.fileName || 'N/A'}"`,
        `"${abstract.keywords || ''}"`,
        `"${abstract.abstract.substring(0, 100)}..."`
      ].join(',');
    }).join('\n');

    const csvContent = `Title,Author,Email,Institution,Category,Type,Status,Submitted,File,Keywords,Abstract Preview\n${csvData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `selected_abstracts_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Exported ${selectedAbstractData.length} selected abstracts to CSV`);
  };

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
              <p className="text-sm font-medium text-gray-600">Abstract Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{abstractStats?.total || 0}</p>
              <p className="text-sm text-orange-600">{abstractStats?.pending || 0} pending review</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-600" size={24} />
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

      {selectedRegistrations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedRegistrations.length} registration(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  selectedRegistrations.forEach(id => handleStatusUpdate(id, 'confirmed'))
                  setSelectedRegistrations([])
                }}
                className="btn-primary text-sm"
              >
                Confirm ({selectedRegistrations.length})
              </button>
              <button
                onClick={() => {
                  selectedRegistrations.forEach(id => handleSingleDelete(id, 'registration'))
                  setSelectedRegistrations([])
                }}
                className="btn-danger text-sm"
              >
                Delete ({selectedRegistrations.length})
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRegistrations(filteredRegistrations.map(r => r.id))
                      } else {
                        setSelectedRegistrations([])
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Organization</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Ticket Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Payment</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.map((reg: any) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(reg.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations([...selectedRegistrations, reg.id])
                        } else {
                          setSelectedRegistrations(selectedRegistrations.filter(id => id !== reg.id))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{reg.name}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.email}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.organization}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {reg.ticket}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      reg.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{reg.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewItem(reg, 'registration')}
                        className="p-1 text-gray-600 hover:text-blue-600" 
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditItem(reg, 'registration')}
                        className="p-1 text-gray-600 hover:text-green-600" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleSingleDelete(reg.id, 'registration')}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
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

  const renderAbstracts = () => {
    const filteredAbstracts = abstractsData.filter(abstract => {
      const matchesSearch = searchTerm === '' || 
        abstract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.primaryAuthor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.primaryAuthor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.primaryAuthor.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || abstract.status === filterStatus
      
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        {/* Abstract Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
                <p className="text-3xl font-bold text-gray-900">{abstractStats.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{abstractStats.pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-3xl font-bold text-gray-900">{abstractStats.accepted || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{abstractStats.rejected || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Abstract Management</h2>
          <div className="flex gap-3">
            {selectedAbstracts.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    selectedAbstracts.forEach(id => handleAbstractStatusUpdate(id, 'accepted'))
                    setSelectedAbstracts([])
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Accept ({selectedAbstracts.length})
                </button>
                <button 
                  onClick={() => {
                    selectedAbstracts.forEach(id => handleAbstractStatusUpdate(id, 'rejected'))
                    setSelectedAbstracts([])
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <X size={16} />
                  Reject ({selectedAbstracts.length})
                </button>
                <button 
                  onClick={handleBulkAbstractDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  Download ({selectedAbstracts.length})
                </button>
                <button 
                  onClick={handleExportSelectedAbstracts}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Upload size={16} />
                  Export CSV ({selectedAbstracts.length})
                </button>
                <button 
                  onClick={() => handleBatchDelete('abstracts')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete ({selectedAbstracts.length})
                </button>
              </div>
            )}
            <button 
              onClick={() => {
                const csv = abstractsData.map(a => 
                  `"${a.title}","${a.primaryAuthor.firstName} ${a.primaryAuthor.lastName}","${a.primaryAuthor.email}","${a.category}","${a.presentationType}","${a.status}","${new Date(a.submittedAt).toLocaleDateString()}"`
                ).join('\n')
                const blob = new Blob([`Title,Author,Email,Category,Type,Status,Submitted\n${csv}`], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `abstracts-${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
              className="btn-secondary text-sm"
            >
              <Download size={16} className="mr-2" />
              Export CSV
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
                  placeholder="Search abstracts..."
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
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Abstracts Table */}
        {loadingAbstracts ? (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading abstracts...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedAbstracts.length === filteredAbstracts.length && filteredAbstracts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAbstracts(filteredAbstracts.map(a => a._id))
                          } else {
                            setSelectedAbstracts([])
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Author</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Submitted</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAbstracts.map((abstract: any) => (
                    <tr key={abstract._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedAbstracts.includes(abstract._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAbstracts([...selectedAbstracts, abstract._id])
                            } else {
                              setSelectedAbstracts(selectedAbstracts.filter(id => id !== abstract._id))
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900 max-w-xs truncate">
                        {abstract.title}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {abstract.primaryAuthor.firstName} {abstract.primaryAuthor.lastName}
                        <br />
                        <span className="text-xs text-gray-500">{abstract.primaryAuthor.email}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{abstract.category}</td>
                      <td className="py-4 px-6 text-gray-600 capitalize">{abstract.presentationType}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(abstract.status)}`}>
                          {abstract.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(abstract.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewItem(abstract, 'abstract')}
                            className="p-1 text-gray-600 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditItem(abstract, 'abstract')}
                            className="p-1 text-gray-600 hover:text-green-600"
                            title="Edit Status"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleAbstractPreview(abstract)}
                            className="p-1 text-gray-600 hover:text-indigo-600"
                            title="Preview File"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button 
                            onClick={() => handleAbstractDownload(abstract)}
                            className="p-1 text-gray-600 hover:text-purple-600"
                            title="Download File"
                          >
                            <Download size={16} />
                          </button>
                          {abstract.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleAbstractStatusUpdate(abstract._id, 'accepted')}
                                className="p-1 text-gray-600 hover:text-green-600"
                                title="Accept"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => handleAbstractStatusUpdate(abstract._id, 'rejected')}
                                className="p-1 text-gray-600 hover:text-red-600"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleSingleDelete(abstract._id, 'abstract')}
                            className="p-1 text-gray-600 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAbstracts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                        {abstractsData.length === 0 ? 'No abstracts submitted yet.' : 'No abstracts match your search criteria.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderContacts = () => {
    const filteredContacts = contactsData.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
      
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
        
        {selectedContacts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedContacts.length} contact(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    selectedContacts.forEach(id => handleSingleDelete(id, 'contact'))
                    setSelectedContacts([])
                  }}
                  className="btn-danger text-sm"
                >
                  Delete ({selectedContacts.length})
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts(filteredContacts.map(c => c._id))
                        } else {
                          setSelectedContacts([])
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Subject</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact: any) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts([...selectedContacts, contact._id])
                          } else {
                            setSelectedContacts(selectedContacts.filter(id => id !== contact._id))
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{contact.name}</td>
                    <td className="py-4 px-6 text-gray-600">{contact.email}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{contact.subject}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewItem(contact, 'contact')}
                          className="p-1 text-gray-600 hover:text-blue-600"
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditItem(contact, 'contact')}
                          className="p-1 text-gray-600 hover:text-green-600"
                          title="Edit Status"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleSingleDelete(contact._id, 'contact')}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredContacts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-gray-500">
                      {contactsData.length === 0 ? 'No contacts submitted yet.' : 'No contacts match your search criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Batch action handlers
  const handleBatchDelete = async (type: 'contacts' | 'registrations' | 'abstracts') => {
    const selectedIds = type === 'contacts' ? selectedContacts : 
                       type === 'registrations' ? selectedRegistrations : selectedAbstracts;
    
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected ${type}?`)) {
      try {
        const endpoint = type === 'contacts' ? '/api/contacts' : 
                        type === 'registrations' ? '/api/registrations' : '/api/abstracts';
        
        const response = await fetch(`${endpoint}?ids=${selectedIds.join(',')}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Successfully deleted ${result.deletedCount} ${type}`);
          
          // Clear selections
          if (type === 'contacts') setSelectedContacts([]);
          else if (type === 'registrations') setSelectedRegistrations([]);
          else setSelectedAbstracts([]);
          
          // Refresh data
          if (type === 'abstracts') {
            loadAbstractsData();
          } else {
            loadRealData();
          }
        } else {
          console.error(`Failed to delete ${type}:`, response.statusText);
          alert(`Failed to delete ${type}. Please try again.`);
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}. Please try again.`);
      }
    }
  }

  const handleBatchMarkRead = async (type: 'contacts') => {
    if (selectedContacts.length === 0) return;
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedContacts,
          status: 'resolved'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`Successfully updated ${result.updatedCount} contacts`);
        setSelectedContacts([]);
        
        // Refresh data
        if (dataManager) loadDashboardData(dataManager);
      } else {
        console.error('Failed to update contacts:', response.statusText);
        alert('Failed to update contacts. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contacts:', error);
      alert('Error updating contacts. Please try again.');
    }
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

  const renderExport = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Data Export Center</h2>
        <div className="text-sm text-gray-500">Export all conference data</div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Registrations Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Registrations</h3>
              <p className="text-sm text-gray-600">{registrationsData.length} records</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Export all registration data including participant details, session tracks, and status.</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                const csvData = registrationsData.map(reg => [
                  `"${reg.name}"`,
                  `"${reg.email}"`,
                  `"${reg.phone || ''}"`,
                  `"${reg.institution || ''}"`,
                  `"${reg.position || ''}"`,
                  `"${reg.sessionTrack || ''}"`,
                  `"${reg.status}"`,
                  `"${new Date(reg.registrationDate).toLocaleDateString()}"`,
                  `"${reg.ticket || ''}"`,
                  `"${reg.dietaryRequirements || ''}"`,
                  `"${reg.specialNeeds || ''}"`
                ].join(','));
                
                const csvContent = `Name,Email,Phone,Institution,Position,Session Track,Status,Registration Date,Ticket,Dietary Requirements,Special Needs\n${csvData.join('\n')}`;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => {
                const jsonData = JSON.stringify(registrationsData, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `registrations_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Abstracts Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Abstracts</h3>
              <p className="text-sm text-gray-600">{abstractsData.length} records</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Export abstract submissions including metadata, author information, and review status.</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                const csvData = abstractsData.map(abstract => [
                  `"${abstract.title}"`,
                  `"${abstract.primaryAuthor.firstName} ${abstract.primaryAuthor.lastName}"`,
                  `"${abstract.primaryAuthor.email}"`,
                  `"${abstract.primaryAuthor.institution || abstract.primaryAuthor.affiliation || ''}"`,
                  `"${abstract.category}"`,
                  `"${abstract.presentationType}"`,
                  `"${abstract.status}"`,
                  `"${new Date(abstract.submittedAt).toLocaleDateString()}"`,
                  `"${abstract.fileName || 'N/A'}"`,
                  `"${abstract.keywords || ''}"`,
                  `"${abstract.abstract.replace(/"/g, '""')}"`
                ].join(','));
                
                const csvContent = `Title,Author,Email,Institution,Category,Type,Status,Submitted,File,Keywords,Abstract\n${csvData.join('\n')}`;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `abstracts_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => {
                const jsonData = JSON.stringify(abstractsData, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `abstracts_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Contacts Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
              <p className="text-sm text-gray-600">{contactsData.length} records</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Export contact inquiries and messages from the contact form.</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                const csvData = contactsData.map(contact => [
                  `"${contact.name}"`,
                  `"${contact.email}"`,
                  `"${contact.subject}"`,
                  `"${contact.message.replace(/"/g, '""')}"`,
                  `"${contact.status}"`,
                  `"${new Date(contact.createdAt).toLocaleDateString()}"`
                ].join(','));
                
                const csvContent = `Name,Email,Subject,Message,Status,Date\n${csvData.join('\n')}`;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => {
                const jsonData = JSON.stringify(contactsData, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Export</h3>
        <p className="text-gray-600 mb-4">Export all conference data in a single operation.</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const timestamp = new Date().toISOString().split('T')[0];
              
              // Create summary report
              const summary = `NTLP Conference 2025 - Data Export Summary
Generated: ${new Date().toLocaleString()}

STATISTICS:
- Total Registrations: ${registrationsData.length}
- Total Abstracts: ${abstractsData.length}
- Total Contact Inquiries: ${contactsData.length}

REGISTRATION STATUS:
- Confirmed: ${registrationsData.filter(r => r.status === 'confirmed').length}
- Pending: ${registrationsData.filter(r => r.status === 'pending').length}

ABSTRACT STATUS:
- Accepted: ${abstractsData.filter(a => a.status === 'accepted').length}
- Pending: ${abstractsData.filter(a => a.status === 'pending').length}
- Rejected: ${abstractsData.filter(a => a.status === 'rejected').length}`;

              const blob = new Blob([summary], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `conference_summary_${timestamp}.txt`;
              link.click();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Download size={20} />
            Export Summary Report
          </button>
        </div>
      </div>
    </div>
  )

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'abstracts', label: 'Abstracts', icon: FileText },
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
            
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <Image 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                width={24} 
                height={24}
                className="object-contain"
              />
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
          {activeTab === 'abstracts' && renderAbstracts()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'export' && renderExport()}
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

      {/* Detailed View Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedUser.type === 'registration' ? 'Registration Details' : 
                   selectedUser.type === 'abstract' ? 'Abstract Details' : 'Contact Details'}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedUser.type === 'registration' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      <p className="text-gray-900">{selectedUser.organization}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <p className="text-gray-900">{selectedUser.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <p className="text-gray-900">{selectedUser.district}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedUser.registrationType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedUser.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedUser.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                      <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  {selectedUser.specialRequirements && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedUser.specialRequirements}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedUser.type === 'abstract' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900 font-medium">{selectedUser.title}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                      <p className="text-gray-900">{selectedUser.authors}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <p className="text-gray-900">{selectedUser.institution}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedUser.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedUser.abstract}</p>
                  </div>
                  {selectedUser.keywords && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <p className="text-gray-900">{selectedUser.keywords}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
