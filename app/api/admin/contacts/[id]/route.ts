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
      const updatedContact = db.updateContactStatus(id, body.status)
      
      if (!updatedContact) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        contact: updatedContact
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
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
    const contacts = db.getContactSubmissions()
    
    const contact = contacts.find(c => c.id === id)
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      contact
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}
