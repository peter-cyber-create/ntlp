import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = DatabaseManager.getInstance();
  
  try {
    const abstracts = await db.execute(`
      SELECT 
        id,
        title,
        abstract,
        keywords,
        category,
        authors,
        email,
        institution,
        phone,
        fileName,
        filePath,
        fileSize,
        status,
        reviewComments,
        createdAt,
        updatedAt
      FROM abstracts 
      ORDER BY createdAt DESC
    `);
    
    return NextResponse.json({
      success: true,
      data: abstracts,
      count: abstracts.length
    });
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch abstracts' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields to match database structure
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const keywords = formData.get('keywords') as string;
    const category = formData.get('category') as string;
    const authors = formData.get('authors') as string;
    const email = formData.get('email') as string;
    const institution = formData.get('institution') as string;
    const phone = formData.get('phone') as string;
    
    const file = formData.get('file') as File;

    // Validate required fields
    const requiredFields = {
      title,
      abstract,
      category,
      authors,
      email,
      institution
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields',
        missingFields 
      }, { status: 400 });
    }

    // Validate enum values
    const validCategories = ['research', 'case-study', 'review', 'policy'];

    if (!validCategories.includes(category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        validCategories
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    const db = DatabaseManager.getInstance();

    // Check for duplicate submission by same author with same title
    const existingAbstract = await db.executeOne(
      'SELECT id FROM abstracts WHERE email = ? AND title = ?',
      [email, title]
    );

    if (existingAbstract) {
      return NextResponse.json({
        success: false,
        error: 'Abstract with this title already submitted by this author'
      }, { status: 409 });
    }

    // Handle file upload
    let fileName = null;
    let filePath = null;
    let fileSize = null;
    
    if (file && file.size > 0) {
      const timestamp = Date.now();
      const authorSlug = authors.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const fileExtension = path.extname(file.name);
      fileName = `abstract_${timestamp}_${authorSlug}${fileExtension}`;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
      filePath = path.join(uploadDir, fileName);
      fileSize = file.size;
      
      // Ensure upload directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
      
      await writeFile(filePath, buffer);
      
      // Store relative path for database
      filePath = `/uploads/abstracts/${fileName}`;
    }

    // Insert the abstract
    const result = await db.execute(`
      INSERT INTO abstracts (
        title, abstract, keywords, category, authors, email, institution, phone,
        fileName, filePath, fileSize, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `, [
      title, abstract, keywords, category, authors, email, institution, phone,
      fileName || 'no-file', filePath || null, fileSize || 0
    ]) as any;

    return NextResponse.json({ 
      success: true,
      message: 'Abstract submitted successfully',
      data: {
        id: result.insertId || Date.now(),
        title,
        email,
        category,
        authors,
        status: 'pending',
        submitted_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting abstract:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit abstract',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const db = DatabaseManager.getInstance();
  
  try {
    const { id, status, review_comments, reviewer_id } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: id and status' 
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'under_review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status',
        validStatuses
      }, { status: 400 });
    }

    // Update abstract status
    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (review_comments) {
      updateFields.push('review_comments = ?');
      updateValues.push(review_comments);
    }

    if (reviewer_id) {
      updateFields.push('reviewer_id = ?');
      updateValues.push(reviewer_id);
    }

    if (status !== 'pending') {
      updateFields.push('reviewed_at = NOW()');
    }

    updateValues.push(id);

    await db.execute(
      `UPDATE abstracts SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({ 
      success: true,
      message: 'Abstract updated successfully' 
    });
  } catch (error) {
    console.error('Error updating abstract:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update abstract' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const db = DatabaseManager.getInstance();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing abstract ID' 
      }, { status: 400 });
    }

    // Get abstract info before deletion (for file cleanup)
    const abstract = await db.executeOne(
      'SELECT file_path FROM abstracts WHERE id = ?',
      [id]
    );

    // Delete the abstract
    await db.execute('DELETE FROM abstracts WHERE id = ?', [id]);

    // TODO: Add file cleanup if needed
    // if (abstract?.file_path) {
    //   // Delete physical file
    // }
    
    return NextResponse.json({ 
      success: true,
      message: 'Abstract deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting abstract:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete abstract' 
    }, { status: 500 });
  }
}
