import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    
    // Seed demo data
    db.seedDemoData()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Demo data seeded successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error seeding demo data:', error)
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    
    // Get current data counts
    const registrations = db.getRegistrations()
    const contacts = db.getContactSubmissions()
    const speakers = db.getSpeakerApplications()
    
    return NextResponse.json({
      success: true,
      data: {
        registrations: registrations.length,
        contacts: contacts.length,
        speakers: speakers.length
      }
    })
  } catch (error) {
    console.error('Error getting data counts:', error)
    return NextResponse.json(
      { error: 'Failed to get data counts' },
      { status: 500 }
    )
  }
}
