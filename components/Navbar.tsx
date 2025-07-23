'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // Only use white text on homepage when not scrolled, black everywhere else by default
  const isHomepage = pathname === '/'
  const shouldUseWhiteText = isHomepage && !isScrolled
  const shouldUseBlackText = !isHomepage || isScrolled

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Agenda', href: '/agenda' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Submit Abstract', href: '/abstracts' },
    { name: 'Contact', href: '/contact' },
  ]

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('adminAuth')
      setIsAdmin(!!adminAuth)
    }
  }, [])

  // Handle scroll for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`floating-nav ${isScrolled ? 'nav-scrolled' : 'nav-transparent'}`}>
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg transition-colors ${shouldUseWhiteText ? 'text-white' : 'text-gray-900'}`}>
                The Communicable and Non-Communicable Diseases Conference
              </span>
              <span className={`text-xs font-medium transition-colors ${shouldUseWhiteText ? 'text-primary-200' : 'text-gray-700'}`}>
                Ministry of Health 2025
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-all duration-200 border-b-2 border-transparent hover:border-primary-400 ${
                  shouldUseWhiteText 
                    ? 'text-white hover:text-primary-200' 
                    : 'text-gray-900 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`font-medium transition-colors duration-200 ${
                  shouldUseWhiteText 
                    ? 'text-orange-300 hover:text-orange-200' 
                    : 'text-gray-900 hover:text-gray-700'
                }`}
              >
                Admin
              </Link>
            )}
            <Link
              href="/register"
              className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                shouldUseWhiteText 
                  ? 'bg-primary-500/20 border border-primary-300/30 text-primary-100 hover:bg-primary-400/30' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              shouldUseWhiteText ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full mt-2 mx-4 border-t border-gray-200 bg-white/98 backdrop-blur-sm rounded-lg shadow-xl z-50">
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="block px-3 py-2 rounded-lg font-medium transition-colors text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/register"
                className="block px-3 py-2 mt-2 rounded-lg font-medium text-center transition-colors bg-primary-600 text-white hover:bg-primary-700 shadow-md"
                onClick={() => setIsOpen(false)}
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
