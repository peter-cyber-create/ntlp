'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Check, X } from 'lucide-react'

interface Registration {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  institution: string
  registration_type: string
  status: string
  created_at: string
  updated_at: string
  payment_reference?: string // Payment proof file path
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [selected, setSelected] = useState<Registration | null>(null)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/registrations`)
      
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      } else {
        setError('Failed to load registrations')
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
      setError('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(registration => {
    const fullName = `${registration.first_name} ${registration.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.institution.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || 
                          (paymentFilter === 'with_proof' && registration.payment_proof_url) ||
                          (paymentFilter === 'without_proof' && !registration.payment_proof_url)
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleView = (registration: Registration) => {
    setSelected(registration)
    setViewOpen(true)
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      console.log(`Updating registration ${id} status to: ${newStatus}`)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Status update result:', result)
        
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === id ? { ...reg, status: newStatus } : reg
        ))
        
        // Show success message
        alert(`Status updated successfully to ${newStatus}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Status update failed:', response.status, errorData)
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status: Network error')
    }
  }

  const handleDownloadPaymentProof = async (fileUrl: string, registration: Registration) => {
    try {
      console.log('Downloading payment proof for registration:', registration.id)
      console.log('File URL:', fileUrl)
      
      // Create a meaningful filename with submitter's name and registration type
      const submitterName = `${registration.first_name}_${registration.last_name}`.replace(/[^a-zA-Z0-9]/g, '_')
      const registrationType = registration.registration_type ? registration.registration_type.replace(/[^a-zA-Z0-9]/g, '_') : 'Registration'
      const fileExtension = fileUrl.split('.').pop() || 'pdf'
      
      const filename = `PaymentProof_${submitterName}_${registrationType}.${fileExtension}`
      
      // Use the backend file download endpoint
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/uploads/file/${fileUrl}`
      console.log('Downloading from backend endpoint:', downloadUrl)
      console.log('Filename will be:', filename)
      
      // Fetch the file as a blob to force download
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Download failed:', response.status, errorText)
        throw new Error(`Download failed: ${response.status} - ${errorText}`)
      }
      
      const blob = await response.blob()
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
      
      console.log('Payment proof downloaded successfully')
    } catch (error) {
      console.error('Error downloading payment proof:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to download payment proof: ${errorMessage}`)
    }
  }

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: number) => {
    setDeleteConfirm(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/registrations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setRegistrations(prev => prev.filter(reg => reg.id !== id))
        alert('Registration deleted successfully')
      } else {
        alert('Failed to delete registration')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Failed to delete registration')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Registrations</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadRegistrations}
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
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Registrations Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'confirmed').length}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'rejected').length}
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
                placeholder="Search registrations..."
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
                <option value="rejected">Rejected</option>
                <option value="waitlist">Waitlist</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
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
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{registration.first_name} {registration.last_name}</div>
                      <div className="text-sm text-gray-500">{registration.institution}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{registration.email}</div>
                      <div className="text-sm text-gray-500">{registration.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {registration.registration_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {registration.payment_proof_url ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Proof Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Proof
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(registration.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleView(registration)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(registration.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Confirm"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(registration.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {registration.payment_reference && (
                        <button 
                          onClick={() => handleDownloadPaymentProof(registration.payment_reference, registration)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Download Payment Proof"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(registration.id)}
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
        
        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No registrations have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewOpen(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg border border-gray-200 p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Registration Details</h2>
              <button onClick={() => setViewOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="text-base font-medium text-gray-900">{selected.first_name} {selected.last_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-base text-gray-900">{selected.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-base text-gray-900">{selected.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Institution</div>
                  <div className="text-base text-gray-900">{selected.institution || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Registration Type</div>
                  <div className="text-base text-gray-900">{selected.registration_type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="text-base text-gray-900">{selected.status}</div>
                </div>
              </div>
              {selected.payment_proof_url && (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3">
                  <div className="text-sm text-gray-700 truncate">Payment proof available</div>
                  <button
                    onClick={() => handleDownloadPaymentProof(selected.payment_proof_url!, selected)}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded"
                  >
                    Download Proof
                  </button>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-end space-x-2">
              <button
                onClick={() => setViewOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusChange(selected.id, 'approved')}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(selected.id, 'rejected')}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
