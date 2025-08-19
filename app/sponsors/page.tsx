'use client'

import React, { useState } from 'react'
import { Check, Building, Users, Award, Trophy, Star, CreditCard, ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react'
import InlinePayment from '../../components/InlinePayment'

interface SponsorshipPackage {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  specialRequirements: string;
}

export default function SponsorshipPage() {
  const [selectedPackage, setSelectedPackage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    sponsorshipId?: string;
  } | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    specialRequirements: ''
  })

  // Payment state for inline payment modal
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    currency: string;
    email: string;
    name: string;
    phone: string;
    description: string;
    reference: string;
  } | null>(null)

  // Payment handlers
  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response);
    
    try {
      // Get stored form data
      const storedData = localStorage.getItem('sponsorshipFormData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Submit sponsorship application after successful payment
        const applicationResponse = await fetch('/api/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...parsedData,
            paymentReference: response.tx_ref,
            paymentStatus: 'completed',
            transactionId: response.transaction_id
          }),
        });

        if (applicationResponse.ok) {
          localStorage.removeItem('sponsorshipFormData');
          setShowPayment(false);
          setSubmitResult({
            type: 'success',
            title: 'Sponsorship Application Successful!',
            message: `Thank you for your sponsorship! Your application has been submitted and payment processed. Reference: ${response.tx_ref}`,
            sponsorshipId: response.tx_ref
          });
        } else {
          throw new Error('Failed to submit sponsorship application');
        }
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      setShowPayment(false);
      setSubmitResult({
        type: 'error',
        title: 'Application Submission Failed',
        message: 'Payment was successful, but we encountered an error submitting your application. Please contact support with your payment reference.'
      });
    }
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    setShowPayment(false);
    setSubmitResult({
      type: 'error',
      title: 'Payment Cancelled',
      message: 'Payment was cancelled. You can try again when ready.'
    });
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setShowPayment(false);
    setSubmitResult({
      type: 'error',
      title: 'Payment Failed',
      message: 'There was an error processing your payment. Please try again or contact support.'
    });
  };

  const sponsorshipPackages: SponsorshipPackage[] = [
    {
      id: 'bronze',
      name: 'Bronze Sponsor',
      price: '$2,000',
      description: 'Perfect for organizations wanting basic brand visibility',
      icon: <Building className="h-8 w-8" />,
      features: [
        'Logo on conference website',
        'Logo on conference materials',
        'Mention in social media campaigns',
        '2 complimentary registrations',
        'Digital conference proceedings'
      ]
    },
    {
      id: 'silver',
      name: 'Silver Sponsor',
      price: '$5,000',
      description: 'Enhanced visibility with exhibition opportunities',
      icon: <Award className="h-8 w-8" />,
      features: [
        'All Bronze benefits',
        'Logo on conference banners',
        'Exhibition booth space (3x3m)',
        '4 complimentary registrations',
        'Promotional materials in welcome bags',
        'Coffee break sponsorship opportunity'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Sponsor',
      price: '$10,000',
      description: 'Premium positioning with speaking opportunities',
      icon: <Trophy className="h-8 w-8" />,
      features: [
        'All Silver benefits',
        'Speaking opportunity (5 minutes)',
        'Premium booth location (4x4m)',
        '6 complimentary registrations',
        'Logo on lanyards and badges',
        'Dedicated session sponsorship',
        'VIP networking event invitation'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum Sponsor',
      price: '$20,000',
      description: 'Exclusive branding and keynote opportunities',
      icon: <Star className="h-8 w-8" />,
      features: [
        'All Gold benefits',
        'Keynote speaking slot (15 minutes)',
        'Branded coffee break or lunch',
        '10 complimentary registrations',
        'Co-branding on conference signage',
        'Premium exhibition space (5x5m)',
        'Conference app banner placement',
        'Exclusive networking reception'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond Sponsor',
      price: '$50,000',
      description: 'Ultimate partnership with maximum exposure',
      icon: <Star className="h-8 w-8" />,
      features: [
        'All Platinum benefits',
        'Conference title sponsorship option',
        'Exclusive networking reception hosting',
        'Conference app full branding',
        '15 complimentary registrations',
        'Custom sponsorship opportunities',
        'Year-round partnership benefits',
        'Media interview opportunities',
        'Post-conference report inclusion'
      ]
    }
  ]

  const industries = [
    'Healthcare',
    'Pharmaceuticals',
    'Medical Technology',
    'Research Institution',
    'Government',
    'NGO/Non-Profit',
    'Technology',
    'Financial Services',
    'Education',
    'Other'
  ]

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    setFormData({...formData})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPackage) {
      setSubmitResult({
        type: 'error',
        title: 'Package Selection Required',
        message: 'Please select a sponsorship package before submitting your application.'
      })
      return
    }

    // Validate required fields
    if (!formData.companyName || !formData.contactPerson || !formData.email) {
      setSubmitResult({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please fill in all required fields: Company Name, Contact Person, and Email.'
      })
      return
    }

    if (!validateEmail(formData.email)) {
      setSubmitResult({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create payment reference and set up inline payment
      const selectedPkg = sponsorshipPackages.find(pkg => pkg.id === selectedPackage);
      if (!selectedPkg) {
        throw new Error('Selected package not found');
      }

      // Generate unique payment reference
      const reference = `sponsor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Extract amount from price string (remove $ and commas)
      const amount = parseFloat(selectedPkg.price.replace(/[$,]/g, ''));
      
      // Store form data for after payment
      localStorage.setItem('sponsorshipFormData', JSON.stringify({
        ...formData,
        packageType: selectedPackage,
        paymentReference: reference
      }));

      // Set up payment data for inline payment
      setPaymentData({
        amount: amount,
        currency: 'USD',
        email: formData.email,
        name: formData.companyName,
        phone: formData.phone || '',
        description: `${selectedPkg.name} - ${formData.companyName}`,
        reference: reference
      });

      // Show inline payment modal
      setShowPayment(true);
      
    } catch (error) {
      console.error('Error setting up payment:', error)
      setSubmitResult({
        type: 'error',
        title: 'Setup Error',
        message: 'Unable to set up payment. Please try again or contact support.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          {submitResult.type === 'success' ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          ) : (
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          )}
          <h2 className={`text-2xl font-bold mb-4 ${
            submitResult.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {submitResult.title}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {submitResult.message}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setSubmitResult(null)}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit Another Application
            </button>
            <a
              href="/"
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg text-center">
              Sponsor NACNDC & JASHConference 2025
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Partner with Uganda's premier health conference and showcase your commitment to 
              combating communicable and non-communicable diseases. Reach leading healthcare 
              professionals, researchers, and policymakers.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Sponsorship Package
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Select the package that best aligns with your marketing objectives and budget. 
                All packages include valuable networking opportunities and brand exposure.
              </p>
              {!selectedPackage && (
                <p className="text-red-600 mt-4 font-medium">
                  ⚠️ Please select a sponsorship package below to continue
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {sponsorshipPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-xl relative ${
                    selectedPackage === pkg.id 
                      ? 'border-primary-500 bg-primary-50 shadow-xl ring-2 ring-primary-500/30' 
                      : 'border-gray-200 hover:border-primary-300'
                  } ${pkg.highlighted ? 'lg:scale-105 lg:z-10' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      selectedPackage === pkg.id ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {pkg.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-primary-600">{pkg.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                  </div>

                  <div className="mb-6">
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      selectedPackage === pkg.id
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedPackage === pkg.id && (
                        <Check className="text-white" size={14} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sponsorship Application
              </h2>
              <p className="text-lg text-gray-600">
                Complete the form below to apply for your selected sponsorship package.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Full Name"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+256 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://www.company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements or Custom Opportunities
                  </label>
                  <textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe any specific requirements, custom branding opportunities, or questions you may have..."
                  />
                </div>

                {selectedPackage && (
                  <div className="bg-primary-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                      Selected Package: {sponsorshipPackages.find(p => p.id === selectedPackage)?.name}
                    </h3>
                    <p className="text-primary-700 text-sm">
                      After submitting this application, you will complete the payment process right here.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedPackage}
                    className={`relative flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-xl transition-all duration-300 transform min-h-[56px] border text-lg ${
                      isSubmitting || !selectedPackage
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                        : 'bg-uganda-yellow hover:bg-yellow-500 text-uganda-black border-uganda-yellow hover:border-yellow-500 hover:scale-105 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-uganda-black"></div>
                        <span className="relative z-10">Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 relative z-10" />
                        <span className="relative z-10">Submit Application & Pay</span>
                        <ArrowRight className="h-5 w-5 relative z-10" />
                      </>
                    )}
                    {!isSubmitting && !(!selectedPackage) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 mb-3">
                    Secure payment processing with multiple payment options
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <CreditCard size={14} />
                      <span>Visa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard size={14} />
                      <span>Mastercard</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard size={14} />
                      <span>Mobile Money</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Sponsor NACNDC & JASHConference 2025?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reach Key Stakeholders
                </h3>
                <p className="text-gray-600">
                  Connect with 1000+ healthcare professionals, researchers, policymakers, and industry leaders from across Uganda and East Africa.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Brand Visibility
                </h3>
                <p className="text-gray-600">
                  Enhance your brand presence through strategic placement across digital and physical conference touchpoints.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Thought Leadership
                </h3>
                <p className="text-gray-600">
                  Position your organization as a thought leader in healthcare innovation and disease prevention initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Payment Modal */}
      {showPayment && paymentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Sponsorship for: <strong>{paymentData.name}</strong></p>
                <p className="text-gray-600 mb-4">Amount: <strong>{paymentData.currency} {paymentData.amount}</strong></p>
                <p className="text-sm text-gray-500 mb-4">Click below to complete your sponsorship payment using your card or mobile money.</p>
              </div>
              
              <InlinePayment
                amount={paymentData.amount}
                currency={paymentData.currency}
                email={paymentData.email}
                name={paymentData.name}
                phone={paymentData.phone}
                description={paymentData.description}
                reference={paymentData.reference}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                onError={handlePaymentError}
              />
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Secure payment powered by Flutterwave</p>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* Manual Payment Instructions Section */}
    <section className="section-padding bg-yellow-50">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
              <span className="mr-2">💳</span> Manual Payment Instructions
            </h2>
            <p className="mb-4 text-gray-700">Please make your payment using the following bank details. After payment, email your proof of payment to <b>conference@health.go.ug</b> with your full name and sponsorship details.</p>
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
  </div>
)
}
