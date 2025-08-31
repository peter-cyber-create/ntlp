import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    const registrations = db.getRegistrations()
    
    return NextResponse.json({
      success: true,
      registrations
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DataManager.getInstance()
    
    const newRegistration = db.addRegistration(body)
    
    return NextResponse.json({
      success: true,
      registration: newRegistration
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
