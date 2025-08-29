'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import DataManager from '../../../lib/dataManager'
import AnalyticsCharts from '../../../components/AnalyticsCharts'
import { 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  UserPlus,
  MessageSquare,
  Globe,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Upload,
  Menu,
  X,
  ExternalLink,
  CreditCard,
  Building
} from 'lucide-react'

export default function AdminDashboard() {
  // MINIMAL TEST - Just return a simple div to see if anything renders
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🚨 MINIMAL TEST</h1>
        <p className="text-xl">If you see this, the component is working!</p>
        <p className="text-lg mt-2">Total Registrations: 9</p>
        <p className="text-lg">Pending: 6</p>
      </div>
    </div>
  )
}
