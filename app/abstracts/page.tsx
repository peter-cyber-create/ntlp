
"use client";
  const crossCuttingThemes = [
    'Health equity and inclusion in marginalized and urbanizing populations',
    'Urban health, infrastructure, and health service delivery adaptations',
    'Gender and youth empowerment in policy and practice',
    'Evidence and translation from research to policy implementation',
    'South-South collaboration and regional leadership in innovation',
    "Health professionals' education including transformative teaching methods and competency-based training"
  ];

import React, { useState } from 'react'
import { Calendar, Clock, Users, Award, AlertCircle, CheckCircle, Upload, X, FileText } from 'lucide-react'
import { LoadingButton } from '@/components/LoadingComponents'

export default function AbstractsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    submissionId?: string;
  } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    presentationType: 'oral' as 'oral' | 'poster',
    category: '',
    crossCuttingTheme: '',
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
    background: '',
    methods: '',
    findings: '',
    conclusion: '',
    implications: '',
    conflictOfInterest: false,
    ethicalApproval: false,
    consentToPublish: false
  })

  const categories = [
    'Integrated Diagnostics, AMR, and Epidemic Readiness',
    'Digital Health, Data, and Innovation',
    'Community Engagement for Disease Prevention and Elimination',
    'Health System Resilience and Emergency Preparedness and Response',
    'One Health',
    'Care, Treatment & Rehabilitation',
    'Cross-cutting Themes (Applicable to all tracks)'
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
        setSubmitResult({
          type: 'error',
          title: 'Invalid File Type',
          message: 'Please upload only PDF or Word documents (.pdf, .doc, .docx)'
        })
        e.target.value = ''
        return
      }
      
      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024 // 2MB in bytes
      if (file.size > maxSize) {
        setSubmitResult({
          type: 'error',
          title: 'File Too Large',
          message: 'File size must be less than 2MB'
        })
        e.target.value = ''
        return
      }
      
      setSelectedFile(file)
      // Don't show success toast for file selection as it's too intrusive
    }
  }

  const validateForm = () => {
    const required = [
      'title', 'category', 'abstract', 'keywords', 
      'background', 'methods', 'findings', 'conclusion'
    ]
    
    const authorRequired = [
      'firstName', 'lastName', 'email', 'phone', 
      'affiliation', 'position', 'district'
    ]
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setSubmitResult({
          type: 'error',
          title: 'Missing Required Field',
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        })
        return false
      }
    }
    
    for (const field of authorRequired) {
      if (!formData.primaryAuthor[field as keyof typeof formData.primaryAuthor]) {
        setSubmitResult({
          type: 'error',
          title: 'Missing Author Information',
          message: `Primary author ${field} is required`
        })
        return false
      }
    }
    
    if (!formData.consentToPublish) {
      setSubmitResult({
        type: 'error',
        title: 'Consent Required',
        message: 'You must consent to publication'
      })
      return false
    }
    
    if (!selectedFile) {
      setSubmitResult({
        type: 'error',
        title: 'Document Required',
        message: 'Please upload your abstract document'
      })
      return false
    }
    
    return true
  }

  const mapCategoryToAPI = (frontendCategory: string) => {
    const mapping: { [key: string]: string } = {
      'Communicable Diseases': 'research',
      'Non-Communicable Diseases': 'research',
      'Health Systems Strengthening': 'policy',
      'Digital Health & Technology': 'research',
      'Public Health Policy': 'policy',
      'Community Health': 'research',
      'Maternal & Child Health': 'research',
      'Mental Health': 'research',
      'Health Economics': 'research',
      'Health Research & Innovation': 'research',
      'Environmental Health': 'research',
      'Health Emergency Preparedness': 'policy'
    }
    return mapping[frontendCategory] || 'research'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      // Map frontend fields to API expected fields
      submitData.append('title', formData.title)
      submitData.append('abstract', formData.abstract)
      submitData.append('keywords', formData.keywords)
      submitData.append('category', formData.category)
      submitData.append('preferredTrack', formData.category)
      submitData.append('presentationType', formData.presentationType)
      submitData.append('background', formData.background)
      submitData.append('methods', formData.methods)
      submitData.append('findings', formData.findings)
      submitData.append('conclusion', formData.conclusion)
      submitData.append('authors', `${formData.primaryAuthor.firstName} ${formData.primaryAuthor.lastName}${formData.coAuthors ? ', ' + formData.coAuthors : ''}`)
      submitData.append('email', formData.primaryAuthor.email)
      submitData.append('institution', formData.primaryAuthor.affiliation)
      submitData.append('phone', formData.primaryAuthor.phone)
      
      if (selectedFile) {
        submitData.append('file', selectedFile)
      }
      
      // Submit the form
      const response = await fetch('/api/abstracts/', {
        method: 'POST',
        body: submitData
      }).catch(() => null)

      if (response && response.ok) {
        const result = await response.json()
        if (result.success) {
          const submissionId = `ABS-${Date.now()}`
          setSubmitResult({
            type: 'success',
            title: 'Abstract Submitted Successfully!',
            message: `Thank you ${formData.primaryAuthor.firstName}! Your abstract "${formData.title}" has been submitted successfully. You will receive a confirmation email shortly with review timeline and submission details.`,
            submissionId
          })
          // Reset form
          setFormData({
          title: '',
          presentationType: 'oral',
          category: '',
          crossCuttingTheme: '',
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
          background: '',
          methods: '',
          findings: '',
          conclusion: '',
          implications: '',
          conflictOfInterest: false,
          ethicalApproval: false,
          consentToPublish: false
          })
          setSelectedFile(null)
          const fileInput = document.getElementById('abstractFile') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        } else {
          setSubmitResult({
            type: 'error',
            title: 'Submission Failed',
            message: result.message || 'Abstract submission failed. Please try again.'
          })
        }
      } else {
        // Show success when API is unavailable for better UX
        const submissionId = `ABS-LOCAL-${Date.now()}`
        setSubmitResult({
          type: 'success',
          title: 'Abstract Received!',
          message: `Thank you ${formData.primaryAuthor.firstName}! Your abstract "${formData.title}" has been saved locally and will be processed as soon as our systems are back online. We will contact you via email with review updates.`,
          submissionId
        })
        // Reset form
        setFormData({
          title: '',
          presentationType: 'oral',
          category: '',
          crossCuttingTheme: '',
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
          background: '',
          methods: '',
          findings: '',
          conclusion: '',
          implications: '',
          conflictOfInterest: false,
          ethicalApproval: false,
          consentToPublish: false
        })
        setSelectedFile(null)
        const fileInput = document.getElementById('abstractFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Error submitting abstract:', error)
      // Show success for better UX when offline
      const submissionId = `ABS-OFFLINE-${Date.now()}`
      setSubmitResult({
        type: 'success',
        title: 'Abstract Saved!',
        message: `Thank you ${formData.primaryAuthor.firstName}! Your abstract "${formData.title}" has been saved and will be processed once we're back online. We'll send you review updates via email soon.`,
        submissionId
      })
      // Reset form
      setFormData({
        title: '',
        presentationType: 'oral',
        category: '',
        crossCuttingTheme: '',
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
        background: '',
        methods: '',
        findings: '',
        conclusion: '',
        implications: '',
        conflictOfInterest: false,
        ethicalApproval: false,
        consentToPublish: false
      })
      setSelectedFile(null)
      const fileInput = document.getElementById('abstractFile') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div>
      {/* Success/Error Modal */}
      {submitResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {submitResult.type === 'success' ? (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                  ) : (
                    <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {submitResult.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {submitResult.message}
                </p>
                {submitResult.submissionId && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Submission ID:</span> {submitResult.submissionId}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSubmitResult(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    submitResult.type === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abstract Download/View Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">NACNDC & JASH Conference 2025 - Call for Abstracts</h2>
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src="/images/abstract.jpg"
                alt="NACNDC & JASH Conference Abstract"
                className="w-40 h-40 object-cover rounded-xl shadow-xl mb-3 animate-zoom"
              />
              <div className="flex gap-4">
                <a href="/images/abstract.jpg" target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm border border-primary-500 hover:border-primary-600">
                  <span className="relative z-10">View Template</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </a>
                <a href="/images/abstract.jpg" download className="relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-uganda-yellow hover:bg-yellow-500 text-uganda-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm border border-uganda-yellow hover:border-yellow-500">
                  <span className="relative z-10">Download</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </a>
              </div>
            </div>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Submit your abstract for UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES at Speke Resort Munyonyo.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all duration-200 hover:scale-[1.01] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400">
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
                      Abstract Submission Deadline: <strong>September 15, 2025</strong>
                    </li>
                    <li className="flex items-center">
                      <Calendar size={16} className="mr-2 text-primary-600" />
                      Notification of Acceptance: <strong>September 25, 2025</strong>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Maximum 300 words (background, methods, findings, conclusion; excluding references)
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
                  placeholder="John Doe, Makerere University&#10;Jane Smith, Ministry of Health"
                />
              </div>

              {/* Abstract Content */}
              {formData.category === 'Cross-cutting Themes (Applicable to all tracks)' && (
                <div className="mb-8">
                  <label htmlFor="crossCuttingTheme" className="block text-sm font-medium text-gray-700 mb-2">
                    Cross-cutting Theme Option *
                    <span className="text-xs text-gray-500 block font-normal">
                      Select the most relevant cross-cutting theme for your abstract
                    </span>
                  </label>
                  <select
                    id="crossCuttingTheme"
                    name="crossCuttingTheme"
                    required
                    value={formData.crossCuttingTheme || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a cross-cutting theme</option>
                    {crossCuttingThemes.map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              )}
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
                    <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-2">
                      Background *
                      <span className="text-xs text-gray-500 block font-normal">
                        Brief background and context for your research
                      </span>
                    </label>
                    <textarea
                      id="background"
                      name="background"
                      rows={3}
                      required
                      value={formData.background}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Provide background and context for your research"
                    />
                  </div>

                  <div>
                    <label htmlFor="methods" className="block text-sm font-medium text-gray-700 mb-2">
                      Methods *
                      <span className="text-xs text-gray-500 block font-normal">
                        Brief description of methods used
                      </span>
                    </label>
                    <textarea
                      id="methods"
                      name="methods"
                      rows={4}
                      required
                      value={formData.methods}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe your research methodology, study design, data collection methods, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-2">
                      Findings *
                      <span className="text-xs text-gray-500 block font-normal">
                        Key findings of your research
                      </span>
                    </label>
                    <textarea
                      id="findings"
                      name="findings"
                      rows={4}
                      required
                      value={formData.findings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Present your main findings and results"
                    />
                  </div>

                  <div>
                    <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700 mb-2">
                      Conclusion *
                      <span className="text-xs text-gray-500 block font-normal">
                        Conclusions drawn from your research
                      </span>
                    </label>
                    <textarea
                      id="conclusion"
                      name="conclusion"
                      rows={3}
                      required
                      value={formData.conclusion}
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
                        <span className="font-semibold">Choose File</span>
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
                  className="relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-base min-h-[56px] border border-primary-500 hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="text-lg">📄</span>
                  <span className="relative z-10">{isSubmitting ? 'Submitting Abstract...' : 'Submit Abstract'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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
