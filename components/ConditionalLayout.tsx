'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <main className="min-h-screen admin-content">
        {children}
      </main>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen main-content">
        {children}
      </main>
      <Footer />
    </>
  )
}
