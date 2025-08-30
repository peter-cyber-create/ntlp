
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Backend API URL
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Authenticate with backend
      const response = await fetch(`${BACKEND_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store admin session and token
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_session', Date.now().toString())
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard'
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Invalid credentials. Please check your email and password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBypassLogin = () => {
    // Temporary bypass for testing - redirect to dashboard
    localStorage.setItem('admin_authenticated', 'true')
    localStorage.setItem('admin_token', 'test-token')
    localStorage.setItem('admin_session', Date.now().toString())
    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-200">
            <Image 
              src="/images/uganda-coat-of-arms.png" 
              alt="Uganda Coat of Arms" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-primary-600 font-medium">NACNDC & JASHConference 2025</p>
          <p className="text-gray-500 text-sm mt-2">Conference Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Contact the administrator for login credentials.
            </p>
            <button
              onClick={handleBypassLogin}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Test Mode (Bypass Login)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a href="/" className="text-primary-100 hover:text-white text-sm">
            ← Back to Main Site
          </a>
        </div>
      </div>
    </div>
  )
}
