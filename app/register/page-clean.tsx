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
      id: 'early-bird',
      name: 'Early Bird',
      price: 'UGX 250,000',
      originalPrice: 'UGX 350,000',
      description: 'Limited time offer - Save UGX 100,000',
      features: [
        'All 5 days access',
        'Welcome reception',
        'Networking lunch',
        'Conference materials',
        'Certificate of attendance'
      ],
      deadline: 'January 31, 2025'
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 'UGX 350,000',
      description: 'Standard conference registration',
      features: [
        'All 5 days access',
        'Welcome reception',
        'Networking lunch',
        'Conference materials',
        'Certificate of attendance'
      ],
      deadline: 'November 1st, 2025'
    },
    {
      id: 'student',
      name: 'Student',
      price: 'UGX 100,000',
      description: 'Special rate for students (ID required)',
      features: [
        'All 5 days access',
        'Conference materials',
        'Certificate of attendance',
        'Student networking session'
      ],
      deadline: 'November 1st, 2025'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTicket) {
      showWarning('Please select a ticket type before submitting.')
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
              Secure your spot at The Communicable and Non-Communicable Diseases Conference. 
              Join Uganda's health leaders in addressing critical health challenges.
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
              <p className="text-xl text-gray-600">Select the registration type that best fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
                    selectedTicket === ticket.id
                      ? 'ring-4 ring-primary-500 transform scale-105'
                      : 'hover:shadow-xl hover:transform hover:scale-105'
                  }`}
                  onClick={() => handleTicketSelect(ticket.id)}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold text-primary-600">{ticket.price}</span>
                      {ticket.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">{ticket.originalPrice}</span>
                      )}
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
                    <p className="text-sm text-gray-500 mt-2">Registration deadline: {ticket.deadline}</p>
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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Title *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                  District *
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
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
