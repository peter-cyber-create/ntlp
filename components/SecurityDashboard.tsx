'use client'

import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, Users, FileText, Clock } from 'lucide-react'

interface SecurityMetrics {
  totalLogins: number
  failedLogins: number
  blockedIPs: number
  securityEvents: number
  lastSecurityScan: string
  sslStatus: 'valid' | 'warning' | 'expired'
  securityScore: number
}

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'form_submission' | 'rate_limit' | 'security_scan' | 'xss_attempt'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  source: string
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalLogins: 0,
    failedLogins: 0,
    blockedIPs: 0,
    securityEvents: 0,
    lastSecurityScan: new Date().toISOString(),
    sslStatus: 'valid',
    securityScore: 85
  })
  
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading security data
    setTimeout(() => {
      setEvents([
        {
          id: '1',
          type: 'login_attempt',
          severity: 'low',
          message: 'Successful admin login',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          source: '192.168.1.1'
        },
        {
          id: '2',
          type: 'form_submission',
          severity: 'low',
          message: 'Contact form submitted and validated',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          source: '203.45.67.89'
        },
        {
          id: '3',
          type: 'rate_limit',
          severity: 'medium',
          message: 'Rate limit triggered for repeated form submissions',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          source: '123.45.67.89'
        },
        {
          id: '4',
          type: 'security_scan',
          severity: 'low',
          message: 'Automated security scan completed - no issues found',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: 'system'
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Users className="w-4 h-4" />
      case 'form_submission': return <FileText className="w-4 h-4" />
      case 'rate_limit': return <AlertTriangle className="w-4 h-4" />
      case 'security_scan': return <Shield className="w-4 h-4" />
      case 'xss_attempt': return <AlertTriangle className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Security Dashboard</h2>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Security Score</p>
              <p className={`text-2xl font-bold ${getSecurityScoreColor(metrics.securityScore)}`}>
                {metrics.securityScore}%
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">SSL Status</p>
              <p className="text-lg font-semibold text-green-700 capitalize">
                {metrics.sslStatus}
              </p>
            </div>
            <Lock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 mb-1">Failed Logins</p>
              <p className="text-2xl font-bold text-yellow-700">{metrics.failedLogins}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 mb-1">Security Events</p>
              <p className="text-2xl font-bold text-red-700">{metrics.securityEvents}</p>
            </div>
            <Eye className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Security Best Practices Checklist */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {[
              { item: 'HTTPS Enabled', status: true },
              { item: 'Content Security Policy', status: true },
              { item: 'Input Validation', status: true },
              { item: 'Rate Limiting', status: true }
            ].map((check, index) => (
              <div key={index} className="flex items-center gap-3">
                {check.status ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={check.status ? 'text-gray-700' : 'text-red-600'}>
                  {check.item}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { item: 'XSS Protection', status: true },
              { item: 'CSRF Protection', status: true },
              { item: 'Secure Headers', status: true },
              { item: 'Data Sanitization', status: true }
            ].map((check, index) => (
              <div key={index} className="flex items-center gap-3">
                {check.status ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={check.status ? 'text-gray-700' : 'text-red-600'}>
                  {check.item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <span className="text-sm text-gray-900">{event.message}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {event.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Recommendations</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Monitor security events regularly</li>
          <li>• Update security policies quarterly</li>
          <li>• Review user access permissions monthly</li>
          <li>• Perform security audits before major releases</li>
        </ul>
      </div>
    </div>
  )
}
