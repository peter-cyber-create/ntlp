'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // Only use white text on homepage when not scrolled, black everywhere else by default
  const isHomepage = pathname === '/'
  // Always use a visible background and dark text on homepage for contrast
  const shouldUseWhiteText = false
  const shouldUseBlackText = true

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
    { name: 'Register Now', href: '/register', type: 'primary' },
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
    <nav className={
      `floating-nav bg-white/80 shadow-md backdrop-blur-md border-b border-primary-200 fixed top-[20px] left-1/2 -translate-x-1/2 rounded-2xl max-w-[98vw] lg:max-w-[1600px] w-full mx-auto z-40 transition-all duration-300 py-2 px-6 flex items-center`
    }>
      <div className="flex justify-between items-center w-full flex-nowrap">
        <div className="flex justify-between items-center min-h-[4.5rem] py-2 w-full flex-nowrap gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-sm sm:text-base lg:text-lg leading-tight transition-colors ${shouldUseWhiteText ? 'text-white' : 'text-gray-900'}`}>
                <span className="block">The Communicable</span>
                <span className="block">and Non-Communicable Diseases</span>
                <span className="block">Conference <span className="font-extrabold">2025</span></span>
              </span>
              <span className={`text-xs sm:text-sm font-medium transition-colors ${shouldUseWhiteText ? 'text-primary-200' : 'text-gray-600'}`}>
                Ministry of Health Uganda
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Main Navigation */}
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-150 hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 ${pathname === item.href ? 'bg-primary-600 text-white shadow-md scale-105 ring-2 ring-primary-400' : shouldUseBlackText ? 'text-gray-900' : 'text-primary-100'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Separator */}
            <div className="h-8 w-px bg-primary-200 mx-4 hidden lg:block" />
            {/* Action Buttons (Desktop) */}
            <div className="flex items-center space-x-2">
              {actionItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400 text-center ${
                    item.type === 'primary'
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
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
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors transform hover:scale-105 ${
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
                    className={`block px-4 py-3 rounded-lg font-medium text-center transition-all duration-200 transform hover:scale-105 ${
                      item.type === 'primary'
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
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
