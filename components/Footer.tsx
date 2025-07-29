import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/images/uganda-coat-of-arms.png" 
                  alt="Uganda Coat of Arms" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-sm sm:text-base lg:text-lg leading-tight block">
                <span className="block">The Communicable</span>
                <span className="block">and Non-Communicable Diseases</span>
                <span className="block">Conference <span className="font-extrabold">2025</span></span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Bringing together Uganda's healthcare professionals and leaders for integrated health systems and technology-driven solutions against communicable and non-communicable diseases.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>🏛️ Ministry of Health Uganda</p>
              <p>📍 Plot 6, Lourdel Road, Nakasero, Kampala, Uganda</p>
              <p>🏨 Conference Venue: Speke Resort Munyonyo</p>
              <p>📧 info@health.go.ug</p>
              <p>📞 +256 800 200 200 (MOH Call Centre)</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">About Conference</Link></li>
              <li><Link href="/agenda" className="text-gray-300 hover:text-primary-400 transition-colors">Agenda</Link></li>
              <li><Link href="/speakers" className="text-gray-300 hover:text-primary-400 transition-colors">Speakers</Link></li>
              <li><Link href="/partners" className="text-gray-300 hover:text-primary-400 transition-colors">Partners</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-primary-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 The Communicable and Non-Communicable Diseases Conference 2025. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
