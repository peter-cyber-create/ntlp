'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />
    }
  }

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          icon={getIcon(notification.type)}
          styles={getStyles(notification.type)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
  icon: React.ReactNode
  styles: string
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRemove, 
  icon, 
  styles 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50)
    
    // Auto-remove after duration
    if (notification.duration) {
      const removeTimer = setTimeout(() => {
        handleRemove()
      }, notification.duration)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(removeTimer)
      }
    }
    
    return () => clearTimeout(timer)
  }, [notification.duration])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300) // Allow animation to complete
  }

  return (
    <div
      className={`${styles} border rounded-lg p-4 shadow-lg transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString()
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration
    }
    
    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, message: string = '', duration?: number) => {
    addNotification('success', title, message, duration)
  }

  const showError = (title: string, message: string = '', duration?: number) => {
    addNotification('error', title, message, duration)
  }

  const showInfo = (title: string, message: string = '', duration?: number) => {
    addNotification('info', title, message, duration)
  }

  const showWarning = (title: string, message: string = '', duration?: number) => {
    addNotification('warning', title, message, duration)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    NotificationSystem: () => (
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    )
  }
}

export default NotificationSystem
