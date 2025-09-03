import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    
    // Get data using the actual DataManager methods
    const registrations = db.getRegistrations()
    const contacts = db.getContactSubmissions()
    const speakers = db.getSpeakerApplications()
    
    // Calculate statistics
    const totalRegistrations = registrations.length
    const approvedRegistrations = registrations.filter(r => r.status === 'confirmed').length
    const pendingRegistrations = registrations.filter(r => r.status === 'pending').length
    const rejectedRegistrations = registrations.filter(r => r.status === 'rejected').length
    
    const totalContacts = contacts.length
    const respondedContacts = contacts.filter(c => c.status === 'replied').length
    const pendingContacts = contacts.filter(c => c.status === 'new').length
    
    const totalSpeakers = speakers.length
    const approvedSpeakers = speakers.filter(s => s.status === 'approved').length
    const pendingSpeakers = speakers.filter(s => s.status === 'pending').length
    const rejectedSpeakers = speakers.filter(s => s.status === 'rejected').length
    
    // Get recent activities
    const recentRegistrations = registrations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    const recentContacts = contacts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    const recentSpeakers = speakers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    const dashboardData = {
      registrations: {
        total: totalRegistrations,
        approved: approvedRegistrations,
        pending: pendingRegistrations,
        rejected: rejectedRegistrations,
        newThisWeek: registrations.filter(r => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return new Date(r.createdAt) > weekAgo
        }).length
      },
      contacts: {
        total: totalContacts,
        responded: respondedContacts,
        pending: pendingContacts,
        newThisWeek: contacts.filter(c => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return new Date(c.createdAt) > weekAgo
        }).length
      },
      speakers: {
        total: totalSpeakers,
        approved: approvedSpeakers,
        pending: pendingSpeakers,
        rejected: rejectedSpeakers,
        newThisWeek: speakers.filter(s => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return new Date(s.createdAt) > weekAgo
        }).length
      },
      recentActivity: {
        registrations: recentRegistrations.map(r => ({
          type: 'registration',
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          email: r.email,
          status: r.status,
          date: r.createdAt
        })),
        contacts: recentContacts.map(c => ({
          type: 'contact',
          id: c.id,
          name: c.name,
          email: c.email,
          status: c.status,
          date: c.createdAt
        })),
        speakers: recentSpeakers.map(s => ({
          type: 'speaker',
          id: s.id,
          name: s.name,
          email: s.email,
          status: s.status,
          date: s.createdAt
        }))
      }
    }
    
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
