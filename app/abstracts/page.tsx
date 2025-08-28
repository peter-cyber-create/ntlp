 
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
    subcategory: '',
    crossCuttingThemes: '',
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

  // Conference tracks and topics
  const trackTopics: Record<string, string[]> = {
    'Integrated Diagnostics, AMR, and Epidemic Readiness': [
      'Optimizing Laboratory Diagnostics in Integrated Health Systems',
      'Quality management systems in Multi-Disease Diagnostics',
      'Leveraging Point-of-Care Testing to Enhance Integrated Service Delivery',
      'Combatting Antimicrobial Resistance (AMR) Through Diagnostics',
      'Strengthening surveillance systems for drug resistance across TB, malaria, HIV, and bacterial infections',
      'Linking diagnostics to resistance monitoring: From lab to real-time policy response',
      'Role of Diagnostics in Early Warning Systems: lessons from recent outbreaks',
      'Expanding access to radiological services: Affordable imaging in low-resource settings',
    ],
    'Digital Health, Data, and Innovation': [
      'AI-powered diagnostics: Innovations and governance for TB, HIV, and cervical cancer',
      'Digital platforms for surveillance, early detection, and outbreak prediction',
      'Data interoperability and health information exchange: service delivery Integration and data/information systems, Gaps, ethics, and governance',
      'Community-led digital health: Mobile tools, and digital village health teams (VHTs)',
      'Localized health information systems: Capturing/collection, use of data at grass root and higher levels for fast action.',
      'Leveraging digital equity in urban and peri-urban health responses',
    ],
    'Community Engagement for Disease Prevention and Elimination': [
      'Catalyzing youth, community health extension workers (CHEWs), and grassroots champions for health innovation',
      'Integrating preventive services for communicable and non-communicable diseases, and mental health at household level',
      'Scaling community-led elimination efforts: Malaria, TB, neglected tropical diseases (NTDs), and leprosy and improving vaccine uptake',
      'Participatory planning, implementation, monitoring for behavior change, and social accountability',
    ],
    'Health System Resilience and Emergency Preparedness and Response': [
      'Sepsis and emergency triage protocols in fragile health systems',
      'Strengthening infection prevention and control (IPC) in primary care; including ready to use isolation facilities.',
      'Local vaccine and therapeutics; access, and emergency stockpiling',
      'Health workforce preparedness; Training multidisciplinary rapid response teams',
      'Continuity of care: Protecting essential health services during crises',
    ],
    'Policy, Financing and Cross-Sector Integration': [
      'Integrated financing models for chronic and infectious disease burdens',
      'Social determinant-sensitive policymaking: Urban health, empowering young people for improved health through education and intersectoral action',
      'National accountability frameworks for health performance',
      'Scaling UHC through service integration at the primary level',
      'Policy instruments for embedding health equity in national planning',
      'Implementation science and translation of results into policy',
    ],
    'One Health': [
      'Early warning systems and multi-sector coordination for zoonotic outbreaks',
      'Localizing One Health strategies: Successes and challenges at district level',
      'Public–private partnerships; Insurance, vouchers, and demand-side financing to reduce out-of-pocket expenditure',
      'Data harmonization between human and animal health sectors',
      'Nutrition and lifestyle for health',
      'Wildlife trade, food systems, and emerging health risks',
      'Preparing for climate-sensitive disease patterns and spillover threats',
      'Strengthening Biosafety and Biosecurity Systems to Prevent Zoonotic Spillovers',
      'Confronting Insecticide Resistance in Vectors: A One Health approach to sustaining vector control gains',
    ],
    'Care, Treatment & Rehabilitation': [
      'Innovations in equitable health services for acute and chronic diseases care delivery across primary levels',
      'Interface of communicable and non-communicable diseases (NCDs): Integrated models',
      'Role of traditional medicine in continuum of care',
      'Enhancing community trust and treatment adherence through culturally embedded care',
      'Digital decision-support tools for frontline clinicians in NCD and infectious disease management',
    ],
  }

  const categories = [
    'Integrated Diagnostics, AMR, and Epidemic Readiness',
    'Digital Health, Data, and Innovation',
    'Community Engagement for Disease Prevention and Elimination',
    'Health System Resilience and Emergency Preparedness and Response',
    'Policy, Financing and Cross-Sector Integration',
    'One Health',
    'Care, Treatment & Rehabilitation',
    'Cross-Cutting Themes (Applicable to All Tracks)'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: '', // Reset subcategory when category changes
      }))
      return
    }
    if (name === 'subcategory') {
      setFormData(prev => ({ ...prev, subcategory: value }))
      return
    }
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
    if (formData.category && trackTopics[formData.category]) {
      required.push('subcategory')
    }
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
    // Word count validation (background + methods + findings + conclusion)
    const wordCount = [formData.background, formData.methods, formData.findings, formData.conclusion]
      .map(s => s.trim().split(/\s+/).filter(Boolean).length)
      .reduce((a, b) => a + b, 0)
    if (wordCount > 300) {
      setSubmitResult({
        type: 'error',
        title: 'Word Limit Exceeded',
        message: `Abstract content (background, methods, findings, conclusion) must not exceed 300 words. Current: ${wordCount}`
      })
      return false
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
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Prepare the submission data
      const submissionData = {
        title: formData.title,
        abstract: `${formData.background}\n\nMethods:\n${formData.methods}\n\nFindings:\n${formData.findings}\n\nConclusion:\n${formData.conclusion}`,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        authors: [
          {
            name: `${formData.primaryAuthor.firstName} ${formData.primaryAuthor.lastName}`,
            email: formData.primaryAuthor.email,
            affiliation: formData.primaryAuthor.affiliation,
            position: formData.primaryAuthor.position
          },
          ...formData.coAuthors.split(',').map(author => author.trim()).filter(author => author).map(author => ({
            name: author,
            email: '',
            affiliation: '',
            position: ''
          }))
        ],
        corresponding_author_email: formData.primaryAuthor.email,
        submission_type: 'abstract',
        track: formData.category,
        subcategory: formData.subcategory,
        cross_cutting_themes: formData.crossCuttingThemes ? [formData.crossCuttingThemes] : [],
        format: formData.presentationType,
        submitted_by: formData.primaryAuthor.email
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/abstracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitResult({
          type: 'success',
          title: 'Abstract Submitted Successfully!',
          message: 'Your abstract has been submitted and is now under review by our scientific committee.',
          submissionId: result.abstract?.id || result.id
        });
        
        // Reset form
        setFormData({
          title: '',
          presentationType: 'oral',
          category: '',
          subcategory: '',
          crossCuttingThemes: '',
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
        });
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        setSubmitResult({
          type: 'error',
          title: 'Submission Failed',
          message: errorData.error || 'Failed to submit abstract. Please try again.'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitResult({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the server. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen pb-12">
      {/* Success/Error Modal */}
      {submitResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {submitResult.type === 'success' ? (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={28} />
                  ) : (
                    <AlertCircle className="text-red-500 flex-shrink-0" size={28} />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">
                    {submitResult.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {submitResult.message}
                </p>
                
                {submitResult.submissionId && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Submission ID:</p>
                    <p className="font-mono font-semibold text-gray-800">
                      {submitResult.submissionId}
                    </p>
                  </div>
                )}
                
                {submitResult.type === 'success' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your abstract is now under review</li>
                      <li>• Scientific committee will evaluate your submission</li>
                      <li>• You'll receive feedback and decision via email</li>
                      <li>• Accepted abstracts will be scheduled for presentation</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSubmitResult(null)}
                  className={`px-5 py-2 rounded-lg font-semibold transition-colors shadow ${
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

      {/* Guidelines Section */}
      <section className="section-padding bg-gradient-to-r from-primary-50 to-blue-50 border-b border-primary-100">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 border-t-4 border-primary-600">
              <h2 className="text-3xl font-extrabold text-primary-800 mb-8 flex items-center gap-3">
                <FileText className="text-primary-600" size={32} />
                Submission Guidelines
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Dates</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <Calendar size={18} className="mr-2 text-primary-600" />
                      Abstract Submission Deadline: <strong>September 15, 2025</strong>
                    </li>
                    <li className="flex items-center">
                      <Calendar size={18} className="mr-2 text-primary-600" />
                      Notification of Acceptance: <strong>September 25, 2025</strong>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle size={18} className="mr-2 text-green-600" />
                      Maximum 300 words (background, methods, findings, conclusion; excluding references)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={18} className="mr-2 text-green-600" />
                      File formats: PDF, DOC, DOCX only
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={18} className="mr-2 text-green-600" />
                      Maximum file size: 2MB
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-4">
                <AlertCircle className="text-blue-600 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-blue-900">Review Process</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    All abstracts will be reviewed by the scientific committee. Authors will be notified of acceptance and presentation format by email.
                  </p>
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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-primary-600">
              {/* Basic Information */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-2">
                  <FileText className="text-primary-600" size={24} /> Abstract Information
                </h3>
                <div className="grid gap-8">
                  <div>
                    <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-2">
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
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="presentationType" className="block text-base font-semibold text-gray-700 mb-2">
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
                      <label htmlFor="category" className="block text-base font-semibold text-gray-700 mb-2">
                        Conference Track *
                        <span className="text-xs text-gray-500 block font-normal">
                          Choose the most relevant track
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
                        <option value="">Select a track</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Subcategory (Topic) selection */}
                  {formData.category && trackTopics[formData.category] && (
                    <div className="mt-6">
                      <label htmlFor="subcategory" className="block text-base font-semibold text-gray-700 mb-2">
                        Topic (Subcategory) *
                        <span className="text-xs text-gray-500 block font-normal">
                          Select the most relevant topic for your abstract
                        </span>
                      </label>
                      <select
                        id="subcategory"
                        name="subcategory"
                        required
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a topic</option>
                        {trackTopics[formData.category].map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              {/* Primary Author Information */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-2">
                  <Users className="text-primary-600" size={24} /> Primary Author Information
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="primaryAuthor.firstName" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.lastName" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.email" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.phone" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.affiliation" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.position" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="primaryAuthor.district" className="block text-base font-semibold text-gray-700 mb-2">
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
              <div className="mb-10">
                <label htmlFor="coAuthors" className="block text-base font-semibold text-gray-700 mb-2">
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
                <div className="mb-10">
                  <label htmlFor="crossCuttingThemes" className="block text-base font-semibold text-gray-700 mb-2">
                    Cross-cutting Theme Option *
                    <span className="text-xs text-gray-500 block font-normal">
                      Select the most relevant cross-cutting theme for your abstract
                    </span>
                  </label>
                  <select
                    id="crossCuttingThemes"
                    name="crossCuttingThemes"
                    required
                    value={formData.crossCuttingThemes || ''}
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
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-2">
                  <FileText className="text-primary-600" size={24} /> Abstract Content
                </h3>
                <div className="space-y-8">
                  <div>
                    <label htmlFor="abstract" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="keywords" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="background" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="methods" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="findings" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="conclusion" className="block text-base font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="implications" className="block text-base font-semibold text-gray-700 mb-2">
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
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-2">
                  <Upload className="text-primary-600" size={24} /> Document Upload
                </h3>
                <div className="border-2 border-dashed border-primary-200 rounded-lg p-8 bg-primary-50/30">
                  <div className="text-center">
                    <label htmlFor="abstractFile" className="cursor-pointer">
                      <span className="text-lg font-semibold text-gray-900">Upload Abstract Document</span>
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
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-2">
                  <AlertCircle className="text-primary-600" size={24} /> Declarations
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="conflictOfInterest"
                      name="conflictOfInterest"
                      checked={formData.conflictOfInterest}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="conflictOfInterest" className="ml-3 text-base text-gray-700">
                      <span className="font-semibold">Conflict of Interest:</span> I declare that there are no conflicts of interest related to this research.
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
                    <label htmlFor="ethicalApproval" className="ml-3 text-base text-gray-700">
                      <span className="font-semibold">Ethical Approval:</span> This research has obtained necessary ethical approvals (where applicable).
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
                    <label htmlFor="consentToPublish" className="ml-3 text-base text-gray-700">
                      <span className="font-semibold">Consent to Publish:</span> I consent to the publication of this abstract in conference proceedings and related materials. *
                    </label>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="text-center mt-8">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg min-h-[56px] border border-primary-600 hover:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
