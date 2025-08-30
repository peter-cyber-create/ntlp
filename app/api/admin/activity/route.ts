import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = DatabaseManager.getInstance()
    
    // Get recent activities from multiple tables
    const activities = await Promise.all([
      // Recent registrations
      db.execute(`
        SELECT 'registration' as type, id, firstName as name, lastName, email, status, createdAt as activity_date
        FROM registrations 
        ORDER BY createdAt DESC 
        LIMIT 5
      `),
      
      // Recent abstracts
      db.execute(`
        SELECT 'abstract' as type, id, title as name, '' as lastName, corresponding_author_email as email, status, createdAt as activity_date
        FROM abstracts 
        ORDER BY createdAt DESC 
        LIMIT 5
      `),
      
      // Recent contacts
      db.execute(`
        SELECT 'contact' as type, id, name, '' as lastName, email, status, createdAt as activity_date
        FROM contacts 
        ORDER BY createdAt DESC 
        LIMIT 5
      `),
      
      // Recent sponsorships
      db.execute(`
        SELECT 'sponsorship' as type, id, company_name as name, '' as lastName, email, status, createdAt as activity_date
        FROM sponsorships 
        ORDER BY createdAt DESC 
        LIMIT 5
      `)
    ])
    
    // Combine and sort all activities
    const allActivities = activities
      .flat()
      .sort((a: any, b: any) => new Date(b.activity_date) - new Date(a.activity_date))
      .slice(0, 20)
    
    return NextResponse.json({
      success: true,
      activities: allActivities,
      count: allActivities.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch activities',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
