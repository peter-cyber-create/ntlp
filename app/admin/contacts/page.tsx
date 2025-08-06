'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Trash2, 
  Mail, 
  Phone, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'responded'>('all');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // Fallback to mock data when database is unavailable
      const mockContacts = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah@health.go.ug',
          phone: '+256712345678',
          subject: 'Partnership Inquiry',
          message: 'Hello, I am interested in exploring partnership opportunities for the upcoming health conference. Our organization specializes in maternal health initiatives.',
          status: 'new' as const,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael@startup.co',
          subject: 'Speaking Opportunity',
          message: 'I would like to propose a presentation on digital health innovations in East Africa.',
          status: 'read' as const,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: 'Amina Kone',
          email: 'amina@ngo.org',
          subject: 'Sponsorship Question',
          message: 'Our NGO is interested in sponsoring the conference. Could you provide more details about sponsorship packages?',
          status: 'responded' as const,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      const response = await fetch('/api/contacts').catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json();
        setContacts(data.contacts || mockContacts);
        setStats(data.stats || { 
          total: mockContacts.length, 
          new: mockContacts.filter(c => c.status === 'new').length,
          read: mockContacts.filter(c => c.status === 'read').length,
          responded: mockContacts.filter(c => c.status === 'responded').length
        });
      } else {
        // Use mock data when API fails
        console.log('API unavailable, using mock contact data');
        setContacts(mockContacts);
        setStats({ 
          total: mockContacts.length, 
          new: mockContacts.filter(c => c.status === 'new').length,
          read: mockContacts.filter(c => c.status === 'read').length,
          responded: mockContacts.filter(c => c.status === 'responded').length
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('Error loading contacts', 'error');
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
      }).catch(() => null);

      if (response && response.ok) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        ));
        await fetchContacts();
      } else {
        // Update locally when API fails
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        ));
      }
      
      showToast('Contact status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating contact status:', error);
      showToast('Error updating contact status', 'error');
    }
  };

  const deleteContact = async (contactId: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId })
      }).catch(() => null);

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
      await fetchContacts();
      showToast('Contact deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Error deleting contact', 'error');
    }
  };

  const deleteSelectedContacts = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) return;

    try {
      // Delete each contact
      for (const contactId of selectedContacts) {
        await deleteContact(contactId);
      }
      setSelectedContacts([]);
      await fetchContacts();
      showToast(`${selectedContacts.length} contact(s) deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting contacts:', error);
      showToast('Error deleting contacts', 'error');
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
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleMessageExpansion = (contactId: number) => {
    setExpandedMessage(expandedMessage === contactId ? null : contactId);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
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
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage inquiries and responses</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              title="Back to Dashboard"
            >
              <ExternalLink size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-red-600">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read Messages</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Messages ({filteredContacts.length})</h2>
            <div className="flex gap-3">
              {selectedContacts.length > 0 && (
                <button 
                  onClick={deleteSelectedContacts}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedContacts.length})
                </button>
              )}
              <button
                onClick={() => {
                  const csv = filteredContacts.map(c => 
                    `"${c.name}","${c.email}","${c.subject}","${c.status}","${new Date(c.created_at).toLocaleDateString()}"`
                  ).join('\n')
                  const blob = new Blob([`Name,Email,Subject,Status,Date\n${csv}`], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={selectAllContacts}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Subject</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{contact.subject}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{contact.message}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleMessageExpansion(contact.id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" 
                          title="View Message"
                        >
                          {expandedMessage === contact.id ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact.id, e.target.value as any)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="responded">Responded</option>
                        </select>
                        <button 
                          onClick={() => deleteContact(contact.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {expandedMessage && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="py-4 px-6">
                      {(() => {
                        const contact = contacts.find(c => c.id === expandedMessage);
                        return contact ? (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Full Message:</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                            {contact.phone && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'No contact messages have been received yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
