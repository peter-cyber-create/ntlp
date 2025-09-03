import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    const abstracts = db.getSpeakerApplications() // Using speaker applications as abstracts for now
    
    // Transform speaker applications to abstract format
    const transformedAbstracts = abstracts.map(speaker => ({
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
    }))
    
    return NextResponse.json({
      success: true,
      abstracts: transformedAbstracts
    })
  } catch (error) {
    console.error('Error fetching abstracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abstracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DataManager.getInstance()
    
    // For now, we'll add as a speaker application
    const newAbstract = db.addSpeakerApplication({
      name: body.author,
      email: body.email,
      title: body.title,
      organization: body.organization,
      bio: body.abstract,
      expertise: body.keywords || []
    })
    
    return NextResponse.json({
      success: true,
      abstract: newAbstract
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating abstract:', error)
    return NextResponse.json(
      { error: 'Failed to create abstract' },
      { status: 500 }
    )
  }
}
