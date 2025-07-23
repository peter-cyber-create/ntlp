'use client'

import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

interface DatabaseStats {
  success: boolean
  message: string
  mongodb?: {
    ping: string
    database: string
    collections: number
    dataSize: number
    storageSize: number
  }
  timestamp: string
  error?: string
}

export default function DatabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/database/test')
      const data = await response.json()
      setConnectionStatus(data)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testWrite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to write to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Database Connection Test</h1>
            </div>
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>
            {connectionStatus ? (
              <div className={`p-4 rounded-lg border ${
                connectionStatus.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {connectionStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    connectionStatus.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {connectionStatus.message}
                  </span>
                </div>
                
                {connectionStatus.mongodb && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Database:</span>
                      <span className="ml-2 text-gray-900">{connectionStatus.mongodb.database}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ping Status:</span>
                      <span className="ml-2 text-gray-900">{connectionStatus.mongodb.ping}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Collections:</span>
                      <span className="ml-2 text-gray-900">{connectionStatus.mongodb.collections}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Data Size:</span>
                      <span className="ml-2 text-gray-900">
                        {(connectionStatus.mongodb.dataSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {connectionStatus.error && (
                  <div className="mt-4 p-3 bg-red-100 rounded text-red-800 text-sm">
                    <strong>Error:</strong> {connectionStatus.error}
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Last tested: {new Date(connectionStatus.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Testing connection...</span>
              </div>
            )}
          </div>

          {/* Write Test */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Database Write Test</h2>
              <button
                onClick={testWrite}
                disabled={isLoading || !connectionStatus?.success}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                <span>Test Write</span>
              </button>
            </div>

            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    testResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {testResult.message}
                  </span>
                </div>

                {testResult.insertedId && (
                  <div className="mt-4 text-sm">
                    <span className="font-medium text-gray-700">Inserted ID:</span>
                    <span className="ml-2 text-gray-900 font-mono">{testResult.insertedId}</span>
                  </div>
                )}

                {testResult.document && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">Test Document:</span>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testResult.document, null, 2)}
                    </pre>
                  </div>
                )}

                {testResult.error && (
                  <div className="mt-4 p-3 bg-red-100 rounded text-red-800 text-sm">
                    <strong>Error:</strong> {testResult.error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Environment Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Environment:</span>
                  <span className="ml-2 text-gray-900">{process.env.NODE_ENV || 'development'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Database Name:</span>
                  <span className="ml-2 text-gray-900">ntlp</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">MongoDB Cluster:</span>
                  <span className="ml-2 text-gray-900">ntlp.iydd8kl.mongodb.net</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Connection Status:</span>
                  <span className={`ml-2 ${
                    connectionStatus?.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {connectionStatus?.success ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Admin */}
          <div className="mt-8 pt-6 border-t">
            <a
              href="/admin/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <span>← Back to Admin Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
