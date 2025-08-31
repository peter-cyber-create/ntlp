'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simple authentication for production
      if (formData.username === 'admin' && formData.password === 'conference2025') {
        // Set admin session
        localStorage.setItem('admin_token', 'admin-session-token')
        localStorage.setItem('admin_session', Date.now().toString())
        window.location.href = '/admin/dashboard'
      } else {
        setError('Invalid credentials. Please check your username and password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      {/* Header with Uganda Coat of Arms */}
      <div className="bg-primary-900/95 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/images/uganda-coat-of-arms.png" alt="Uganda Coat of Arms" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-100">NACNDC & JASH Conference 2025</h1>
              <p className="text-primary-300 text-sm md:text-base">Ministry of Health Uganda - Admin Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-primary-900/95 border border-primary-800 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-10 w-10 text-primary-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-primary-100 mb-2">Admin Access</h2>
              <p className="text-primary-300 text-sm">Conference Management System</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary-200 mb-2">Username</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    id="username"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-200 mb-2">Password</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type="password"
                    id="password"
                    required
                    className="w-full pl-12 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-primary-800 disabled:to-primary-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Production Notice */}
            <div className="mt-6 text-center">
              <p className="text-sm text-primary-400 mb-3">
                Secure Admin Access Required
              </p>
              <p className="text-xs text-primary-500">
                Contact system administrator for credentials
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <a href="/" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              ← Back to Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
