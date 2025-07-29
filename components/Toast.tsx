'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-blue-800'
    }
  }

  return (
    <div className={`max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transition-all transform duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`rounded-md inline-flex ${getTextColor()} hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => onRemove(toast.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    setToasts(prev => [...prev, toast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration)
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration)
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration)
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default ToastComponent
