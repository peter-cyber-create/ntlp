import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '../../../lib/mysql';

export const dynamic = 'force-dynamic';

// Sponsorship packages with pricing
const SPONSORSHIP_PACKAGES = {
  bronze: { 
    amount: 2000, 
    currency: 'USD', 
    name: 'Bronze Sponsor',
    benefits: [
      'Logo on conference website',
      'Logo on conference materials',
      'Mention in social media',
      '2 complimentary registrations'
    ]
  },
  silver: { 
    amount: 5000, 
    currency: 'USD', 
    name: 'Silver Sponsor',
    benefits: [
      'All Bronze benefits',
      'Logo on conference banners',
      'Exhibition booth space',
      '4 complimentary registrations',
      'Promotional materials in welcome bags'
    ]
  },
  gold: { 
    amount: 10000, 
    currency: 'USD', 
    name: 'Gold Sponsor',
    benefits: [
      'All Silver benefits',
      'Speaking opportunity (5 minutes)',
      'Premium booth location',
      '6 complimentary registrations',
      'Logo on lanyards/badges'
    ]
  },
  platinum: { 
    amount: 20000, 
    currency: 'USD', 
    name: 'Platinum Sponsor',
    benefits: [
      'All Gold benefits',
      'Keynote speaking slot (15 minutes)',
      'Branded coffee break',
      '10 complimentary registrations',
      'Co-branding on conference signage'
    ]
  },
  diamond: { 
    amount: 50000, 
    currency: 'USD', 
    name: 'Diamond Sponsor',
    benefits: [
      'All Platinum benefits',
      'Exclusive networking reception',
      'Conference app branding',
      '15 complimentary registrations',
      'Custom sponsorship opportunities'
    ]
  }
};

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get all sponsorships
    const sponsorships = await db.execute(`
      SELECT 
        id, company_name, contact_person, email, phone, 
        package_type, amount, currency, status, 
        payment_status, payment_reference, website, 
        industry, special_requirements, created_at, updated_at
      FROM sponsorships 
      ORDER BY created_at DESC
    `);
    
    // Get statistics
    const statsQueries = await Promise.all([
      db.executeOne('SELECT COUNT(*) as total FROM sponsorships'),
      db.executeOne('SELECT COUNT(*) as confirmed FROM sponsorships WHERE status = "confirmed"'),
      db.executeOne('SELECT COUNT(*) as pending FROM sponsorships WHERE status = "pending"'),
      db.executeOne('SELECT SUM(amount) as total_amount FROM sponsorships WHERE payment_status = "completed"'),
      db.execute(`
        SELECT package_type, COUNT(*) as count, SUM(amount) as total_amount
        FROM sponsorships 
        WHERE status = "confirmed"
        GROUP BY package_type
      `)
    ]);
    
    const stats = {
      total: statsQueries[0]?.total || 0,
      confirmed: statsQueries[1]?.confirmed || 0,
      pending: statsQueries[2]?.pending || 0,
      totalRevenue: statsQueries[3]?.total_amount || 0,
      byPackage: {} as any
    };
    
    // Process package stats
    statsQueries[4].forEach((row: any) => {
      stats.byPackage[row.package_type] = {
        count: row.count,
        totalAmount: row.total_amount
      };
    });

    return NextResponse.json({
      success: true,
      data: sponsorships,
      stats,
      packages: SPONSORSHIP_PACKAGES
    });

  } catch (error: any) {
    console.error('Sponsorship fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sponsorships'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactPerson,
      email,
      phone,
      packageType,
      website,
      industry,
      specialRequirements
    } = body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !packageType) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: companyName, contactPerson, email, packageType'
      }, { status: 400 });
    }

    // Validate package type
    if (!SPONSORSHIP_PACKAGES[packageType as keyof typeof SPONSORSHIP_PACKAGES]) {
      return NextResponse.json({
        success: false,
        error: 'Invalid sponsorship package type'
      }, { status: 400 });
    }

    const packageInfo = SPONSORSHIP_PACKAGES[packageType as keyof typeof SPONSORSHIP_PACKAGES];

    const db = DatabaseManager.getInstance();

    // Check if company already has an active sponsorship
    const existingSponsorship = await db.executeOne(
      'SELECT id FROM sponsorships WHERE email = ? AND status != "cancelled"',
      [email]
    );

    if (existingSponsorship) {
      return NextResponse.json({
        success: false,
        error: 'Company already has an active sponsorship application'
      }, { status: 400 });
    }

    // Insert new sponsorship
    const sponsorshipResult = await db.execute(
      `INSERT INTO sponsorships (
        company_name, contact_person, email, phone, package_type,
        amount, currency, website, industry, special_requirements,
        status, payment_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', NOW(), NOW())`,
      [
        companyName,
        contactPerson,
        email,
        phone || null,
        packageType,
        packageInfo.amount,
        packageInfo.currency,
        website || null,
        industry || null,
        specialRequirements || null
      ]
    );

    // Get the newly created sponsorship
    const newSponsorship = await db.executeOne(
      'SELECT * FROM sponsorships WHERE id = ?',
      [(sponsorshipResult as any).insertId]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: newSponsorship.id,
        companyName: newSponsorship.company_name,
        contactPerson: newSponsorship.contact_person,
        email: newSponsorship.email,
        packageType: newSponsorship.package_type,
        amount: newSponsorship.amount,
        currency: newSponsorship.currency,
        status: newSponsorship.status,
        packageInfo: packageInfo
      },
      message: 'Sponsorship application submitted successfully'
    });

  } catch (error: any) {
    console.error('Sponsorship creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit sponsorship application'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Sponsorship ID is required'
      }, { status: 400 });
    }

    const db = DatabaseManager.getInstance();

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (paymentStatus) {
      updates.push('payment_status = ?');
      values.push(paymentStatus);
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No fields to update'
      }, { status: 400 });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await db.execute(
      `UPDATE sponsorships SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Sponsorship updated successfully'
    });

  } catch (error: any) {
    console.error('Sponsorship update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update sponsorship'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({
        success: false,
        error: 'Sponsorship IDs are required'
      }, { status: 400 });
    }

    const db = DatabaseManager.getInstance();
    const idArray = ids.split(',').map(id => id.trim());

    // Delete sponsorships
    const placeholders = idArray.map(() => '?').join(',');
    const deleteResult = await db.execute(
      `DELETE FROM sponsorships WHERE id IN (${placeholders})`,
      idArray
    );

    return NextResponse.json({
      success: true,
      message: `${(deleteResult as any).affectedRows || idArray.length} sponsorship(s) deleted successfully`
    });

  } catch (error: any) {
    console.error('Sponsorship deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete sponsorships'
    }, { status: 500 });
  }
}
