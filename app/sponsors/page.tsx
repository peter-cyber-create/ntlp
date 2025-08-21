"use client";

import { useState } from "react";
import { User, Mail, Phone, X, Check, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  specialRequirements: string;
  selectedPackage: string;
  message: string;
}

const sponsorshipLevels = [
  {
    id: "platinum",
    name: "Platinum Sponsor",
    amount: "UGX 10,000,000+",
    benefits: [
      "Prime logo placement",
      "Speaking opportunity",
      "Exhibition booth",
      "Full conference access for 5 reps",
      "Custom branding opportunities",
    ],
  },
  {
    id: "gold",
    name: "Gold Sponsor",
    amount: "UGX 5,000,000+",
    benefits: [
      "Logo placement",
      "Exhibition booth",
      "Full conference access for 3 reps",
      "Branding opportunities",
    ],
  },
  {
    id: "silver",
    name: "Silver Sponsor",
    amount: "UGX 2,000,000+",
    benefits: [
      "Logo placement",
      "Full conference access for 2 reps",
    ],
  },
  {
    id: "bronze",
    name: "Bronze Sponsor",
    amount: "UGX 1,000,000+",
    benefits: [
      "Logo placement",
      "Full conference access for 1 rep",
    ],
  },
];

export default function SponsorsPage() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    specialRequirements: "",
    selectedPackage: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedPackage) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    const payload = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      industry: formData.industry,
      specialRequirements: formData.specialRequirements,
      selectedPackage: formData.selectedPackage,
      packageType: formData.selectedPackage, // for legacy/compatibility
      message: formData.message
    };
    try {
      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSubmitResult({
          type: "success",
          title: "Sponsorship Request Sent!",
          message:
            "Thank you for your interest in sponsoring. Our team will contact you soon.",
        });
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          website: "",
          industry: "",
          specialRequirements: "",
          selectedPackage: "",
          message: "",
        });
      } else {
        const result = await response.json().catch(() => ({}));
        setSubmitResult({
          type: "error",
          title: "Submission Failed",
          message: result?.error || "Sponsorship request could not be completed. Please try again.",
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
                  <X size={22} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {submitResult.message}
                </p>
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
      {/* Sponsorship Levels Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <User className="h-10 w-10 text-primary-600 bg-primary-100 rounded-full p-2 shadow" />
              </div>
              <h2 className="text-4xl font-extrabold text-primary-800 mb-2 tracking-tight">Become a Sponsor</h2>
              <p className="text-lg text-primary-700">Select your sponsorship level</p>
              {!selectedLevel && (
                <p className="text-red-600 mt-2 font-medium text-base">⚠️ Please select a sponsorship level below to continue</p>
              )}
              {selectedLevel && (
                <p className="text-green-600 mt-2 font-medium text-base">✅ {sponsorshipLevels.find(l => l.id === selectedLevel)?.name} selected</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {sponsorshipLevels.map((level) => (
                <div
                  key={level.id}
                  className={`bg-white rounded-2xl shadow-xl border-2 p-8 cursor-pointer transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] ${
                    selectedLevel === level.id 
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600/30' 
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedLevel(level.id);
                    setFormData({ ...formData, selectedPackage: level.name });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={level.name}
                >
                  <div className="text-center mb-5">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{level.name}</h3>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-primary-600">{level.amount}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {level.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-base text-gray-700 leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center pt-3 border-t border-gray-200">
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                      selectedLevel === level.id
                        ? 'bg-primary-600 border-primary-600 shadow-lg'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}>
                      {selectedLevel === level.id && (
                        <Check className="text-white" size={16} />
                      )}
                    </div>
                    <p className={`text-sm mt-2 font-medium ${
                      selectedLevel === level.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {selectedLevel === level.id ? 'Selected' : 'Select this option'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Sponsorship Form Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-primary-600 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400 focus:outline-none">
              <h2 className="text-3xl font-bold text-primary-800 mb-10">Sponsorship Request</h2>
              {!selectedLevel && (
                <p className="text-red-600 mb-6 font-medium text-base">⚠️ Please select a sponsorship level above before filling out this form.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label htmlFor="companyName" className="block text-base font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-base font-semibold text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
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
                  <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-2">
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
                <div>
                  <label htmlFor="website" className="block text-base font-semibold text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-base font-semibold text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="specialRequirements" className="block text-base font-semibold text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <input
                    type="text"
                    id="specialRequirements"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Let us know any specific requests or questions"
                  />
                </div>
              </div>
              {/* Submit Button - below form fields */}
              <div className="md:col-span-2 flex flex-col items-center mt-10">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg min-h-[56px] border border-primary-600 hover:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  disabled={isSubmitting || !selectedLevel}
                >
                  <span className="text-lg">🤝</span>
                  <span className="relative z-10">{isSubmitting ? 'Submitting Request...' : 'Submit Sponsorship Request'}</span>
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  By submitting this form, you agree to the conference sponsorship terms.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Need payment details? <a href="/payment-instructions" className="text-primary-600 underline hover:text-primary-800">See payment instructions</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
