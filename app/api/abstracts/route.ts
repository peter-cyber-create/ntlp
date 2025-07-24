import { NextRequest, NextResponse } from 'next/server';
import DatabaseManager from '@/lib/mysql';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const db = DatabaseManager.getInstance();
  
  try {
    const abstracts = await db.execute('SELECT * FROM abstracts ORDER BY created_at DESC');
    return NextResponse.json(abstracts);
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return NextResponse.json({ error: 'Failed to fetch abstracts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const db = DatabaseManager.getInstance();
  
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const institution = formData.get('institution') as string;
    const country = formData.get('country') as string;
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const file = formData.get('file') as File;

    if (!firstName || !lastName || !email || !title || !abstract) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let fileName = null;
    
    if (file && file.size > 0) {
      const timestamp = Date.now();
      const lastNameSlug = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fileExtension = path.extname(file.name);
      fileName = `abstract_${timestamp}_${lastNameSlug}${fileExtension}`;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
    }

    const [result] = await db.execute(
      `INSERT INTO abstracts (first_name, last_name, email, institution, country, title, abstract, file_name, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [firstName, lastName, email, institution, country, title, abstract, fileName]
    ) as any;

    return NextResponse.json({ 
      message: 'Abstract submitted successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error submitting abstract:', error);
    return NextResponse.json({ error: 'Failed to submit abstract' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const db = DatabaseManager.getInstance();
  
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.execute(
      'UPDATE abstracts SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ message: 'Abstract status updated successfully' });
  } catch (error) {
    console.error('Error updating abstract:', error);
    return NextResponse.json({ error: 'Failed to update abstract' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const db = DatabaseManager.getInstance();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing abstract ID' }, { status: 400 });
    }

    await db.execute('DELETE FROM abstracts WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Abstract deleted successfully' });
  } catch (error) {
    console.error('Error deleting abstract:', error);
    return NextResponse.json({ error: 'Failed to delete abstract' }, { status: 500 });
  }
}
