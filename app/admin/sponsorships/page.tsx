'use client'

import { useState, useEffect } from 'react'
import { Building, Search, Filter, Eye, CheckCircle, XCircle, Clock, Check, X, Trash2, DollarSign } from 'lucide-react'

interface Sponsorship {
  id: number
  company_name: string
  contact_person: string
  email: string
  phone: string
  website: string
  industry: string
  special_requirements: string
  package_type: string
  amount: number
  status: string
  contract_url?: string
  created_at: string
  updated_at: string
}

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadSponsorships()
  }, [])

  const loadSponsorships = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:5000/api/sponsorships')
      
      if (response.ok) {
        const data = await response.json()
        setSponsorships(data.sponsorships || [])
      } else {
        setError('Failed to load sponsorships')
      }
    } catch (error) {
      console.error('Error loading sponsorships:', error)
      setError('Failed to load sponsorships')
    } finally {
      setLoading(false)
    }
  }

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    const matchesSearch = sponsorship.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsorship.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsorship.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sponsorship.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'submitted':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'under_review':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'negotiating':
        return <Clock className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'negotiating':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleView = (sponsorship: Sponsorship) => {
    // TODO: Implement view modal or navigation
    console.log('View sponsorship:', sponsorship)
    alert(`Viewing sponsorship from ${sponsorship.company_name}`)
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sponsorships/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setSponsorships(prev => prev.map(sponsorship => 
          sponsorship.id === id ? { ...sponsorship, status: newStatus } : sponsorship
        ))
        alert(`Sponsorship status updated to ${newStatus}`)
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsorship?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sponsorships/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setSponsorships(prev => prev.filter(sponsorship => sponsorship.id !== id))
        alert('Sponsorship deleted successfully')
      } else {
        alert('Failed to delete sponsorship')
      }
    } catch (error) {
      console.error('Error deleting sponsorship:', error)
      alert('Failed to delete sponsorship')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sponsorships...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Sponsorships</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadSponsorships}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Sponsorships Management</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sponsorships</p>
              <p className="text-2xl font-bold text-gray-900">{sponsorships.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {sponsorships.filter(s => s.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">
                {sponsorships.filter(s => s.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${sponsorships.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sponsorships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="negotiating">Negotiating</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredSponsorships.length} of {sponsorships.length} sponsorships
          </div>
        </div>
      </div>

      {/* Sponsorships Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level & Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSponsorships.map((sponsorship) => (
                <tr key={sponsorship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sponsorship.company_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{sponsorship.contact_person}</div>
                      <div className="text-sm text-gray-500">{sponsorship.email}</div>
                      <div className="text-sm text-gray-500">{sponsorship.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sponsorship.package_type}</div>
                      <div className="text-sm text-gray-500">${sponsorship.amount?.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(sponsorship.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sponsorship.status)}`}>
                        {sponsorship.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sponsorship.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleView(sponsorship)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(sponsorship.id, 'approved')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(sponsorship.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(sponsorship.id)}
                        className="text-gray-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSponsorships.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sponsorships found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No sponsorships have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

