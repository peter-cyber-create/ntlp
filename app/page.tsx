import Link from 'next/link'
import { Calendar, MapPin, Users, Award, ArrowRight } from 'lucide-react'
import VideoBackground from '../components/VideoBackground'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Image Background */}
      <VideoBackground
        className="min-h-screen flex items-center justify-center -mt-32 pt-32"
        fallbackImage="/images/abstract.jpg"
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
            {/* Abstract Photo with Zoom Animation */}
            <div className="flex justify-center mb-8">
              <img
                src="/images/abstract.jpg"
                alt="Conference Abstract"
                className="w-64 h-64 object-cover rounded-2xl shadow-2xl animate-zoom"
              />
            </div>
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

      {/* ...rest of your sections (Key Features, Stats, CTA, etc.) go here... */}
    </div>
  )
}