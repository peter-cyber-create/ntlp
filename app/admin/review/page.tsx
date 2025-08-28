'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Building,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FormSubmission {
  id: number;
  form_type: 'registration' | 'abstract' | 'contact' | 'sponsorship';
  entity_id: number;
  submitted_by: string;
  submission_data: any;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_revision';
  admin_notes: any;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_comments: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewStats {
  total: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  requiresRevision: number;
}

export default function AdminReviewPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'registrations' | 'abstracts' | 'contacts' | 'sponsorships'>('all');
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0, requiresRevision: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_revision'>('all');
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [reviewModal, setReviewModal] = useState<{ open: boolean; submission: FormSubmission | null }>({ open: false, submission: null });

  useEffect(() => {
    loadSubmissions();
  }, [activeTab, statusFilter]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        form_type: activeTab === 'all' ? 'all' : activeTab,
        status: statusFilter,
        page: '1',
        limit: '100'
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setStats({
          total: data.statistics?.byStatus?.reduce((acc: number, stat: any) => acc + stat.count, 0) || 0,
          submitted: data.statistics?.byStatus?.find((s: any) => s.status === 'submitted')?.count || 0,
          underReview: data.statistics?.byStatus?.find((s: any) => s.status === 'under_review')?.count || 0,
          approved: data.statistics?.byStatus?.find((s: any) => s.status === 'approved')?.count || 0,
          rejected: data.statistics?.byStatus?.find((s: any) => s.status === 'rejected')?.count || 0,
          requiresRevision: data.statistics?.byStatus?.find((s: any) => s.status === 'requires_revision')?.count || 0
        });
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId: number, newStatus: string, notes: string) => {
    try {
      const response = await fetch(`/api/${getEntityType(submissions.find(s => s.id === submissionId)?.form_type)}/${submissions.find(s => s.id === submissionId)?.entity_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: notes,
          review_comments: notes
        })
      });

      if (response.ok) {
        await loadSubmissions();
        setReviewModal({ open: false, submission: null });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getEntityType = (formType: string | undefined) => {
    switch (formType) {
      case 'registration': return 'registrations';
      case 'abstract': return 'abstracts';
      case 'contact': return 'contacts';
      case 'sponsorship': return 'sponsorships';
      default: return 'registrations';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock size={16} />;
      case 'under_review': return <AlertCircle size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'requires_revision': return <Edit size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getFormTypeIcon = (formType: string) => {
    switch (formType) {
      case 'registration': return <Users size={20} />;
      case 'abstract': return <FileText size={20} />;
      case 'contact': return <MessageSquare size={20} />;
      case 'sponsorship': return <Building size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.submitted_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         JSON.stringify(submission.submission_data).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Submissions Review</h1>
          <p className="text-gray-600 mt-2">Review and manage all form submissions from users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Revision</p>
                <p className="text-2xl font-bold text-gray-900">{stats.requiresRevision}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All', count: stats.total },
                  { key: 'registrations', label: 'Registrations', count: stats.submitted + stats.underReview },
                  { key: 'abstracts', label: 'Abstracts', count: stats.submitted + stats.underReview },
                  { key: 'contacts', label: 'Contacts', count: stats.submitted + stats.underReview },
                  { key: 'sponsorships', label: 'Sponsorships', count: stats.submitted + stats.underReview }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="requires_revision">Requires Revision</option>
              </select>

              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadSubmissions}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Submissions ({filteredSubmissions.length})
              </h3>
              
              {selectedSubmissions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedSubmissions.length} selected
                  </span>
                  <button
                    onClick={() => setShowBatchActions(!showBatchActions)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                  >
                    Batch Actions
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No submissions found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubmissions([...selectedSubmissions, submission.id]);
                          } else {
                            setSelectedSubmissions(selectedSubmissions.filter(id => id !== submission.id));
                          }
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />

                      {/* Form Type Icon */}
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFormTypeIcon(submission.form_type)}
                      </div>

                      {/* Submission Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {submission.form_type.charAt(0).toUpperCase() + submission.form_type.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Submitted by: <span className="font-medium">{submission.submitted_by}</span>
                        </p>
                        
                        <p className="text-sm text-gray-500">
                          {new Date(submission.created_at).toLocaleDateString()} at {new Date(submission.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        {expandedSubmission === submission.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      
                      <button
                        onClick={() => setReviewModal({ open: true, submission })}
                        className="p-2 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-50"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedSubmission === submission.id && (
                    <div className="mt-4 pl-12">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Submission Data:</h4>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(submission.submission_data, null, 2)}
                        </pre>
                        
                        {submission.admin_notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-1">Admin Notes:</h5>
                            <p className="text-sm text-gray-700">{submission.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal.open && reviewModal.submission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Review {reviewModal.submission.form_type}
                </h3>
                <button
                  onClick={() => setReviewModal({ open: false, submission: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status-select"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="requires_revision">Requires Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    id="admin-notes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your review notes here..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setReviewModal({ open: false, submission: null })}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const status = (document.getElementById('status-select') as HTMLSelectElement).value;
                      const notes = (document.getElementById('admin-notes') as HTMLTextAreaElement).value;
                      handleStatusUpdate(reviewModal.submission!.id, status, notes);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
