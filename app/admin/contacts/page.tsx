'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../components/Toast';
import ToastComponent from '../../../components/Toast';
import { Trash2, Mail, Phone, MapPin, Calendar, User, Eye, EyeOff } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  responded: number;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats>({ total: 0, new: 0, read: 0, responded: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  const router = useRouter();
  
  // Initialize toast functionality
  const { toasts, showError, showSuccess } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const data = await response.json();
      setContacts(data.contacts || []);
      setStats(data.stats || { total: 0, new: 0, read: 0, responded: 0 });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showError('Error loading contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: number, newStatus: 'new' | 'read' | 'responded') => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update contact status');

      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      ));
      
      // Update stats
      await fetchContacts();
      showSuccess('Contact status updated successfully');
    } catch (error) {
      console.error('Error updating contact status:', error);
      showError('Error updating contact status');
    }
  };

  const deleteContact = async (contactId: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId })
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
      await fetchContacts();
      showSuccess('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showError('Error deleting contact');
    }
  };

  const deleteSelectedContacts = async () => {
    if (selectedContacts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) return;

    try {
      const promises = selectedContacts.map(id => 
        fetch('/api/contacts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
      );

      await Promise.all(promises);
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
      await fetchContacts();
      showSuccess(`${selectedContacts.length} contact(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      showError('Error deleting contacts');
    }
  };

  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleMessageExpansion = (contactId: number) => {
    setExpandedMessage(expandedMessage === contactId ? null : contactId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
          <p className="text-gray-600">Manage and respond to contact form submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={selectAllContacts}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              {selectedContacts.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedContacts.length} selected
                </span>
              )}
            </div>
            
            {selectedContacts.length > 0 && (
              <button
                onClick={deleteSelectedContacts}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-6">
          {contacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-600">Contact messages will appear here when submitted.</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                              {contact.email}
                            </a>
                          </div>
                          
                          {contact.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Subject: {contact.subject}</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {expandedMessage === contact.id 
                                ? contact.message
                                : contact.message.length > 200 
                                  ? `${contact.message.substring(0, 200)}...`
                                  : contact.message
                              }
                            </p>
                            {contact.message.length > 200 && (
                              <button
                                onClick={() => toggleMessageExpansion(contact.id)}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                              >
                                {expandedMessage === contact.id ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Show More
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateContactStatus(contact.id, 'read')}
                              disabled={contact.status === 'read'}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Mark as Read
                            </button>
                            
                            <button
                              onClick={() => updateContactStatus(contact.id, 'responded')}
                              disabled={contact.status === 'responded'}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Mark as Responded
                            </button>
                            
                            <a
                              href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Reply
                            </a>
                          </div>
                          
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={(id) => {}} // The useToast hook handles removal
          />
        ))}
      </div>
    </div>
  );
}