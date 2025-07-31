import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import HomeSlideshow from '../components/HomeSlideshow'
import { Navbar } from '../components/Navbar'

export default function HomePage() {
  return (
    <>
      {/* Slideshow Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-primary-900">
        <div className="absolute inset-0 z-0 w-full h-full">
          <HomeSlideshow />
        </div>
      </section>
      {/* Navbar directly after slideshow */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Official Call for Abstracts section with poster preview */}
      <section className="relative w-full bg-primary-950 py-16 px-4 sm:px-0 text-white">
        <div className="max-w-3xl mx-auto text-center rounded-xl shadow-lg bg-primary-900/80 p-8">
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
              />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}