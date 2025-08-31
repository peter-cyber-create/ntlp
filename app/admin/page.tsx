
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Temporarily bypass authentication for development
    router.push('/admin/dashboard')
    
    // TODO: Re-enable authentication when ready
    /*
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    const token = localStorage.getItem('admin_token')
    const session = localStorage.getItem('admin_session')

    if (authStatus && token && session) {
      // Check if session is still valid (24 hours)
      const sessionTime = parseInt(session)
      const now = Date.now()
      if (now - sessionTime <= 24 * 60 * 60 * 1000) {
        // Valid session, redirect to dashboard
        router.push('/admin/dashboard')
        return
      }
    }

    // Not authenticated or expired session, redirect to login
    router.push('/admin/login')
    */
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
