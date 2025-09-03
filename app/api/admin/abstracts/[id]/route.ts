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
      const updatedAbstract = db.updateSpeakerStatus(id, body.status)
      
      if (!updatedAbstract) {
        return NextResponse.json(
          { error: 'Abstract not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        abstract: updatedAbstract
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating abstract:', error)
    return NextResponse.json(
      { error: 'Failed to update abstract' },
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
        { error: 'Abstract not found' },
        { status: 404 }
      )
    }
    
    // Transform to abstract format
    const abstract = {
      id: speaker.id,
      title: speaker.sessionProposal || 'Abstract Submission',
      author: speaker.name,
      email: speaker.email,
      organization: speaker.organization,
      abstract: speaker.bio,
      keywords: speaker.expertise,
      category: 'research',
      status: speaker.status === 'pending' ? 'pending' : 
              speaker.status === 'approved' ? 'approved' : 'rejected',
      score: undefined,
      reviewer: undefined,
      comments: undefined,
      createdAt: speaker.createdAt,
      updatedAt: speaker.updatedAt
    }
    
    return NextResponse.json({
      success: true,
      abstract
    })
  } catch (error) {
    console.error('Error fetching abstract:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abstract' },
      { status: 500 }
    )
  }
}
