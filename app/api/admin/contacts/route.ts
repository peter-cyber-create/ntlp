import { NextRequest, NextResponse } from 'next/server'
import DataManager from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const db = DataManager.getInstance()
    const contacts = db.getContactSubmissions()
    
    return NextResponse.json({
      success: true,
      contacts
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = DataManager.getInstance()
    
    const newContact = db.addContactSubmission(body)
    
    return NextResponse.json({
      success: true,
      contact: newContact
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}
