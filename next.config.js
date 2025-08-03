/** @type {import('next').NextConfig} */
const nextConfig = {
  // Single-server deployment configuration
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['172.27.0.9'] // Allow images from production server
  },
  experimental: {
    esmExternals: false
  },
  
  // Production optimization
  compress: true,
  poweredByHeader: false,
  
  // Environment-specific configuration
  env: {
    CUSTOM_SERVER_IP: '172.27.0.9'
  },
  // Security headers following OWASP guidelines
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy - prevents XSS and injection attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'"
            ].join('; ')
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Strict Transport Security (HTTPS enforcement)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Referrer policy for privacy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Cache control for sensitive data
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
          }
        ]
      }
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      // Disable caching in development to prevent chunk loading issues
      config.cache = false
      config.optimization.splitChunks = false
    }
    
    return config
  }
}

module.exports = nextConfig
