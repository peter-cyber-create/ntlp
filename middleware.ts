import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if accessing admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // For admin routes, we'll let the client-side handle authentication
    // This prevents direct server-side access but allows the layout to handle auth
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
