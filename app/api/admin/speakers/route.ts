import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    const speakers = db.getSpeakerApplications()
    
    return NextResponse.json({
      success: true,
      speakers
    })
  } catch (error) {
    console.error('Error fetching speakers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch speakers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DataManager.getInstance()
    
    const newSpeaker = db.addSpeakerApplication(body)
    
    return NextResponse.json({
      success: true,
      speaker: newSpeaker
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating speaker:', error)
    return NextResponse.json(
      { error: 'Failed to create speaker' },
      { status: 500 }
    )
  }
}
