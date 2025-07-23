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
    { name: 'Speakers', href: '/speakers' },
    { name: 'Agenda', href: '/agenda' },
    { name: 'Abstracts', href: '/abstracts' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' },
  ]

  const actionItems = [
    { name: 'Submit Abstract', href: '/abstracts', type: 'secondary' },
    { name: 'Register', href: '/register', type: 'primary' },
  ]

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
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-sm sm:text-lg transition-colors ${shouldUseWhiteText ? 'text-white' : 'text-gray-900'}`}>
                The Communicable and Non-Communicable Diseases Conference 2025
              </span>
              <span className={`text-xs font-medium transition-colors ${shouldUseWhiteText ? 'text-primary-200' : 'text-gray-600'}`}>
                Ministry of Health Uganda
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium text-sm transition-all duration-200 border-b-2 border-transparent hover:border-primary-400 ${
                    pathname === item.href
                      ? shouldUseWhiteText 
                        ? 'text-primary-200 border-primary-200' 
                        : 'text-primary-600 border-primary-600'
                      : shouldUseWhiteText 
                        ? 'text-white hover:text-primary-200' 
                        : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-300/50">
              {actionItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    item.type === 'primary'
                      ? shouldUseWhiteText 
                        ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                      : shouldUseWhiteText 
                        ? 'bg-white/10 border border-white/30 text-white hover:bg-white/20' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              shouldUseWhiteText ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full mt-2 mx-4 bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl z-50 border border-gray-200">
            <div className="p-6 space-y-1 max-h-96 overflow-y-auto">
              {/* Main Navigation */}
              <div className="space-y-1 mb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {actionItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium text-center transition-colors ${
                      item.type === 'primary'
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
