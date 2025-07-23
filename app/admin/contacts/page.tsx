'use client'

import React, { useState, useEffect } from 'react'
import DataManager, { ContactSubmission } from '../../../lib/dataManager'
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Building, 
  User,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react'
import Link from 'next/link'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [dataManager, setDataManager] = useState<DataManager | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (!isAuthenticated) {
      window.location.href = '/admin'
      return
    }

    // Initialize data manager
    const dm = DataManager.getInstance()
    setDataManager(dm)
    loadContacts(dm)
  }, [])

  const loadContacts = (dm: DataManager) => {
    const allContacts = dm.getContactSubmissions({ 
      status: filterStatus === 'all' ? undefined : filterStatus 
    })
    setContacts(allContacts)
  }

  const updateContactStatus = (id: string, status: ContactSubmission['status']) => {
    if (!dataManager) return
    
    const updated = dataManager.updateContactStatus(id, status)
    if (updated) {
      loadContacts(dataManager)
      if (selectedContact?.id === id) {
        setSelectedContact(updated)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      resolved: 'bg-gray-100 text-gray-800 border-gray-200',
      archived: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={16} />
      case 'replied': return <MessageSquare size={16} />
      case 'resolved': return <CheckCircle size={16} />
      case 'archived': return <Archive size={16} />
      default: return <Clock size={16} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-sm text-gray-600">Manage inquiries and applications</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                if (dataManager) {
                  const filtered = dataManager.getContactSubmissions({ 
                    status: e.target.value === 'all' ? undefined : e.target.value 
                  })
                  setContacts(filtered)
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Contact List */}
        <div className="w-1/3 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900">
              {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="overflow-y-auto max-h-screen">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 truncate">{contact.subject}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Mail size={12} />
                    <span className="truncate">{contact.email}</span>
                  </span>
                  <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            
            {contacts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Mail className="mx-auto mb-2" size={48} />
                <p>No contacts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="flex-1">
          {selectedContact ? (
            <div className="p-6">
              {/* Contact Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedContact.name}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail size={16} />
                        <a href={`mailto:${selectedContact.email}`} className="hover:text-primary-600">
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.organization && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Building size={16} />
                          <span>{selectedContact.organization}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusBadge(selectedContact.status)}`}>
                      {getStatusIcon(selectedContact.status)}
                      <span>{selectedContact.status}</span>
                    </span>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'resolved')}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'archived')}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Subject</h3>
                <p className="text-gray-700">{selectedContact.subject}</p>
              </div>

              {/* Message */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                
                {/* Quick Reply */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Reply</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-gray-900">Thank you for your inquiry</p>
                      <p className="text-sm text-gray-600">We appreciate your interest in The Communicable and Non-Communicable Diseases Conference...</p>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-gray-900">Speaker application received</p>
                      <p className="text-sm text-gray-600">Thank you for your speaker application. We will review...</p>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-gray-900">Partnership opportunity</p>
                      <p className="text-sm text-gray-600">We're excited about potential partnership opportunities...</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Eye className="mx-auto mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Contact</h3>
                <p>Choose a contact from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
