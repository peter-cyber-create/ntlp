'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Award, Check, X } from 'lucide-react'

interface Abstract {
  id: number
  title: string
  authors: string
  email: string
  institution: string
  abstract: string
  keywords: string
  track: string
  status: string
  fileName?: string
  filePath?: string
  fileSize?: number
  created_at: string
  updated_at: string
}

export default function AbstractsPage() {
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewOpen, setViewOpen] = useState(false)
  const [selected, setSelected] = useState<Abstract | null>(null)

  useEffect(() => {
    loadAbstracts()
  }, [])

  const loadAbstracts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts`)
      
      if (response.ok) {
        const data = await response.json()
        setAbstracts(data.abstracts || [])
      } else {
        setError('Failed to load abstracts')
      }
    } catch (error) {
      console.error('Error loading abstracts:', error)
      setError('Failed to load abstracts')
    } finally {
      setLoading(false)
    }
  }

  const filteredAbstracts = abstracts.filter(abstract => {
    const matchesSearch = abstract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getAuthorName(abstract.authors).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         abstract.keywords.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || abstract.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || abstract.track === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAuthorName = (authors: string) => {
    try {
      if (!authors) return 'Unknown Author'
      const authorsArray = JSON.parse(authors)
      if (Array.isArray(authorsArray) && authorsArray.length > 0) {
        return authorsArray[0].name || 'Unknown Author'
      }
      return 'Unknown Author'
    } catch (error) {
      return 'Unknown Author'
    }
  }

  const getCategoryColor = (category: string) => {
    if (!category) {
      return 'bg-gray-100 text-gray-800'
    }
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800'
    ]
    const index = category.length % colors.length
    return colors[index]
  }

  const handleView = (abstract: Abstract) => {
    setSelected(abstract)
    setViewOpen(true)
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setAbstracts(prev => prev.map(abs => 
          abs.id === id ? { ...abs, status: newStatus } : abs
        ))
        alert(`Abstract status updated to ${newStatus}`)
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this abstract?')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setAbstracts(prev => prev.filter(abs => abs.id !== id))
        alert('Abstract deleted successfully')
      } else {
        alert('Failed to delete abstract')
      }
    } catch (error) {
      console.error('Error deleting abstract:', error)
      alert('Failed to delete abstract')
    }
  }

  const handleDownload = async (fileUrl: string, abstract: Abstract) => {
    try {
      // Handle different file path formats
      let downloadUrl = fileUrl
      if (fileUrl.startsWith('uploads/')) {
        // If file_url already has uploads/ prefix, use it directly
        downloadUrl = fileUrl
      } else if (fileUrl.includes('abstract_')) {
        // If it's an abstract filename, add the correct subdirectory
        downloadUrl = `uploads/abstracts/${fileUrl}`
      } else {
        // Default case: add uploads/ prefix
        downloadUrl = `uploads/${fileUrl}`
      }
      
      // Create a meaningful filename with author name and abstract title
      const authorName = abstract.authors ? abstract.authors.replace(/[^a-zA-Z0-9]/g, '_') : 'Unknown'
      const abstractTitle = abstract.title ? abstract.title.replace(/[^a-zA-Z0-9]/g, '_') : 'Abstract'
      const fileExtension = fileUrl.split('.').pop() || 'pdf'
      
      const filename = `Abstract_${authorName}_${abstractTitle}.${fileExtension}`
      
      // Ensure the URL is properly formatted for the backend
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/abstracts/download/${abstract.id}`
      console.log('Downloading abstract from:', fullUrl)
      console.log('Filename will be:', filename)
      
      // Fetch the file as a blob to force download
      const response = await fetch(fullUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
    } catch (error) {
      console.error('Error downloading abstract:', error)
      alert('Failed to download abstract')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading abstracts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Abstracts</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadAbstracts}
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
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Abstracts Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
              <p className="text-2xl font-bold text-gray-900">{abstracts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {abstracts.filter(a => a.status === 'accepted').length}
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
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {abstracts.filter(a => a.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">
                {abstracts.filter(a => a.status === 'submitted').length}
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
                {abstracts.filter(a => a.status === 'rejected').length}
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
                placeholder="Search abstracts..."
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
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="research">Research</option>
                <option value="case_study">Case Study</option>
                <option value="review">Review</option>
                <option value="methodology">Methodology</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredAbstracts.length} of {abstracts.length} abstracts
          </div>
        </div>
      </div>

      {/* Abstracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abstract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {filteredAbstracts.map((abstract) => (
                <tr key={abstract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">{abstract.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {abstract.abstract ? abstract.abstract.substring(0, 100) + '...' : 'No abstract text available'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Keywords: {abstract.keywords}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{getAuthorName(abstract.authors)}</div>
                      <div className="text-sm text-gray-500">{abstract.email}</div>
                      <div className="text-xs text-gray-400">{abstract.institution}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(abstract.track)}`}>
                      {abstract.track ? abstract.track.replace('_', ' ') : 'No Category'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(abstract.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(abstract.status)}`}>
                        {abstract.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(abstract.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleView(abstract)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {abstract.filePath && (
                        <button 
                          onClick={() => handleDownload(abstract.filePath!, abstract)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Download Abstract"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleStatusChange(abstract.id, 'accepted')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Accept"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(abstract.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(abstract.id)}
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
        
        {filteredAbstracts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No abstracts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No abstracts have been submitted yet.'
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
              <h2 className="text-xl font-semibold text-gray-900">Abstract Details</h2>
              <button onClick={() => setViewOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-auto">
              <div>
                <div className="text-sm text-gray-500">Title</div>
                <div className="text-base font-medium text-gray-900">{selected.title}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Author</div>
                  <div className="text-base text-gray-900">{getAuthorName(selected.authors)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-base text-gray-900">{selected.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Institution</div>
                  <div className="text-base text-gray-900">{selected.institution || '—'}</div>
                </div>
                {/* Phone not in Abstract interface */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="text-base text-gray-900">{selected.track || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="text-base text-gray-900">{selected.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Keywords</div>
                  <div className="text-base text-gray-900 truncate">{selected.keywords || '—'}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Abstract</div>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-200">{selected.abstract}</pre>
              </div>
              {selected.filePath && (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3">
                  <div className="text-sm text-gray-700 truncate">{selected.fileName || 'abstract.pdf'} ({selected.fileSize ? `${Math.round(selected.fileSize/1024)} KB` : '—'})</div>
                  <button
                    onClick={() => handleDownload(selected.filePath!, selected)}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded"
                  >
                    Download
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
                onClick={() => handleStatusChange(selected.id, 'accepted')}
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
