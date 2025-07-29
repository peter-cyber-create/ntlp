import './globals.css'
import { Inter } from 'next/font/google'
import UgandaStripe from '../components/UgandaStripe'
import { ConditionalLayout } from '../components/ConditionalLayout'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'Join Uganda\'s premier national health conference organized by the Ministry of Health. Integerated Health Systems for a Resilient Future: Harnessing Technology in Combating Diseases.',
  keywords: ['uganda health conference', 'ministry of health uganda', 'national health', 'communicable diseases', 'non-communicable diseases', 'health policy'],
  robots: 'index, follow',
  // Security and performance meta tags
  other: {
    'X-UA-Compatible': 'IE=edge',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional security meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        {/* Uganda Flag Stripe */}
        <UgandaStripe />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
