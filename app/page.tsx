import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import HomeSlideshow from '../components/HomeSlideshow'
import { Navbar } from '../components/Navbar'

export default function HomePage() {
  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>The Communicable and Non-Communicable Diseases Conference 2025</title>
        <meta name="description" content="Uganda's premier national health conference organized by the Ministry of Health. Theme: Integrated Health Systems for a Resilient Future: Harnessing Technology in Combating Diseases." />
        <meta name="keywords" content="uganda health conference, ministry of health uganda, national health, communicable diseases, non-communicable diseases, health policy, conference 2025" />
        <meta property="og:title" content="The Communicable and Non-Communicable Diseases Conference 2025" />
        <meta property="og:description" content="Uganda's premier national health conference organized by the Ministry of Health." />
        <meta property="og:image" content="/images/uganda-coat-of-arms.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Communicable and Non-Communicable Diseases Conference 2025" />
        <meta name="twitter:description" content="Uganda's premier national health conference organized by the Ministry of Health." />
      </head>
      {/* Hero Section with Slideshow, Overlay, and Title */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden border-b border-primary-900">
        <div className="absolute inset-0 z-0 w-full h-full">
          <HomeSlideshow />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-16 pb-8 animate-fade-in">
          <img src="/images/uganda-coat-of-arms.png" alt="Uganda Coat of Arms" className="w-16 h-16 mb-4 drop-shadow-lg" loading="lazy" decoding="async" width="64" height="64" />
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-tight leading-tight drop-shadow-xl animate-slide-up">
            The Communicable and Non-Communicable Diseases Conference 2025
          </h1>
          <p className="text-primary-200 text-base sm:text-xl font-medium mb-4 animate-fade-in delay-200 text-center max-w-2xl">
            Integrated Health Systems for a Resilient Future<br />
            <span className="text-primary-400">Harnessing Technology in Combating Diseases</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in delay-300">
            <Link href="/register" className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-base shadow-lg hover:scale-105 transition-transform duration-200">
              Register Now
            </Link>
            <Link href="/abstracts" className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-6 py-2.5 rounded-lg font-semibold text-base shadow-lg transition-all duration-200">
              Submit Abstract
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
              <span className="text-primary-200 mt-1">March 12-14, 2025</span>
            </div>
            <div className="flex flex-col items-center bg-primary-950/80 border border-primary-700 rounded-2xl p-6 shadow-md w-full sm:w-1/3">
              <MapPin className="w-8 h-8 text-primary-400 mb-2" />
              <span className="text-lg font-bold text-primary-100">Venue</span>
              <span className="text-primary-200 mt-1">Kampala Serena Hotel, Uganda</span>
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