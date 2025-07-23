'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Users, Award, AlertCircle, CheckCircle, Upload, X, FileText } from 'lucide-react'
import { Toast, ToastContainer, useToast } from '@/components/Toast'
import { optimizedFetch } from '@/lib/performance'
import { LoadingButton } from '@/components/LoadingComponents'

export default function AbstractsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    presentationType: 'oral' as 'oral' | 'poster',
    category: '',
    primaryAuthor: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      affiliation: '',
      position: '',
      district: ''
    },
    coAuthors: '',
    abstract: '',
    keywords: '',
    objectives: '',
    methodology: '',
    results: '',
    conclusions: '',
    implications: '',
    conflictOfInterest: false,
    ethicalApproval: false,
    consentToPublish: false
  })

  const categories = [
    'Communicable Diseases',
    'Non-Communicable Diseases',
    'Health Systems Strengthening',
    'Digital Health & Technology',
    'Public Health Policy',
    'Community Health',
    'Maternal & Child Health',
    'Mental Health',
    'Health Economics',
    'Health Research & Innovation',
    'Environmental Health',
    'Health Emergency Preparedness'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('primaryAuthor.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        primaryAuthor: {
          ...prev.primaryAuthor,
          [field]: value
        }
      }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        showError('Please upload only PDF or Word documents (.pdf, .doc, .docx)')
        e.target.value = ''
        return
      }
      
      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024 // 2MB in bytes
      if (file.size > maxSize) {
        showError('File size must be less than 2MB')
        e.target.value = ''
        return
      }
      
      setSelectedFile(file)
      showSuccess(`File "${file.name}" selected successfully`)
    }
  }

  const validateForm = () => {
    const required = [
      'title', 'category', 'abstract', 'keywords', 
      'objectives', 'methodology', 'results', 'conclusions'
    ]
    
    const authorRequired = [
      'firstName', 'lastName', 'email', 'phone', 
      'affiliation', 'position', 'district'
    ]
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        showError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        return false
      }
    }
    
    for (const field of authorRequired) {
      if (!formData.primaryAuthor[field as keyof typeof formData.primaryAuthor]) {
        showError(`Primary author ${field} is required`)
        return false
      }
    }
    
    if (!formData.consentToPublish) {
      showError('You must consent to publication')
      return false
    }
    
    if (!selectedFile) {
      showError('Please upload your abstract document')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      submitData.append('abstractData', JSON.stringify(formData))
      if (selectedFile) {
        submitData.append('abstractFile', selectedFile)
      }
      
      // Use optimized fetch with timeout and retry
      const response = await optimizedFetch('/api/abstracts/', {
        method: 'POST',
        body: submitData
      }, 15000) // 15 second timeout for file uploads

      const result = await response.json()

      if (result.success) {
        showSuccess('Abstract submitted successfully! You will receive a confirmation email shortly.', 8000)
        // Reset form
        setFormData({
          title: '',
          presentationType: 'oral',
          category: '',
          primaryAuthor: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            affiliation: '',
            position: '',
            district: ''
          },
          coAuthors: '',
          abstract: '',
          keywords: '',
          objectives: '',
          methodology: '',
          results: '',
          conclusions: '',
          implications: '',
          conflictOfInterest: false,
          ethicalApproval: false,
          consentToPublish: false
        })
        setSelectedFile(null)
        const fileInput = document.getElementById('abstractFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        showError(result.message || 'Abstract submission failed. Please try again.', 6000)
      }
    } catch (error) {
      console.error('Error submitting abstract:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        showError('Request timeout. Please check your connection and try again.', 6000)
      } else {
        showError('Network error. Please check your connection and try again.', 6000)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Submit Your Abstract
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Share your research and expertise at Uganda's premier health conference. 
              Submit your abstract for oral presentation or poster session.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-3 text-primary-600" />
                Submission Guidelines
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Dates</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <Calendar size={16} className="mr-2 text-primary-600" />
                      Abstract Submission Deadline: <strong>July 15, 2025</strong>
                    </li>
                    <li className="flex items-center">
                      <Calendar size={16} className="mr-2 text-primary-600" />
                      Notification of Acceptance: <strong>July 25, 2025</strong>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Maximum 500 words (excluding references)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      File formats: PDF, DOC, DOCX only
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Maximum file size: 2MB
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="mr-3 text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-blue-900">Review Process</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      All abstracts will be reviewed by the scientific committee. 
                      Authors will be notified of acceptance and presentation format by email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Abstract Information</h3>
                
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Abstract Title *
                      <span className="text-xs text-gray-500 block font-normal">
                        Provide a clear, descriptive title for your research
                      </span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your abstract title"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="presentationType" className="block text-sm font-medium text-gray-700 mb-2">
                        Presentation Type *
                        <span className="text-xs text-gray-500 block font-normal">
                          Select your preferred presentation format
                        </span>
                      </label>
                      <select
                        id="presentationType"
                        name="presentationType"
                        required
                        value={formData.presentationType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="oral">Oral Presentation</option>
                        <option value="poster">Poster Presentation</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Research Category *
                        <span className="text-xs text-gray-500 block font-normal">
                          Choose the most relevant category
                        </span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Author Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Primary Author Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="primaryAuthor.firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="primaryAuthor.firstName"
                      name="primaryAuthor.firstName"
                      required
                      value={formData.primaryAuthor.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryAuthor.lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="primaryAuthor.lastName"
                      name="primaryAuthor.lastName"
                      required
                      value={formData.primaryAuthor.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryAuthor.email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                      <span className="text-xs text-gray-500 block font-normal">
                        Official correspondence will be sent to this email
                      </span>
                    </label>
                    <input
                      type="email"
                      id="primaryAuthor.email"
                      name="primaryAuthor.email"
                      required
                      value={formData.primaryAuthor.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryAuthor.phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                      <span className="text-xs text-gray-500 block font-normal">
                        Include country code (e.g., +256)
                      </span>
                    </label>
                    <input
                      type="tel"
                      id="primaryAuthor.phone"
                      name="primaryAuthor.phone"
                      required
                      value={formData.primaryAuthor.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryAuthor.affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                      Institution/Organization *
                      <span className="text-xs text-gray-500 block font-normal">
                        Full name of your institution
                      </span>
                    </label>
                    <input
                      type="text"
                      id="primaryAuthor.affiliation"
                      name="primaryAuthor.affiliation"
                      required
                      value={formData.primaryAuthor.affiliation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryAuthor.position" className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Title *
                    </label>
                    <input
                      type="text"
                      id="primaryAuthor.position"
                      name="primaryAuthor.position"
                      required
                      value={formData.primaryAuthor.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="primaryAuthor.district" className="block text-sm font-medium text-gray-700 mb-2">
                      District/Region *
                      <span className="text-xs text-gray-500 block font-normal">
                        District where you are based in Uganda
                      </span>
                    </label>
                    <input
                      type="text"
                      id="primaryAuthor.district"
                      name="primaryAuthor.district"
                      required
                      value={formData.primaryAuthor.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Co-Authors */}
              <div className="mb-8">
                <label htmlFor="coAuthors" className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Authors (Optional)
                  <span className="text-xs text-gray-500 block font-normal">
                    List all co-authors with their affiliations (one per line)
                  </span>
                </label>
                <textarea
                  id="coAuthors"
                  name="coAuthors"
                  rows={4}
                  value={formData.coAuthors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe, Makerere University&#10;Jane Smith, Ministry of Health"
                />
              </div>

              {/* Abstract Content */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Abstract Content</h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                      Abstract Summary *
                      <span className="text-xs text-gray-500 block font-normal">
                        Provide a concise summary of your research (100-150 words)
                      </span>
                    </label>
                    <textarea
                      id="abstract"
                      name="abstract"
                      rows={6}
                      required
                      value={formData.abstract}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Provide a brief summary of your research including background, methods, key findings, and conclusions"
                    />
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords *
                      <span className="text-xs text-gray-500 block font-normal">
                        3-6 keywords separated by commas
                      </span>
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      name="keywords"
                      required
                      value={formData.keywords}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="public health, disease prevention, Uganda, health systems"
                    />
                  </div>

                  <div>
                    <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                      Objectives *
                      <span className="text-xs text-gray-500 block font-normal">
                        Clear statement of research objectives or aims
                      </span>
                    </label>
                    <textarea
                      id="objectives"
                      name="objectives"
                      rows={3}
                      required
                      value={formData.objectives}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="State the main objectives of your research"
                    />
                  </div>

                  <div>
                    <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                      Methodology *
                      <span className="text-xs text-gray-500 block font-normal">
                        Brief description of methods used
                      </span>
                    </label>
                    <textarea
                      id="methodology"
                      name="methodology"
                      rows={4}
                      required
                      value={formData.methodology}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe your research methodology, study design, data collection methods, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="results" className="block text-sm font-medium text-gray-700 mb-2">
                      Results *
                      <span className="text-xs text-gray-500 block font-normal">
                        Key findings of your research
                      </span>
                    </label>
                    <textarea
                      id="results"
                      name="results"
                      rows={4}
                      required
                      value={formData.results}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Present your main findings and results"
                    />
                  </div>

                  <div>
                    <label htmlFor="conclusions" className="block text-sm font-medium text-gray-700 mb-2">
                      Conclusions *
                      <span className="text-xs text-gray-500 block font-normal">
                        Conclusions drawn from your research
                      </span>
                    </label>
                    <textarea
                      id="conclusions"
                      name="conclusions"
                      rows={3}
                      required
                      value={formData.conclusions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="State your main conclusions"
                    />
                  </div>

                  <div>
                    <label htmlFor="implications" className="block text-sm font-medium text-gray-700 mb-2">
                      Policy/Practice Implications (Optional)
                      <span className="text-xs text-gray-500 block font-normal">
                        How your research can inform policy or practice
                      </span>
                    </label>
                    <textarea
                      id="implications"
                      name="implications"
                      rows={3}
                      value={formData.implications}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe the implications of your research for health policy or practice in Uganda"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Document Upload</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label htmlFor="abstractFile" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-900">Upload Abstract Document</span>
                      <p className="text-sm text-gray-600 mt-2">
                        PDF, DOC, or DOCX files only. Maximum size: 2MB
                      </p>
                      <input
                        type="file"
                        id="abstractFile"
                        name="abstractFile"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="mt-4 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                        Choose File
                      </span>
                    </label>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">Selected: {selectedFile.name}</p>
                        <p className="text-green-600 text-sm">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Declarations</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="conflictOfInterest"
                      name="conflictOfInterest"
                      checked={formData.conflictOfInterest}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="conflictOfInterest" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Conflict of Interest:</span> I declare that there are no conflicts of interest related to this research.
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="ethicalApproval"
                      name="ethicalApproval"
                      checked={formData.ethicalApproval}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="ethicalApproval" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Ethical Approval:</span> This research has obtained necessary ethical approvals (where applicable).
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consentToPublish"
                      name="consentToPublish"
                      required
                      checked={formData.consentToPublish}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="consentToPublish" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Consent to Publish:</span> I consent to the publication of this abstract in conference proceedings and related materials. *
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-200"
                >
                  {isSubmitting ? 'Submitting Abstract...' : 'Submit Abstract'}
                </LoadingButton>
                <p className="text-sm text-gray-600 mt-4">
                  By submitting this form, you agree to the conference terms and conditions.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
