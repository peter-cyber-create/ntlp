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
        abstract_text,
        keywords,
        category,
        presentation_type,
        primary_author_first_name,
        primary_author_last_name,
        primary_author_email,
        primary_author_institution,
        primary_author_department,
        primary_author_position,
        primary_author_phone,
        primary_author_country,
        file_name,
        file_path,
        file_size,
        file_type,
        status,
        review_comments,
        conflict_of_interest,
        funding_source,
        ethical_approval,
        submitted_at,
        created_at
      FROM abstracts 
      ORDER BY submitted_at DESC
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
  const db = DatabaseManager.getInstance();
  
  try {
    const formData = await request.formData();
    
    // Extract all required fields according to new schema
    const title = formData.get('title') as string;
    const abstract_text = formData.get('abstract_text') as string;
    const keywords = formData.get('keywords') as string;
    const category = formData.get('category') as string;
    const presentation_type = formData.get('presentation_type') as string;
    
    // Primary author information
    const primary_author_first_name = formData.get('primary_author_first_name') as string;
    const primary_author_last_name = formData.get('primary_author_last_name') as string;
    const primary_author_email = formData.get('primary_author_email') as string;
    const primary_author_institution = formData.get('primary_author_institution') as string;
    const primary_author_department = formData.get('primary_author_department') as string;
    const primary_author_position = formData.get('primary_author_position') as string;
    const primary_author_phone = formData.get('primary_author_phone') as string;
    const primary_author_country = formData.get('primary_author_country') as string || 'Uganda';
    
    // Optional metadata
    const conflict_of_interest = formData.get('conflict_of_interest') as string;
    const funding_source = formData.get('funding_source') as string;
    const ethical_approval = formData.get('ethical_approval') === 'true';
    
    const file = formData.get('file') as File;

    // Validate required fields
    const requiredFields = {
      title,
      abstract_text,
      category,
      presentation_type,
      primary_author_first_name,
      primary_author_last_name,
      primary_author_email,
      primary_author_institution
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
    const validCategories = ['communicable_diseases', 'non_communicable_diseases', 'health_systems', 'digital_health', 'research_methodology'];
    const validPresentationTypes = ['oral', 'poster'];

    if (!validCategories.includes(category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        validCategories
      }, { status: 400 });
    }

    if (!validPresentationTypes.includes(presentation_type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid presentation type',
        validPresentationTypes
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(primary_author_email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Check for duplicate submission by same author with same title
    const existingAbstract = await db.executeOne(
      'SELECT id FROM abstracts WHERE primary_author_email = ? AND title = ?',
      [primary_author_email, title]
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
    let fileType = null;
    
    if (file && file.size > 0) {
      const timestamp = Date.now();
      const lastNameSlug = primary_author_last_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fileExtension = path.extname(file.name);
      fileName = `abstract_${timestamp}_${lastNameSlug}${fileExtension}`;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
      filePath = path.join(uploadDir, fileName);
      fileSize = file.size;
      fileType = file.type;
      
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
        title, abstract_text, keywords, category, presentation_type,
        primary_author_first_name, primary_author_last_name, primary_author_email,
        primary_author_institution, primary_author_department, primary_author_position,
        primary_author_phone, primary_author_country,
        file_name, file_path, file_size, file_type,
        conflict_of_interest, funding_source, ethical_approval,
        status, submitted_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `, [
      title, abstract_text, keywords, category, presentation_type,
      primary_author_first_name, primary_author_last_name, primary_author_email,
      primary_author_institution, primary_author_department, primary_author_position,
      primary_author_phone, primary_author_country,
      fileName, filePath, fileSize, fileType,
      conflict_of_interest, funding_source, ethical_approval
    ]) as any;

    return NextResponse.json({ 
      success: true,
      message: 'Abstract submitted successfully',
      data: {
        id: result.insertId || Date.now(),
        title,
        primary_author_email,
        category,
        presentation_type,
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
