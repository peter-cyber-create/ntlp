"use client";

import { useState } from "react";
import { User, Mail, Phone, X, Check, CheckCircle, AlertCircle } from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  district: string;
  specialRequirements: string;
  paymentProof?: File;
}

const ticketTypes: TicketType[] = [
  {
    id: "undergrad",
    name: "Undergraduate Student",
    price: "UGX 100,000",
    description: "For undergraduate students (ID required)",
    features: [
      "All 5 days access",
      "Conference materials",
      "Certificate of attendance",
      "Student networking session",
    ],
  },
  {
    id: "grad",
    name: "Graduate Student",
    price: "UGX 150,000",
    description: "For graduate students (ID required)",
    features: [
      "All 5 days access",
      "Conference materials",
      "Certificate of attendance",
      "Student networking session",
    ],
  },
  {
    id: "local",
    name: "Uganda / East Africa (Non-Student)",
    price: "UGX 350,000",
    description: "For non-student participants from Uganda or East Africa",
    features: [
      "All 5 days access",
      "Welcome reception",
      "Networking lunch",
      "Conference materials",
      "Certificate of attendance",
    ],
  },
  {
    id: "intl",
    name: "International Delegate",
    price: "USD 300",
    description: "For international participants",
    features: [
      "All 5 days access",
      "Welcome reception",
      "Networking lunch",
      "Conference materials",
      "Certificate of attendance",
    ],
  },
  {
    id: "online",
    name: "Online Participant",
    price: "UGX 50,000",
    description: "For virtual/remote attendance",
    features: [
      "Live streaming access",
      "Digital conference materials",
      "Certificate of attendance (digital)",
    ],
  },
];

export default function RegisterPage() {
  const [selectedTicket, setSelectedTicket] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    registrationId?: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    district: "",
    specialRequirements: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    
    // Check if payment proof is uploaded
    if (!formData.paymentProof) {
      setSubmitResult({
        type: "error",
        title: "Payment Proof Required",
        message: "Please upload proof of payment before submitting your registration.",
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // First, upload the payment proof file
      const formDataUpload = new FormData();
      formDataUpload.append('paymentProof', formData.paymentProof);
      formDataUpload.append('entityType', 'registration');
      formDataUpload.append('entityId', '0'); // Will be updated after registration
      formDataUpload.append('uploadedBy', formData.email);
      
      const uploadResponse = await fetch('/api/uploads/payment-proof', {
        method: 'POST',
        body: formDataUpload
      });
      
      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json().catch(() => ({}));
        throw new Error(uploadError.error || 'Failed to upload payment proof');
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Prepare registration payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        position: formData.position,
        district: formData.district,
        registrationType: selectedTicket,
        specialRequirements: formData.specialRequirements,
        dietary_requirements: "",
        paymentProofUrl: uploadResult.file.filePath
      };
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const result = await response.json().catch(() => ({} as any));
        const apiRegistrationId = (result && (result.data?.id || result.id)) || null;
        setSubmitResult({
          type: "success",
          title: "Registration Submitted Successfully!",
          message:
            "Your registration has been submitted and is now under review by our admin team. You will receive an email confirmation once your registration is approved.",
          registrationId: apiRegistrationId ? String(apiRegistrationId).toUpperCase() : undefined,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          organization: "",
          position: "",
          district: "",
          specialRequirements: "",
          paymentProof: undefined,
        });
        setSelectedTicket("");
      } else {
        const result = await response.json().catch(() => ({}));
        setSubmitResult({
          type: "error",
          title: "Registration Failed",
          message: result?.error || "Registration could not be completed. Please try again.",
        });
      }
    } catch (err) {
      setSubmitResult({
        type: "error",
        title: "Network Error",
        message: "Could not connect to the server. Please try again later.",
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-t-8 border-primary-600">
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {submitResult.type === "success" ? (
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
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {submitResult.message}
                </p>
                
                {submitResult.registrationId && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Registration ID:</p>
                    <p className="font-mono font-semibold text-gray-800">
                      {submitResult.registrationId}
                    </p>
                  </div>
                )}
                
                {submitResult.type === "success" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your registration is now under review</li>
                      <li>• Admin team will verify your payment proof</li>
                      <li>• You'll receive approval confirmation via email</li>
                      <li>• Payment verification typically takes 24-48 hours</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setSubmitResult(null)}
                  className={`px-5 py-2 rounded-lg font-semibold transition-colors shadow ${
                    submitResult.type === "success"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Ticket Selection Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <User className="h-10 w-10 text-primary-600 bg-primary-100 rounded-full p-2 shadow" />
              </div>
              <h2 className="text-4xl font-extrabold text-primary-800 mb-2 tracking-tight">Conference Registration</h2>
              <p className="text-lg text-primary-700">Select your ticket type to begin</p>
              {!selectedTicket && (
                <p className="text-red-600 mt-2 font-medium text-base">⚠️ Please select a ticket type below to continue</p>
              )}
              {selectedTicket && (
                <p className="text-green-600 mt-2 font-medium text-base">✅ {ticketTypes.find(t => t.id === selectedTicket)?.name} ticket selected</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl shadow-xl border-2 p-8 cursor-pointer transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] ${
                    selectedTicket === ticket.id 
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600/30' 
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={ticket.name}
                >
                  <div className="text-center mb-5">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{ticket.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-primary-600">{ticket.price}</span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">{ticket.description}</p>
                  </div>
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {ticket.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-base text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center pt-3 border-t border-gray-200">
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                      selectedTicket === ticket.id
                        ? 'bg-primary-600 border-primary-600 shadow-lg'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}>
                      {selectedTicket === ticket.id && (
                        <Check className="text-white" size={16} />
                      )}
                    </div>
                    <p className={`text-sm mt-2 font-medium ${
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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-primary-600 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400 focus:outline-none">
              <h2 className="text-3xl font-bold text-primary-800 mb-10">Registration Details</h2>
              {!selectedTicket && (
                <p className="text-red-600 mb-6 font-medium text-base">⚠️ Please select a ticket type above before filling out this form.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label htmlFor="firstName" className="block text-base font-semibold text-gray-700 mb-2">
                    First Name *
                    <span className="text-xs text-gray-500 block font-normal">Enter your legal first name as it appears on official documents</span>
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
                  <label htmlFor="lastName" className="block text-base font-semibold text-gray-700 mb-2">
                    Last Name *
                    <span className="text-xs text-gray-500 block font-normal">Enter your legal surname as it appears on official documents</span>
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
                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                    Email Address *
                    <span className="text-xs text-gray-500 block font-normal">Official conference communications will be sent to this email</span>
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
                  <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-2">
                    Phone Number *
                    <span className="text-xs text-gray-500 block font-normal">Include country code (e.g., +256701234567 or 0701234567)</span>
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
                <div>
                  <label htmlFor="organization" className="block text-base font-semibold text-gray-700 mb-2">
                    Organization *
                    <span className="text-xs text-gray-500 block font-normal">Name of your institution, ministry, or organization</span>
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
                  <label htmlFor="position" className="block text-base font-semibold text-gray-700 mb-2">
                    Position/Title *
                    <span className="text-xs text-gray-500 block font-normal">Your current professional position or job title</span>
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
                <div>
                  <label htmlFor="district" className="block text-base font-semibold text-gray-700 mb-2">
                    District *
                    <span className="text-xs text-gray-500 block font-normal">Select the district where your organization is located</span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="specialRequirements" className="block text-base font-semibold text-gray-700 mb-2">
                    Special Requirements (Optional)
                  </label>
                  <textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please specify any dietary, accessibility, or other requirements"
                  />
                </div>
              </div>
              
              {/* Payment Proof Upload Section */}
              <div className="md:col-span-2 mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-primary-400 transition-colors">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-primary-100 rounded-full">
                      <span className="text-2xl">💳</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Proof Required</h3>
                    <p className="text-gray-600 mb-4">
                      Please upload proof of payment before submitting your registration. 
                      Accepted formats: JPEG, PNG, GIF, PDF (max 5MB)
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <input
                          type="file"
                          id="paymentProof"
                          name="paymentProof"
                          accept=".jpg,.jpeg,.png,.gif,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('File size must be less than 5MB');
                                e.target.value = '';
                                return;
                              }
                              setFormData({ ...formData, paymentProof: file });
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="paymentProof"
                          className="cursor-pointer inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          <span className="mr-2">📁</span>
                          Choose Payment Proof File
                        </label>
                      </div>
                      
                      {formData.paymentProof && (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-green-600">✅</span>
                              <div>
                                <p className="font-medium text-gray-900">{formData.paymentProof.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(formData.paymentProof.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, paymentProof: undefined })}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="font-medium mb-2">Payment Instructions:</p>
                      <ul className="text-left space-y-1">
                        <li>• <strong>Bank Transfer:</strong> Send payment to the provided account</li>
                        <li>• <strong>Mobile Money:</strong> Use the provided number</li>
                        <li>• <strong>Cash Payment:</strong> Visit our office during business hours</li>
                        <li>• Upload the receipt, screenshot, or confirmation as proof</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button - moved below form fields */}
              <div className="md:col-span-2 flex flex-col items-center mt-10">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg min-h-[56px] border border-primary-600 hover:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  disabled={isSubmitting || !selectedTicket || !formData.paymentProof}
                >
                  <span className="text-lg">📝</span>
                  <span className="relative z-10">
                    {isSubmitting ? 'Submitting Registration...' : 
                     !formData.paymentProof ? 'Upload Payment Proof First' : 'Submit Registration'}
                  </span>
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  By submitting this form, you agree to the conference terms and conditions.
                </p>
                {/* Payment instructions removed. */}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
