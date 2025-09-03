import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const db = DataManager.getInstance()
    
    if (body.status) {
      const updatedSpeaker = db.updateSpeakerStatus(id, body.status)
      
      if (!updatedSpeaker) {
        return NextResponse.json(
          { error: 'Speaker not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        speaker: updatedSpeaker
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating speaker:', error)
    return NextResponse.json(
      { error: 'Failed to update speaker' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = DataManager.getInstance()
    const speakers = db.getSpeakerApplications()
    
    const speaker = speakers.find(s => s.id === id)
    
    if (!speaker) {
      return NextResponse.json(
        { error: 'Speaker not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      speaker
    })
  } catch (error) {
    console.error('Error fetching speaker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch speaker' },
      { status: 500 }
    )
  }
}
