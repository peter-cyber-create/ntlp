'use client'

import React, { useState } from 'react'
import { Check, Users, Award, Calendar, CreditCard } from 'lucide-react'
import { useToast, ToastContainer } from '../../components/Toast'

export default function RegisterPage() {
  const [selectedTicket, setSelectedTicket] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    district: '',
    registrationType: 'regular' as 'early-bird' | 'regular' | 'student',
    specialRequirements: ''
  })

  const ticketTypes = [
    {
      id: 'undergrad',
      name: 'Undergraduate Student',
      price: 'UGX 100,000',
      description: 'For undergraduate students (ID required)',
      features: [
        'All 3 days access',
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
        'All 3 days access',
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
        'All 3 days access',
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
        'All 3 days access',
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
      registrationType: ticketId as 'early-bird' | 'regular' | 'student'
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
    console.log('Form submitted!', { formData, selectedTicket })
    
    // Check if ticket is selected
    if (!selectedTicket) {
      showWarning('Please select a ticket type before submitting.')
      return
    }

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'organization', 'position', 'district']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (emptyFields.length > 0) {
      showError(`Please fill in all required fields: ${emptyFields.join(', ')}`)
      return
    }

    // Validate field formats
    if (!validateName(formData.firstName)) {
      showError('First name must contain only letters and be at least 2 characters long')
      return
    }

    if (!validateName(formData.lastName)) {
      showError('Last name must contain only letters and be at least 2 characters long')
      return
    }

    if (!validateEmail(formData.email)) {
      showError('Please enter a valid email address')
      return
    }

    if (!validatePhone(formData.phone)) {
      showError('Please enter a valid Uganda phone number (e.g., +256701234567 or 0701234567)')
      return
    }

    if (formData.organization.trim().length < 3) {
      showError('Organization name must be at least 3 characters long')
      return
    }

    if (formData.position.trim().length < 3) {
      showError('Position/title must be at least 3 characters long')
      return
    }

    setIsSubmitting(true)
    console.log('Sending registration data:', { ...formData, registrationType: selectedTicket })
    
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

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)

      if (result.success) {
        showSuccess('Registration submitted successfully! You will receive a confirmation email shortly.', 8000)
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          district: '',
          registrationType: 'regular',
          specialRequirements: ''
        })
        setSelectedTicket('')
      } else {
        showError(result.message || 'Registration failed. Please try again.', 6000)
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      showError('Network error. Please check your connection and try again.', 6000)
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Register Now
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Be part of Uganda's most important health conference. 
              Register today to join discussions on the future of health in our country.
            </p>
          </div>
        </div>
      </section>

      {/* Ticket Selection */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Registration</h2>
              <p className="text-xl text-gray-600">Choose the option that works best for you</p>
              {!selectedTicket && (
                <p className="text-red-600 mt-2 font-medium">⚠️ Please select a ticket type below to continue</p>
              )}
              {selectedTicket && (
                <p className="text-green-600 mt-2 font-medium">✅ {ticketTypes.find(t => t.id === selectedTicket)?.name} ticket selected</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 focus-within:scale-105 focus-within:ring-2 focus-within:ring-primary-400 ${selectedTicket === ticket.id ? 'ring-4 ring-primary-500 scale-105' : 'hover:shadow-xl'}`}
                  onClick={() => handleTicketSelect(ticket.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={ticket.name}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold text-primary-600">{ticket.price}</span>
                      {/* No originalPrice for new ticket types */}
                    </div>
                    <p className="text-gray-600">{ticket.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                      selectedTicket === ticket.id
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedTicket === ticket.id && (
                        <Check className="text-white" size={16} />
                      )}
                    </div>
                    {/* No deadline for new ticket types */}
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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-200 hover:scale-105 active:scale-95 focus-within:scale-105 focus-within:ring-2 focus-within:ring-primary-400 focus:outline-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration Details</h2>
              
              {!selectedTicket && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    ⚠️ Please select a ticket type above before filling out this form.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    showWarning('Please select a ticket type first!')
                    return
                  }
                }}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200"
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
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
