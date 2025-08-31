'use client'

import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple credential check
    if (formData.username === 'admin' && formData.password === 'conference2025') {
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_token', 'admin-session-token')
      localStorage.setItem('admin_session', Date.now().toString())
      window.location.href = '/dashboard'
    } else {
      setError('Invalid credentials. Please use: admin / conference2025')
    }
    
    setIsLoading(false)
  }

  const handleBypassLogin = () => {
    console.log('Bypass login clicked!')
    
    try {
      // Set a working token directly
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_token', 'admin-session-token')
      localStorage.setItem('admin_session', Date.now().toString())
      
      console.log('Authentication set, redirecting to dashboard...')
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Bypass login error:', error)
      setError('Bypass login failed. Please try again.')
    }
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
              <h1 className="text-2xl md:text-3xl font-bold text-primary-100">
                NACNDC & JASH Conference 2025
              </h1>
              <p className="text-primary-300 text-sm md:text-base">
                Ministry of Health Uganda - Admin Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-primary-900/95 border border-primary-800 rounded-3xl shadow-2xl p-8">
            {/* Card Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-700">
                <Shield className="h-10 w-10 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-primary-100 mb-2">Admin Access</h2>
              <p className="text-primary-300 text-sm">Conference Management System</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary-200 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
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

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-primary-800 disabled:to-primary-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Test Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-primary-400 mb-3">
                Use the credentials: admin / conference2025
              </p>
              <button
                onClick={handleBypassLogin}
                className="text-sm text-primary-300 hover:text-primary-200 underline font-medium transition-colors"
              >
                🚀 Test Mode (Bypass Login)
              </button>
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
