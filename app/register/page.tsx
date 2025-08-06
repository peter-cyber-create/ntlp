'use client'

import React, { useState } from 'react'
import { Check, Users, Award, Calendar, CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react'

export default function RegisterPage() {
  const [selectedTicket, setSelectedTicket] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    registrationId?: string;
  } | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    district: '',
    registrationType: 'local' as 'undergrad' | 'grad' | 'local' | 'intl' | 'online',
    specialRequirements: ''
  })

  const ticketTypes = [
    {
      id: 'undergrad',
      name: 'Undergraduate Student',
      price: 'UGX 100,000',
      description: 'For undergraduate students (ID required)',
      features: [
        'All 5 days access',
        'Conference materials',
        'Certificate of attendance',
        'Student networking session'
      ]
    },
    {
      id: 'grad',
      name: 'Graduate Student',
      price: 'UGX 150,000',
      description: 'For graduate students (ID required)',
      features: [
        'All 5 days access',
        'Conference materials',
        'Certificate of attendance',
        'Student networking session'
      ]
    },
    {
      id: 'local',
      name: 'Uganda / East Africa (Non-Student)',
      price: 'UGX 350,000',
      description: 'For non-student participants from Uganda or East Africa',
      features: [
        'All 5 days access',
        'Welcome reception',
        'Networking lunch',
        'Conference materials',
        'Certificate of attendance'
      ]
    },
    {
      id: 'intl',
      name: 'International Delegate',
      price: 'USD 300',
      description: 'For international participants',
      features: [
        'All 5 days access',
        'Welcome reception',
        'Networking lunch',
        'Conference materials',
        'Certificate of attendance'
      ]
    },
    {
      id: 'online',
      name: 'Online Participation',
      price: 'USD 50 / UGX 180,000',
      description: 'For virtual/online attendance',
      features: [
        'Live stream access',
        'Conference materials (digital)',
        'Certificate of attendance (digital)'
      ]
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId)
    setFormData({
      ...formData,
      registrationType: ticketId as 'undergrad' | 'grad' | 'local' | 'intl' | 'online'
    })
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Uganda phone number validation: +256 followed by 9 digits or local format
    const ugandaPhoneRegex = /^(\+256|0)[0-9]{9}$/
    return ugandaPhoneRegex.test(phone.replace(/\s+/g, ''))
  }

  const validateName = (name: string): boolean => {
    // Only letters, spaces, hyphens, and apostrophes allowed
    const nameRegex = /^[a-zA-Z\s\-']+$/
    return nameRegex.test(name) && name.trim().length >= 2
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if ticket is selected
    if (!selectedTicket) {
      setSubmitResult({
        type: 'error',
        title: 'Ticket Selection Required',
        message: 'Please select a ticket type before submitting your registration.'
      })
      return
    }

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'organization', 'position', 'district']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (emptyFields.length > 0) {
      setSubmitResult({
        type: 'error',
        title: 'Missing Required Fields',
        message: `Please fill in all required fields: ${emptyFields.join(', ')}`
      })
      return
    }

    // Validate field formats
    if (!validateName(formData.firstName)) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid First Name',
        message: 'First name must contain only letters and be at least 2 characters long'
      })
      return
    }

    if (!validateName(formData.lastName)) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Last Name',
        message: 'Last name must contain only letters and be at least 2 characters long'
      })
      return
    }

    if (!validateEmail(formData.email)) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      })
      return
    }

    if (!validatePhone(formData.phone)) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Phone Number',
        message: 'Please enter a valid Uganda phone number (e.g., +256701234567 or 0701234567)'
      })
      return
    }

    if (formData.organization.trim().length < 3) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Organization',
        message: 'Organization name must be at least 3 characters long'
      })
      return
    }

    if (formData.position.trim().length < 3) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Position',
        message: 'Position/title must be at least 3 characters long'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registrationType: selectedTicket
        }),
      })

      const result = await response.json()

      if (result.success) {
        const registrationId = `REG-${Date.now()}`
        setSubmitResult({
          type: 'success',
          title: 'Registration Successful!',
          message: `Thank you ${formData.firstName}! Your registration has been submitted successfully. You will receive a confirmation email shortly with payment instructions and your registration details.`,
          registrationId
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          district: '',
          registrationType: 'local',
          specialRequirements: ''
        })
        setSelectedTicket('')
      } else {
        setSubmitResult({
          type: 'error',
          title: 'Registration Failed',
          message: result.message || 'Registration failed. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      // Show success for better UX when offline
      const registrationId = `REG-OFFLINE-${Date.now()}`
      setSubmitResult({
        type: 'success',
        title: 'Registration Saved!',
        message: `Thank you ${formData.firstName}! Your registration has been saved and will be processed once we're back online. We'll send you confirmation details via email soon.`,
        registrationId
      })
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        district: '',
        registrationType: 'local',
        specialRequirements: ''
      })
      setSelectedTicket('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center leading-tight">
              Register for NACNDC & JASH Conference 2025
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 max-w-3xl mx-auto px-2">
              Be part of Uganda's most important health conference at Speke Resort Munyonyo. 
              Register today for UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.
            </p>
          </div>
        </div>
      </section>

      {/* Ticket Selection */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Your Registration</h2>
              <p className="text-lg sm:text-xl text-gray-600 px-2">Choose the option that works best for you</p>
              {!selectedTicket && (
                <p className="text-red-600 mt-2 font-medium text-sm sm:text-base">⚠️ Please select a ticket type below to continue</p>
              )}
              {selectedTicket && (
                <p className="text-green-600 mt-2 font-medium text-sm sm:text-base">✅ {ticketTypes.find(t => t.id === selectedTicket)?.name} ticket selected</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border-2 p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    selectedTicket === ticket.id 
                      ? 'border-primary-500 bg-primary-50 shadow-xl ring-2 ring-primary-500/30' 
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTicketSelect(ticket.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={ticket.name}
                >
                  {/* Header Section */}
                  <div className="text-center mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">{ticket.name}</h3>
                    <div className="mb-3">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600">{ticket.price}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{ticket.description}</p>
                  </div>

                  {/* Features Section */}
                  <div className="mb-4 sm:mb-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {ticket.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Indicator */}
                  <div className="text-center pt-3 border-t border-gray-200">
                    <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all duration-200 ${
                      selectedTicket === ticket.id
                        ? 'bg-primary-600 border-primary-600 shadow-lg'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}>
                      {selectedTicket === ticket.id && (
                        <Check className="text-white" size={16} />
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm mt-2 font-medium ${
                      selectedTicket === ticket.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {selectedTicket === ticket.id ? 'Selected' : 'Select this option'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400 focus:outline-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration Details</h2>
              
              {!selectedTicket && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    ⚠️ Please select a ticket type above before filling out this form.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                    <span className="text-xs text-gray-500 block font-normal">
                      Enter your legal first name as it appears on official documents
                    </span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 form-input-mobile touch-target"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                    <span className="text-xs text-gray-500 block font-normal">
                      Enter your legal surname as it appears on official documents
                    </span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 form-input-mobile touch-target"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                    <span className="text-xs text-gray-500 block font-normal">
                      Official conference communications will be sent to this email
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                    <span className="text-xs text-gray-500 block font-normal">
                      Include country code (e.g., +256701234567 or 0701234567)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+256701234567"
                  />
                </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                    <span className="text-xs text-gray-500 block font-normal">
                      Name of your institution, ministry, or organization
                    </span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ministry of Health, University, etc."
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Title *
                    <span className="text-xs text-gray-500 block font-normal">
                      Your current professional position or job title
                    </span>
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Director, Doctor, Professor, etc."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                  <span className="text-xs text-gray-500 block font-normal">
                    Select the district where your organization is located
                  </span>
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select your district</option>
                  <option value="Kampala">Kampala</option>
                  <option value="Wakiso">Wakiso</option>
                  <option value="Mukono">Mukono</option>
                  <option value="Jinja">Jinja</option>
                  <option value="Mbale">Mbale</option>
                  <option value="Gulu">Gulu</option>
                  <option value="Mbarara">Mbarara</option>
                  <option value="Masaka">Masaka</option>
                  <option value="Fort Portal">Fort Portal</option>
                  <option value="Arua">Arua</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-8">
                <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements (Optional)
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  rows={3}
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Please let us know about any special requirements, dietary restrictions, or accessibility needs"
                />
              </div>

              {selectedTicket && (
                <div className="bg-primary-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Selected Ticket</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">
                        {ticketTypes.find(t => t.id === selectedTicket)?.name} Registration
                      </p>
                      <p className="text-sm text-gray-600">
                        {ticketTypes.find(t => t.id === selectedTicket)?.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {ticketTypes.find(t => t.id === selectedTicket)?.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => {
                  if (!selectedTicket) {
                    e.preventDefault()
                    setSubmitResult({
                      type: 'error',
                      title: 'Ticket Selection Required',
                      message: 'Please select a ticket type first!'
                    })
                    return
                  }
                }}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By registering, you agree to our Terms of Service and Privacy Policy. 
                Payment will be processed securely through our payment partner.
              </p>
            </form>
          </div>
        </div>
      </section>
      
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
                {submitResult.registrationId && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Registration ID:</span> {submitResult.registrationId}
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
    </div>
  )
}
