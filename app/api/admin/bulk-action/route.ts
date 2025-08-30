import { NextRequest, NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/dataManager'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, ids, entityType } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'IDs array is required' },
        { status: 400 }
      )
    }
    
    if (!['approve', 'reject', 'mark_reviewed', 'assign_priority', 'add_notes'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }
    
    const db = DatabaseManager.getInstance()
    const placeholders = ids.map(() => '?').join(',')
    let updateQuery = ''
    let params: any[] = []
    
    switch (action) {
      case 'approve':
        updateQuery = `UPDATE ${entityType} SET status = 'approved', updated_at = NOW() WHERE id IN (${placeholders})`
        params = ids
        break
      case 'reject':
        updateQuery = `UPDATE ${entityType} SET status = 'rejected', updated_at = NOW() WHERE id IN (${placeholders})`
        params = ids
        break
      case 'mark_reviewed':
        updateQuery = `UPDATE ${entityType} SET status = 'under_review', updated_at = NOW() WHERE id IN (${placeholders})`
        params = ids
        break
      case 'assign_priority':
        updateQuery = `UPDATE ${entityType} SET priority = ?, updated_at = NOW() WHERE id IN (${placeholders})`
        params = ['high', ...ids]
        break
      case 'add_notes':
        updateQuery = `UPDATE ${entityType} SET admin_notes = ?, updated_at = NOW() WHERE id IN (${placeholders})`
        params = ['Admin action performed', ...ids]
        break
    }
    
    const result = await db.execute(updateQuery, params)
    
    return NextResponse.json({
      success: true,
      message: `Bulk action completed successfully`,
      updatedCount: result.length
    })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to perform bulk action',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
