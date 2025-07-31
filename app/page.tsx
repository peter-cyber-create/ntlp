import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import HomeSlideshow from '../components/HomeSlideshow'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center -mt-32 pt-32 overflow-hidden border-b border-primary-900">
        <div className="absolute inset-0 z-0 w-full h-full">
          <HomeSlideshow />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center text-white flex flex-col items-center justify-center">
          {/* Uganda Coat of Arms */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                <img 
                  src="/images/uganda-coat-of-arms.png" 
                  alt="Uganda Coat of Arms" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="inline-flex items-center px-3 sm:px-4 py-2 text-primary-100 text-xs sm:text-sm font-medium bg-transparent border-none">
              <span className="mr-2">🇺🇬</span>
              <span className="hidden sm:inline">Republic of Uganda • </span>
              <span>Ministry of Health</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            The Communicable and Non-Communicable Diseases Conference 2025
          </h1>
        </div>
      </section>

      {/* Why Attend and Conference by the Numbers section */}
      <section className="relative w-full bg-black/90 py-16 px-4 sm:px-0 text-white border-b border-primary-900">
        <div className="max-w-5xl mx-auto rounded-xl shadow-lg bg-black/80 p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 mt-10 text-center">Why Attend the Conference?</h2>
          <p className="mb-6 text-base sm:text-lg text-gray-200 text-center">Connect with Uganda's leading healthcare professionals and contribute to our national strategy against disease.</p>
          <ul className="mb-8 text-left max-w-2xl mx-auto space-y-3 text-gray-100">
            <li><span className="font-semibold">Network &amp; Connect:</span> Meet healthcare professionals, public health experts, policymakers, and community leaders from across Uganda and the region.</li>
            <li><span className="font-semibold">Learn from Experts:</span> Gain insights from leading Ugandan health experts and learn about successful national health initiatives and programs.</li>
            <li><span className="font-semibold">Shape Healthcare Policy:</span> Be part of discussions that will define Uganda's future approach to combating communicable and non-communicable diseases.</li>
          </ul>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Conference by the Numbers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-200">10+</span>
              <span className="text-xs mt-1">Health Professionals</span>
            </div>
            <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-200">25+</span>
              <span className="text-xs mt-1">Expert Speakers</span>
            </div>
            <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-200">10+</span>
              <span className="text-xs mt-1">Health Partners</span>
            </div>
            <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-200">50+</span>
              <span className="text-xs mt-1">Health Organizations</span>
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-center">Ready to Advance Healthcare?</h4>
          <p className="mb-6 text-base sm:text-lg text-gray-200 text-center">Join us at Uganda's premier national health conference and be part of our united action against disease.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto px-4">
            <Link href="/register" className="w-full sm:w-auto btn-primary text-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">
              Register Now - Early Bird Pricing
            </Link>
            <Link href="/contact" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm sm:text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Official Call for Abstracts section */}
      <section className="relative w-full bg-primary-950 py-16 px-4 sm:px-0 text-white">
        <div className="max-w-3xl mx-auto text-center rounded-xl shadow-lg bg-primary-900/80 p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Official Call for Abstracts</h2>
          <p className="mb-6 text-base sm:text-lg text-gray-200">
            Download or view the official call for abstracts. For more details, submit your own abstract below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <a
              href="/abstract.pdf"
              download
              className="btn-primary px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Download Abstract PDF
            </a>
            <a
              href="/abstracts"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-base"
            >
              Submit Your Abstract
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}