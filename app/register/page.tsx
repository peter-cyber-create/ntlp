// Fixed top of file: imports, function, ticketTypes
'use client';

import { useState } from 'react';
import { ChevronDown, User, Mail, Phone, Globe, MapPin, Calendar, ChevronRight, X, Check, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
// import InlinePayment from '../../components/InlinePayment';

export default function RegisterPage() {
  const [selectedTicket, setSelectedTicket] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [showPayment, setShowPayment] = useState(false)
  // const [paymentData, setPaymentData] = useState<any>(null)
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
    // ... add other ticket types as needed ...
  ];


  // Only letters, spaces, hyphens, and apostrophes allowed
  function validateName(name: string) {
    const nameRegex = /^[a-zA-Z\s\-']+$/
    return nameRegex.test(name) && name.trim().length >= 2
  }

  function validateEmail(email: string) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validatePhone(phone: string) {
    // Accepts +2567... or 07...
    return /^((\+256|0)7\d{8})$/.test(phone)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
    
    // Payment logic commented out for manual payment
    setSubmitResult({
      type: 'success',
      title: 'Registration Submitted!',
      message: 'Your registration has been received. Please make your payment using the bank details below and email your proof of payment to conference@musph.ac.ug.'
    })
    setIsSubmitting(false)
  }


  // Payment handlers commented out for manual payment

  return (
    <>


      {/* Ticket Selection Section */}
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
                  onClick={() => setSelectedTicket(ticket.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={ticket.name}
                >
                  <div className="text-center mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">{ticket.name}</h3>
                    <div className="mb-3">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600">{ticket.price}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{ticket.description}</p>
                  </div>
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

      {/* Registration Form Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400 focus:outline-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration Details</h2>
              {/* ...existing form fields and logic... */}
              {/* Copy the form fields from your previous code here, as they are already correct. */}
              {/* ...existing code... */}
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
            </form>
          </div>
        </div>
      </section>
      {/* Manual Payment Instructions Section */}
      <section className="section-padding bg-yellow-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-300">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <span className="mr-2">💳</span> Manual Payment Instructions
              </h2>
              <p className="mb-4 text-gray-700">Please make your payment using the following bank details. After payment, email your proof of payment to <b>conference@health.go.ug</b> with your full name and registration details.</p>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">UGX Account (Local Payments)</h3>
                <ul className="text-gray-700 text-base ml-4">
                  <li><b>Beneficiary Customer:</b> MUSPH RESEARCH ACCOUNT</li>
                  <li><b>Beneficiary Customer Account Number:</b> 9030008175062</li>
                  <li><b>Name of local Bank:</b> Stanbic Bank Uganda Limited</li>
                  <li><b>Address:</b> P.O BOX 7131 Kampala</li>
                  <li><b>Swift Code:</b> SBICUGKX</li>
                  <li><b>IBAN:</b> Not applicable</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Corresponding US Bank Information</h3>
                <ul className="text-gray-700 text-base ml-4">
                  <li><b>Name of intermediary Financial Institution in US:</b> Citibank New York</li>
                  <li><b>Address:</b> New York, NY</li>
                  <li><b>USD Account number:</b> 36110279</li>
                  <li><b>SWIFT CODE:</b> CITIUS33</li>
                  <li><b>ABA Number:</b> 021000089</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
