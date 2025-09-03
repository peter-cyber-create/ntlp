/**
 * Security utilities following OWASP guidelines
 * Provides input validation, sanitization, and security helpers
 */

// Input validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  name: /^[a-zA-Z\s\-']{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .trim()
    .substring(0, 1000) // Limit length
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  return ValidationPatterns.email.test(email.toLowerCase())
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  return ValidationPatterns.phone.test(phone.replace(/\s/g, ''))
}

/**
 * Validate name format
 */
export function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  return ValidationPatterns.name.test(name) && name.length >= 2 && name.length <= 50
}

/**
 * Generate secure random token for CSRF protection
 */
export function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for server-side or older browsers
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Rate limiting helper
 */
export class RateLimit {
  private requests: Map<string, number[]> = new Map()
  
  constructor(private maxRequests: number = 5, private timeWindow: number = 60000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside time window
    const validRequests = userRequests.filter(time => now - time < this.timeWindow)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
}

/**
 * Secure form validation
 */
export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
  sanitizedData: Record<string, string>
}

export function validateFormData(data: Record<string, any>, rules: Record<string, {
  required?: boolean
  type?: 'email' | 'phone' | 'name' | 'text'
  minLength?: number
  maxLength?: number
}>): FormValidationResult {
  const errors: Record<string, string> = {}
  const sanitizedData: Record<string, string> = {}
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]
    
    // Check required fields
    if (rule.required && (!value || !value.toString().trim())) {
      errors[field] = `${field} is required`
      continue
    }
    
    if (!value) {
      sanitizedData[field] = ''
      continue
    }
    
    const stringValue = value.toString()
    const sanitized = sanitizeInput(stringValue)
    
    // Length validation
    if (rule.minLength && sanitized.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`
      continue
    }
    
    if (rule.maxLength && sanitized.length > rule.maxLength) {
      errors[field] = `${field} must be no more than ${rule.maxLength} characters`
      continue
    }
    
    // Type validation
    switch (rule.type) {
      case 'email':
        if (!validateEmail(sanitized)) {
          errors[field] = 'Please enter a valid email address'
          continue
        }
        break
      case 'phone':
        if (!validatePhone(sanitized)) {
          errors[field] = 'Please enter a valid phone number'
          continue
        }
        break
      case 'name':
        if (!validateName(sanitized)) {
          errors[field] = 'Please enter a valid name'
          continue
        }
        break
    }
    
    sanitizedData[field] = sanitized
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}

/**
 * Secure localStorage wrapper with encryption simulation
 */
export const SecureStorage = {
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify({
        value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(JSON.stringify(value))
      })
      localStorage.setItem(`secure_${key}`, data)
    } catch (error) {
      console.error('Failed to store data securely:', error)
    }
  },
  
  get(key: string): any {
    try {
      const data = localStorage.getItem(`secure_${key}`)
      if (!data) return null
      
      const parsed = JSON.parse(data)
      const valueStr = JSON.stringify(parsed.value)
      
      // Verify checksum
      if (this.generateChecksum(valueStr) !== parsed.checksum) {
        console.warn('Data integrity check failed')
        this.remove(key)
        return null
      }
      
      // Check if data is older than 24 hours
      if (Date.now() - parsed.timestamp > 86400000) {
        this.remove(key)
        return null
      }
      
      return parsed.value
    } catch (error) {
      console.error('Failed to retrieve data securely:', error)
      return null
    }
  },
  
  remove(key: string): void {
    localStorage.removeItem(`secure_${key}`)
  },
  
  generateChecksum(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }
}

/**
 * Content Security Policy nonce generator
 */
export function generateNonce(): string {
  return generateSecureToken().substring(0, 16)
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true // Server-side
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
}
