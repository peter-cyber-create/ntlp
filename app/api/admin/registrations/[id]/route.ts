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
      const updatedRegistration = db.updateRegistrationStatus(id, body.status)
      
      if (!updatedRegistration) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        registration: updatedRegistration
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
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
    const registrations = db.getRegistrations()
    
    const registration = registrations.find(reg => reg.id === id)
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      registration
    })
  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    )
  }
}
