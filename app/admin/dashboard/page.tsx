'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, Mail, BarChart3, Eye, Edit, Trash2, CheckCircle, X } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [registrationsData, setRegistrationsData] = useState<any[]>([])
  const [abstractsData, setAbstractsData] = useState<any[]>([])
  const [contactsData, setContactsData] = useState<any[]>([])

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      window.location.href = '/admin'
      return
    }

    // Load sample data
    loadSampleData()
  }, [])

  const loadSampleData = () => {
    // Sample registrations
    const sampleRegistrations = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        organization: 'Ministry of Health',
        district: 'Kampala',
        status: 'submitted',
        registrationType: 'Standard',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        organization: 'Uganda Medical Association',
        district: 'Entebbe',
        status: 'approved',
        registrationType: 'VIP',
        createdAt: new Date().toISOString()
      }
    ]

    // Sample abstracts
    const sampleAbstracts = [
      {
        id: 1,
        title: 'Research on Communicable Diseases in Uganda',
        authors: 'Dr. Michael Johnson',
        email: 'michael.johnson@example.com',
        category: 'research',
        status: 'submitted',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Case Study: Non-Communicable Disease Prevention',
        authors: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@example.com',
        category: 'case-study',
        status: 'accepted',
        createdAt: new Date().toISOString()
      }
    ]

    // Sample contacts
    const sampleContacts = [
      {
        id: 1,
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        subject: 'Conference Registration Query',
        message: 'I have a question about the registration process.',
        status: 'new',
        createdAt: new Date().toISOString()
      }
    ]

    setRegistrationsData(sampleRegistrations)
    setAbstractsData(sampleAbstracts)
    setContactsData(sampleContacts)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">{registrationsData.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Abstracts</p>
              <p className="text-3xl font-bold text-gray-900">{abstractsData.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">{contactsData.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegistrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Registrations</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Organization</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">District</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrationsData.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {reg.first_name} {reg.last_name}
                  </td>
                  <td className="py-4 px-6">{reg.email}</td>
                  <td className="py-4 px-6">{reg.organization}</td>
                  <td className="py-4 px-6">{reg.district}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {reg.registrationType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                      reg.status === 'submitted' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Delete">
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

  const renderAbstracts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Abstracts</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Title</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Author</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {abstractsData.map((abstract) => (
                <tr key={abstract.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900 max-w-xs truncate">
                    {abstract.title}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {abstract.authors}
                    <br />
                    <span className="text-xs text-gray-500">{abstract.email}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {abstract.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      abstract.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      abstract.status === 'submitted' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {abstract.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="Accept">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Reject">
                        <X size={16} />
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

  const renderContacts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Contact Inquiries</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Subject</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contactsData.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{contact.name}</td>
                  <td className="py-4 px-6 text-gray-600">{contact.email}</td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{contact.subject}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="Reply">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Delete">
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

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'abstracts', label: 'Abstracts', icon: FileText },
    { id: 'contacts', label: 'Inquiries', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">NACNDC & JASHConference 2025</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('admin_authenticated')
              window.location.href = '/admin'
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'registrations' && renderRegistrations()}
          {activeTab === 'abstracts' && renderAbstracts()}
          {activeTab === 'contacts' && renderContacts()}
        </main>
      </div>
    </div>
  )
}
