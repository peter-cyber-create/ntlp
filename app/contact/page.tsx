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
    message: '',
    inquiryType: ''
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
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        showSuccess('Thank you for your message! We will get back to you within 24 hours.', 6000)
        setFormData({ name: '', email: '', organization: '', subject: '', message: '', inquiryType: '' })
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
    <div className="min-h-screen bg-primary-950 py-16 px-2 sm:px-0 text-white">
      <div className="flex justify-center mb-10">
        <div className="h-1 w-32 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-80" />
      </div>
      <div className="max-w-3xl mx-auto rounded-2xl shadow-lg bg-white p-8 sm:p-16 border border-primary-200 flex flex-col gap-10 transition-all duration-200 hover:scale-[1.01] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight text-primary-900 drop-shadow-lg text-center">Contact Us</h1>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Contact Info */}
          <div className="flex-1 flex flex-col gap-6 justify-center items-center bg-primary-50 border border-primary-200 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 text-primary-800"><Mail className="w-6 h-6" /> <span className="font-semibold">info@ntlp-conference.org</span></div>
            <div className="flex items-center gap-3 text-primary-800"><Phone className="w-6 h-6" /> <span className="font-semibold">+256 123 456 789</span></div>
            <div className="flex items-center gap-3 text-primary-800"><MapPin className="w-6 h-6" /> <span className="font-semibold">Kampala Serena Hotel, Uganda</span></div>
            <div className="flex items-center gap-3 text-primary-800"><Clock className="w-6 h-6" /> <span className="font-semibold">Mon-Fri: 8am - 5pm</span></div>
          </div>
          {/* Contact Form */}
          <form className="flex-1 flex flex-col gap-5 bg-white border border-primary-200 rounded-2xl p-6 shadow-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="inquiryType" className="font-semibold text-primary-800">Inquiry Type</label>
              <select id="inquiryType" name="inquiryType" value={formData.inquiryType || ''} onChange={handleChange} required className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400">
                <option value="">Select an option</option>
                <option value="general">General Inquiry</option>
                <option value="partnership">Partnership</option>
                <option value="media">Media</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-primary-900">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400" />
            </div>
            <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-primary-900">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400" />
            </div>
            <div className="flex flex-col gap-2">
            <label htmlFor="organization" className="font-semibold text-primary-900">Organization</label>
            <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400" />
            </div>
            <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="font-semibold text-primary-900">Subject</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400" />
            </div>
            <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-semibold text-primary-900">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className="rounded-lg px-4 py-2 bg-white border border-gray-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 hover:border-primary-400" />
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:from-primary-600 hover:to-primary-800 transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 justify-center">
              <Send className="w-5 h-5" /> {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>

    </div>
  )
}
