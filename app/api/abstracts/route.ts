import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PerformanceMonitor } from '@/lib/performance';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = DatabaseManager.getInstance();
    
    // Get abstracts with pagination
    const abstracts = await db.execute(`
      SELECT 
        id,
        title,
        category,
        presentation_type as presentationType,
        status,
        submitted_at as submittedAt,
        file_name as fileName,
        file_path as filePath,
        file_size as fileSize,
        file_type as fileType,
        primary_author_first_name,
        primary_author_last_name,
        primary_author_email,
        primary_author_affiliation,
        primary_author_phone,
        primary_author_position,
        primary_author_district,
        abstract_text as abstract,
        keywords,
        objectives,
        methodology,
        results,
        conclusions,
        conflict_of_interest as conflictOfInterest,
        consent_to_publish as consentToPublish,
        review_comments as reviewComments,
        reviewed_at as reviewedAt
      FROM abstracts 
      ORDER BY submitted_at DESC 
      LIMIT 50
    `);
    
    // Get stats
    const statsQueries = await Promise.all([
      db.executeOne('SELECT COUNT(*) as total FROM abstracts'),
      db.executeOne('SELECT COUNT(*) as pending FROM abstracts WHERE status = ?', ['pending']),
      db.executeOne('SELECT COUNT(*) as accepted FROM abstracts WHERE status = ?', ['accepted']),
      db.executeOne('SELECT COUNT(*) as rejected FROM abstracts WHERE status = ?', ['rejected']),
      db.execute(`
        SELECT presentation_type, COUNT(*) as count 
        FROM abstracts 
        GROUP BY presentation_type
      `),
      db.execute(`
        SELECT category, COUNT(*) as count 
        FROM abstracts 
        GROUP BY category
      `)
    ]);
    
    const stats = {
      total: statsQueries[0]?.total || 0,
      pending: statsQueries[1]?.pending || 0,
      accepted: statsQueries[2]?.accepted || 0,
      rejected: statsQueries[3]?.rejected || 0,
      byType: {} as any,
      byCategory: {} as any
    };
    
    // Process type stats
    statsQueries[4].forEach((row: any) => {
      stats.byType[row.presentation_type] = row.count;
    });
    
    // Process category stats
    statsQueries[5].forEach((row: any) => {
      stats.byCategory[row.category] = row.count;
    });
    
    // Transform abstracts to match frontend expectations
    const transformedAbstracts = abstracts.map((abstract: any) => ({
      _id: abstract.id,
      title: abstract.title,
      category: abstract.category,
      presentationType: abstract.presentationType,
      status: abstract.status,
      submittedAt: abstract.submittedAt,
      fileName: abstract.fileName,
      filePath: abstract.filePath,
      fileSize: abstract.fileSize,
      fileType: abstract.fileType,
      primaryAuthor: {
        firstName: abstract.primary_author_first_name,
        lastName: abstract.primary_author_last_name,
        email: abstract.primary_author_email,
        affiliation: abstract.primary_author_affiliation,
        phone: abstract.primary_author_phone,
        position: abstract.primary_author_position,
        district: abstract.primary_author_district
      },
      abstract: abstract.abstract,
      keywords: abstract.keywords,
      objectives: abstract.objectives,
      methodology: abstract.methodology,
      results: abstract.results,
      conclusions: abstract.conclusions,
      conflictOfInterest: abstract.conflictOfInterest,
      consentToPublish: abstract.consentToPublish,
      reviewComments: abstract.reviewComments,
      reviewedAt: abstract.reviewedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedAbstracts,
      stats,
      count: transformedAbstracts.length
    });
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch abstracts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    PerformanceMonitor.start('abstract-submission-total');
    const db = DatabaseManager.getInstance();
    
    // Parse form data
    const formData = await PerformanceMonitor.measure('form-data-parsing', async () => {
      return await request.formData();
    });
    
    const file = formData.get('file') as File;
    const abstractDataString = formData.get('abstractData') as string;
    
    if (!file || !abstractDataString) {
      return NextResponse.json(
        { success: false, message: 'File and abstract data are required' },
        { status: 400 }
      );
    }
    
    const abstractData = JSON.parse(abstractDataString);
    
    // Validate required fields
    const requiredFields = [
      'title', 'category', 'abstract', 'keywords', 
      'objectives', 'methodology', 'results', 'conclusions'
    ];
    
    const authorRequiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'affiliation', 'position', 'district'
    ];
    
    const missingFields = requiredFields.filter(field => !abstractData[field]);
    const missingAuthorFields = authorRequiredFields.filter(
      field => !abstractData.primaryAuthor?.[field]
    );
    
    if (missingFields.length > 0 || missingAuthorFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          missingFields: [...missingFields, ...missingAuthorFields.map(f => `primaryAuthor.${f}`)]
        },
        { status: 400 }
      );
    }
    
    if (!abstractData.consentToPublish) {
      return NextResponse.json(
        { success: false, message: 'Consent to publish is required' },
        { status: 400 }
      );
    }
    
    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Only PDF and Word documents are allowed' },
        { status: 400 }
      );
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      return NextResponse.json(
        { success: false, message: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }
    
    // Check for duplicate email
    const existingAbstract = await db.executeOne(
      'SELECT id FROM abstracts WHERE primary_author_email = ?',
      [abstractData.primaryAuthor.email]
    );
    
    if (existingAbstract) {
      return NextResponse.json(
        {
          success: false,
          message: 'An abstract has already been submitted with this email address'
        },
        { status: 409 }
      );
    }
    
    // Process file and create directories
    const [fileBuffer, uploadsDir] = await Promise.all([
      PerformanceMonitor.measure('file-processing', async () => {
        const bytes = await file.arrayBuffer();
        return Buffer.from(bytes);
      }),
      PerformanceMonitor.measure('directory-creation', async () => {
        const dir = path.join(process.cwd(), 'uploads', 'abstracts');
        const publicDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
        try {
          await Promise.all([
            mkdir(dir, { recursive: true }),
            mkdir(publicDir, { recursive: true })
          ]);
        } catch (error) {
          // Directory might already exist
        }
        return dir;
      })
    ]);
    
    // Generate unique filename and save file
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `abstract_${timestamp}_${abstractData.primaryAuthor.lastName.toLowerCase()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    const publicFilePath = path.join(process.cwd(), 'public', 'uploads', 'abstracts', fileName);
    
    // Save file and create database record
    await Promise.all([
      PerformanceMonitor.measure('file-save', async () => {
        await Promise.all([
          writeFile(filePath, fileBuffer),
          writeFile(publicFilePath, fileBuffer)
        ]);
      }),
      PerformanceMonitor.measure('database-save', async () => {
        await db.execute(`
          INSERT INTO abstracts (
            title, category, presentation_type, abstract_text, keywords, objectives,
            methodology, results, conclusions, conflict_of_interest, consent_to_publish,
            primary_author_first_name, primary_author_last_name, primary_author_email,
            primary_author_affiliation, primary_author_phone, primary_author_position,
            primary_author_district, file_name, file_path, file_size, file_type,
            status, submitted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
        `, [
          abstractData.title,
          abstractData.category,
          abstractData.presentationType || 'poster',
          abstractData.abstract,
          abstractData.keywords,
          abstractData.objectives,
          abstractData.methodology,
          abstractData.results,
          abstractData.conclusions,
          abstractData.conflictOfInterest || null,
          abstractData.consentToPublish ? 1 : 0,
          abstractData.primaryAuthor.firstName,
          abstractData.primaryAuthor.lastName,
          abstractData.primaryAuthor.email,
          abstractData.primaryAuthor.affiliation,
          abstractData.primaryAuthor.phone,
          abstractData.primaryAuthor.position,
          abstractData.primaryAuthor.district,
          fileName,
          filePath,
          file.size,
          file.type
        ]);
      })
    ]);
    
    PerformanceMonitor.end('abstract-submission-total');
    
    return NextResponse.json({
      success: true,
      message: 'Abstract submitted successfully',
      data: {
        title: abstractData.title,
        submittedAt: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    PerformanceMonitor.end('abstract-submission-total');
    console.error('Error creating abstract:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit abstract',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance();
    const { id, status, reviewComments } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Abstract ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, accepted, or rejected' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE abstracts 
      SET status = ?, review_comments = ?, reviewed_at = NOW()
      WHERE id = ?
    `;

    const result = await db.execute(updateQuery, [status, reviewComments || null, id]);

    return NextResponse.json({
      success: true,
      message: 'Abstract status updated successfully'
    });

  } catch (error) {
    console.error('Error updating abstract:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update abstract',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = DatabaseManager.getInstance();
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { success: false, message: 'Abstract IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',');
    const placeholders = idArray.map(() => '?').join(',');
    
    const result = await db.execute(
      `DELETE FROM abstracts WHERE id IN (${placeholders})`,
      idArray
    );

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${idArray.length} abstract(s)`,
      deletedCount: idArray.length
    });

  } catch (error) {
    console.error('Error deleting abstracts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete abstracts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
