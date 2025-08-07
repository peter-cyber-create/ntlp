import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import HomeSlideshow from '../components/HomeSlideshow'
import { Navbar } from '../components/Navbar'

export const metadata = {
  title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
  description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
  keywords: 'uganda health conference, ministry of health uganda, national health, communicable diseases, non-communicable diseases, health policy, conference 2025, NACNDC, JASH',
  openGraph: {
    title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
    description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
    images: ['/images/uganda-coat-of-arms.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
    description: 'Uganda\'s premier national health conference organized by the Ministry of Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Slideshow, Overlay, and Title */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center overflow-hidden border-b border-primary-900">
        <div className="absolute inset-0 z-0 w-full h-full">
          <HomeSlideshow />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-16 pb-8 px-3 sm:px-4 md:px-6 animate-fade-in">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight drop-shadow-xl animate-slide-up text-center max-w-7xl">
            NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025
          </h1>
          <h2 className="text-primary-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 animate-fade-in delay-100 text-center max-w-5xl px-2">
            UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES
          </h2>
          <p className="text-primary-200 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 animate-fade-in delay-200 text-center max-w-3xl px-2">
            3rd - 7th November, 2025 • Speke Resort Munyonyo, Uganda
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in delay-300 w-full max-w-lg sm:max-w-none px-4">
            <Link href="/register" className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base min-h-[52px] border border-primary-600 hover:border-primary-700 w-full xs:w-auto text-center min-w-[160px]">
              <span className="text-lg">🎫</span>
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </Link>
            <Link href="/abstracts" className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white hover:border-white/90 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base min-h-[52px] backdrop-blur-sm w-full xs:w-auto text-center min-w-[160px]">
              <span className="text-lg">📄</span>
              <span className="relative z-10">Submit Abstract</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Navbar floating above hero */}
      <div className="absolute top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      {/* Official Call for Abstracts section with CRUD-inspired card UI */}
      <section className="relative w-full bg-primary-950 py-16 px-2 sm:px-0 text-white">
        {/* Section divider */}
        <div className="flex justify-center mb-10">
          <div className="h-1 w-32 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-80" />
        </div>
        <div className="max-w-3xl mx-auto text-center rounded-3xl shadow-2xl bg-primary-900/95 p-8 sm:p-14 border border-primary-800 flex flex-col gap-8 transition-transform duration-200 hover:scale-[1.017]">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight text-primary-100 drop-shadow-lg">Official Call for Abstracts</h2>
          <p className="mb-3 text-lg sm:text-xl text-primary-200 font-medium">
            Download or view the official call for abstracts. For more details, submit your own abstract below.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-2 mb-2">
            <a
              href="/images/abstract.jpg"
              download
              className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:from-primary-600 hover:to-primary-800 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              Download Abstract Poster
            </a>
            <a
              href="/abstracts"
              className="border-2 border-primary-500 text-primary-100 bg-transparent hover:bg-primary-500 hover:text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              Submit Your Abstract
            </a>
          </div>
          {/* Poster preview */}
          <div className="flex justify-center mt-5">
            <a href="/images/abstract.jpg" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/abstract.jpg"
                alt="Official Call for Abstracts Poster"
                className="rounded-2xl shadow-2xl max-w-xs w-full h-auto border-2 border-primary-700 hover:scale-105 transition-transform duration-200 bg-white/10"
                style={{ maxHeight: '320px', objectFit: 'contain' }}
                loading="lazy"
                decoding="async"
                width="320"
                height="453"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Conference At-a-Glance section with CRUD-inspired card UI */}
      <section className="relative w-full bg-primary-950 py-16 px-2 sm:px-0 text-white">
        {/* Section divider */}
        <div className="flex justify-center mb-10">
          <div className="h-1 w-32 bg-gradient-to-r from-primary-700 via-primary-400 to-primary-500 rounded-full opacity-80" />
        </div>
        <div className="max-w-4xl mx-auto text-center rounded-3xl shadow-2xl bg-primary-900/95 p-8 sm:p-14 border border-primary-800 flex flex-col gap-8 transition-transform duration-200 hover:scale-[1.017]">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight text-primary-100 drop-shadow-lg">Conference At-a-Glance</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-4">
            <div className="flex flex-col items-center bg-primary-950/80 border border-primary-700 rounded-2xl p-6 shadow-md w-full sm:w-1/3">
              <Calendar className="w-8 h-8 text-primary-400 mb-2" />
              <span className="text-lg font-bold text-primary-100">Dates</span>
              <span className="text-primary-200 mt-1">3rd - 7th November, 2025</span>
            </div>
            <div className="flex flex-col items-center bg-primary-950/80 border border-primary-700 rounded-2xl p-6 shadow-md w-full sm:w-1/3">
              <MapPin className="w-8 h-8 text-primary-400 mb-2" />
              <span className="text-lg font-bold text-primary-100">Venue</span>
              <span className="text-primary-200 mt-1">Speke Resort Munyonyo, Uganda</span>
            </div>
            <div className="flex flex-col items-center bg-primary-950/80 border border-primary-700 rounded-2xl p-6 shadow-md w-full sm:w-1/3">
              <Users className="w-8 h-8 text-primary-400 mb-2" />
              <span className="text-lg font-bold text-primary-100">Expected Attendees</span>
              <span className="text-primary-200 mt-1">500+ Health Professionals</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}