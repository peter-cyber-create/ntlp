'use client'

import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

interface AnalyticsChartsProps {
  registrations: any[]
  contacts: any[]
  speakers: any[]
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ registrations, contacts, speakers }) => {
  // Generate daily registration data for the past 30 days
  const generateDailyData = () => {
    const days = 30
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i))
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Count registrations for this day
      const regsForDay = registrations.filter(reg => 
        reg.createdAt && format(new Date(reg.createdAt), 'yyyy-MM-dd') === dateStr
      ).length
      
      // Count contacts for this day
      const contactsForDay = contacts.filter(contact => 
        contact.createdAt && format(new Date(contact.createdAt), 'yyyy-MM-dd') === dateStr
      ).length
      
      data.push({
        date: format(date, 'MMM dd'),
        registrations: regsForDay,
        contacts: contactsForDay,
        visitors: Math.floor(Math.random() * 200) + 50 // Mock visitor data
      })
    }
    
    return data
  }

  // Ticket type distribution
  const getTicketTypeData = () => {
    const ticketCounts = registrations.reduce((acc, reg) => {
      acc[reg.ticketType] = (acc[reg.ticketType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(ticketCounts).map(([type, count]) => ({
      name: type,
      value: count as number,
      percentage: Math.round(((count as number) / registrations.length) * 100)
    }))
  }

  // Geographic distribution (mock data based on districts)
  const getGeographicData = () => {
    const districtCounts = registrations.reduce((acc, reg) => {
      acc[reg.country] = (acc[reg.country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(districtCounts)
      .map(([district, count]) => ({ country: district, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Contact status distribution
  const getContactStatusData = () => {
    const statusCounts = contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }))
  }

  const dailyData = generateDailyData()
  const ticketTypeData = getTicketTypeData()
  const geographicData = getGeographicData()
  const contactStatusData = getContactStatusData()

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B']

  return (
    <div className="space-y-8">
      {/* Registration Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Registration Trends</h3>
            <p className="text-sm text-gray-500">Daily registrations, contacts, and website visitors</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="registrations"
              stackId="1"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
              name="Registrations"
            />
            <Area
              type="monotone"
              dataKey="contacts"
              stackId="2"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.6}
              name="Contact Inquiries"
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#10B981"
              strokeWidth={2}
              name="Website Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ticket Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ticket Distribution</h3>
              <p className="text-sm text-gray-500">Registration types breakdown</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ticketTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
              <p className="text-sm text-gray-500">Top 10 districts by registrations</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={geographicData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis 
                dataKey="country" 
                type="category" 
                stroke="#6B7280" 
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Status</h3>
              <p className="text-sm text-gray-500">Support ticket status distribution</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={contactStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
              <p className="text-sm text-gray-500">Important performance indicators</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
              <span className="text-lg font-bold text-green-600">
                {registrations.length > 0 ? ((registrations.length / (registrations.length + contacts.length)) * 100).toFixed(1) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Avg. Daily Registrations</span>
              <span className="text-lg font-bold text-blue-600">
                {(registrations.length / 30).toFixed(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Speaker Approval Rate</span>
              <span className="text-lg font-bold text-purple-600">
                {speakers.length > 0 ? ((speakers.filter(s => s.status === 'approved').length / speakers.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Response Time (Avg)</span>
              <span className="text-lg font-bold text-orange-600">4.2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
