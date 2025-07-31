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

      {/* Official Call for Abstracts section with poster preview */}
      <section className="relative w-full bg-primary-950 py-10 px-2 sm:px-0 text-white">
        <div className="max-w-3xl mx-auto text-center rounded-xl shadow-lg bg-primary-900/80 p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Official Call for Abstracts</h2>
          <p className="mb-6 text-base sm:text-lg text-gray-200">
            Download or view the official call for abstracts. For more details, submit your own abstract below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <a
              href="/images/abstract.jpg"
              download
              className="btn-primary px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Download Abstract Poster
            </a>
            <a
              href="/abstracts"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-base"
            >
              Submit Your Abstract
            </a>
          </div>
          {/* Poster preview */}
          <div className="flex justify-center mt-8">
            <a href="/images/abstract.jpg" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/abstract.jpg"
                alt="Official Call for Abstracts Poster"
                className="rounded-lg shadow-lg max-w-xs w-full h-auto border border-primary-700 hover:scale-105 transition-transform duration-200"
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
    </>
  )
}