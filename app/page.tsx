import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Award, ArrowRight } from 'lucide-react'
import VideoBackground from '../components/VideoBackground'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <VideoBackground 
        className="min-h-screen flex items-center justify-center -mt-32 pt-32"
        fallbackImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-8">
              {/* Uganda Coat of Arms */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-3">
                  <img 
                    src="/images/uganda-coat-of-arms.png" 
                    alt="Uganda Coat of Arms" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-500/20 border border-primary-300/30 rounded-full text-primary-100 text-xs sm:text-sm font-medium">
                <span className="mr-2">🇺🇬</span>
                <span className="hidden sm:inline">Republic of Uganda • </span>
                <span>Ministry of Health</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              The Communicable and Non-Communicable Diseases Conference 2025
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-200 px-2">
              Integerated Health Systems for a Resilient Future: Harnessing Technology in Combating Diseases
            </p>
            <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto text-gray-200 px-4">
              Join Uganda's premier national health conference where healthcare professionals, innovators, and policymakers 
              unite in a coordinated response to combat both communicable and non-communicable diseases.
            </p>
            
            {/* Event Info Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 sm:py-4">
                <Calendar size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">August 25-28, 2025</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 sm:py-4">
                <MapPin size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-center">Speke Resort Munyonyo, Kampala</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-200 bg-black/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 sm:py-4 sm:col-span-2 lg:col-span-1">
                <Users size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">10+ Health Professionals</span>
              </div>
            </div>
            
            {/* CTA Buttons - Fully Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto px-4">
              <Link href="/register" className="w-full sm:w-auto btn-primary text-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">
                Register Now
              </Link>
              <Link href="/agenda" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm sm:text-base">
                View Agenda
              </Link>
            </div>
          </div>
        </div>
      </VideoBackground>

      {/* Key Features */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Attend the Conference?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
              Connect with Uganda's leading healthcare professionals and contribute to our national strategy against disease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Users className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Network & Connect</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Meet healthcare professionals, public health experts, policymakers, and community leaders from across Uganda and the region.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Award className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Learn from Experts</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Gain insights from leading Ugandan health experts and learn about successful national health initiatives and programs.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <ArrowRight className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Shape Healthcare Policy</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Be part of discussions that will define Uganda's future approach to combating communicable and non-communicable diseases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              Conference by the Numbers
            </h2>
            <p className="text-sm sm:text-base text-primary-100 max-w-2xl mx-auto px-4">
              Join healthcare professionals in Uganda's premier health conference
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center max-w-5xl mx-auto">
            <div className="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-primary-700/70 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">10+</div>
              <div className="text-primary-100 text-xs sm:text-sm md:text-base">Health Professionals</div>
            </div>
            <div className="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-primary-700/70 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">25+</div>
              <div className="text-primary-100 text-xs sm:text-sm md:text-base">Expert Speakers</div>
            </div>
            <div className="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-primary-700/70 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">10+</div>
              <div className="text-primary-100 text-xs sm:text-sm md:text-base">Health Partners</div>
            </div>
            <div className="bg-primary-700/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-primary-700/70 transition-colors">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">50+</div>
              <div className="text-primary-100 text-xs sm:text-sm md:text-base">Health Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Advance Healthcare?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Join us at Uganda's premier national health conference and be part of our united action against disease.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              <Link href="/register" className="w-full sm:w-auto btn-primary text-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Register Now - Early Bird Pricing
              </Link>
              <Link href="/contact" className="w-full sm:w-auto bg-white border-2 border-primary-400 text-primary-700 hover:bg-primary-50 hover:border-primary-500 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm sm:text-base shadow-md hover:shadow-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
