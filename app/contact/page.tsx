'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { useToast, ToastContainer } from '../../components/Toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, removeToast, showSuccess, showError } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Use the new database manager for API call
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess('Thank you for your message! We will get back to you within 24 hours.', 6000)
        setFormData({
          name: '',
          email: '',
          organization: '',
          subject: '',
          message: ''
        })
      } else {
        showError(result.message || 'Failed to submit your message. Please try again.', 6000)
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
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
              Contact Us
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Have questions about the conference? Need more information? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-2">Ministry of Health Uganda</p>
                    <a href="mailto:info@health.go.ug" className="text-primary-600 hover:text-primary-700">
                      info@health.go.ug
                    </a>
                    <p className="text-gray-600 mt-2">General inquiries</p>
                    <a href="mailto:info@health.go.ug" className="text-primary-600 hover:text-primary-700">
                      info@health.go.ug
                    </a>
                    <p className="text-gray-600 mt-2">Partnership opportunities</p>
                    <a href="mailto:info@health.go.ug" className="text-primary-600 hover:text-primary-700">
                      info@health.go.ug
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-2">MOH Call Centre</p>
                    <a href="tel:+256800200200" className="text-primary-600 hover:text-primary-700">
                      +256 800 200 200
                    </a>
                    <p className="text-gray-600 mt-2">Conference Support</p>
                    <a href="tel:+256414340874" className="text-primary-600 hover:text-primary-700">
                      +256 414 340 874
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Venue & Office</h3>
                    <p className="text-gray-600 mb-3">
                      <strong>Conference Venue:</strong><br />
                      Speke Resort Munyonyo<br />
                      Munyonyo, Kampala, Uganda
                    </p>
                    <p className="text-gray-600">
                      <strong>Ministry of Health:</strong><br />
                      Plot 6, Lourdel Road<br />
                      Nakasero, Kampala, Uganda
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (EAT)<br />
                      Saturday: 10:00 AM - 2:00 PM (EAT)<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/MinistryofHealthUganda" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span className="text-sm font-bold">f</span>
                  </a>
                  <a href="https://twitter.com/MinofHealthUG" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span className="text-sm font-bold">t</span>
                  </a>
                  <a href="https://www.linkedin.com/company/ministry-of-health-uganda/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span className="text-sm font-bold">in</span>
                  </a>
                  <a href="mailto:info@health.go.ug" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span className="text-sm font-bold">@</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Your full name"
                      />
                    </div>
                    
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
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="speaker">Speaker Application</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="media">Media Inquiry</option>
                      <option value="registration">Registration Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">Located at the prestigious Speke Resort Munyonyo, Kampala</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 text-primary-600" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Speke Resort Munyonyo</h3>
                <p className="text-gray-600">Interactive map would be embedded here</p>
                <a 
                  href="https://maps.google.com/?q=Speke+Resort+Munyonyo+Kampala" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
