import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = DatabaseManager.getInstance()
    
    // Get pending items from multiple tables
    const pendingData = await Promise.all([
      // Pending contacts
      db.execute(`
        SELECT 'contact' as type, id, name, email, subject, status, priority, createdAt as date
        FROM contacts 
        WHERE status IN ('submitted', 'under_review', 'requires_followup')
        ORDER BY 
          CASE 
            WHEN priority = 'urgent' THEN 1
            WHEN priority = 'high' THEN 2
            WHEN priority = 'normal' THEN 3
            WHEN priority = 'low' THEN 4
          END,
          createdAt DESC
        LIMIT 10
      `),
      
      // Pending abstracts
      db.execute(`
        SELECT 'abstract' as type, id, title as name, corresponding_author_email as email, track as subject, status, createdAt as date
        FROM abstracts 
        WHERE status IN ('submitted', 'under_review', 'revision_required')
        ORDER BY createdAt DESC
        LIMIT 10
      `),
      
      // Pending registrations
      db.execute(`
        SELECT 'registration' as type, id, CONCAT(firstName, ' ', lastName) as name, email, registrationType as subject, status, createdAt as date
        FROM registrations 
        WHERE status IN ('submitted', 'under_review')
        ORDER BY createdAt DESC
        LIMIT 10
      `),
      
      // Pending sponsorships
      db.execute(`
        SELECT 'sponsorship' as type, id, company_name as name, email, selected_package as subject, status, createdAt as date
        FROM sponsorships 
        WHERE status IN ('submitted', 'under_review', 'negotiating')
        ORDER BY createdAt DESC
        LIMIT 10
      `)
    ])

    const [pendingContacts, pendingAbstracts, pendingRegistrations, pendingSponsorships] = pendingData
    
    return NextResponse.json({
      success: true,
      pending: {
        contacts: pendingContacts || [],
        abstracts: pendingAbstracts || [],
        registrations: pendingRegistrations || [],
        sponsorships: pendingSponsorships || []
      },
      counts: {
        contacts: (pendingContacts || []).length,
        abstracts: (pendingAbstracts || []).length,
        registrations: (pendingRegistrations || []).length,
        sponsorships: (pendingSponsorships || []).length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching pending items:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch pending items',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
