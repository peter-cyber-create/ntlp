import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = DatabaseManager.getInstance()
    
    // Get comprehensive statistics
    const [
      registrationsCount,
      contactsCount, 
      abstractsCount,
      speakersCount,
      sponsorshipsCount,
      paymentStats,
      registrationTypes,
      recentRegistrations,
      recentAbstracts,
      recentContacts
    ] = await Promise.all([
      db.executeOne('SELECT COUNT(*) as count FROM registrations'),
      db.executeOne('SELECT COUNT(*) as count FROM contacts'),
      db.executeOne('SELECT COUNT(*) as count FROM abstracts'),
      db.executeOne('SELECT COUNT(*) as count FROM speakers'),
      db.executeOne('SELECT COUNT(*) as count FROM sponsorships'),
      db.execute(`
        SELECT 
          payment_status,
          COUNT(*) as count,
          SUM(payment_amount) as total_amount,
          payment_currency
        FROM registrations 
        GROUP BY payment_status, payment_currency
      `),
      db.execute(`
        SELECT 
          registrationType,
          COUNT(*) as count
        FROM registrations 
        GROUP BY registrationType
        ORDER BY count DESC
      `),
      db.execute(`
        SELECT 
          firstName, lastName, email, registrationType, 
          payment_amount, payment_currency, createdAt
        FROM registrations 
        ORDER BY createdAt DESC 
        LIMIT 10
      `),
      db.execute(`
        SELECT 
          title, corresponding_author_email, status, track, createdAt
        FROM abstracts 
        ORDER BY createdAt DESC 
        LIMIT 10
      `),
      db.execute(`
        SELECT 
          name, email, subject, status, priority, createdAt
        FROM contacts 
        ORDER BY createdAt DESC 
        LIMIT 10
      `)
    ])

    const stats = {
      registrations: {
        total: registrationsCount?.count || 0,
        pending: 0, // Calculate based on status
        approved: 0,
        newThisWeek: 0
      },
      contacts: {
        total: contactsCount?.count || 0,
        new: 0,
        responded: 0,
        newThisWeek: 0
      },
      abstracts: {
        total: abstractsCount?.count || 0,
        pending: 0,
        accepted: 0,
        newThisWeek: 0
      },
      speakers: {
        total: speakersCount?.count || 0,
        keynotes: 0,
        approved: 0
      },
      sponsorships: {
        total: sponsorshipsCount?.count || 0,
        pending: 0,
        approved: 0
      },
      revenue: {
        total: 0,
        currency: 'UGX'
      },
      paymentBreakdown: paymentStats || [],
      registrationTypes: registrationTypes || [],
      recentRegistrations: recentRegistrations || [],
      recentAbstracts: recentAbstracts || [],
      recentContacts: recentContacts || []
    }
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
