import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const filename = searchParams.get('filename');

    if (!id && !filename) {
      return NextResponse.json(
        { success: false, message: 'Abstract ID or filename is required' },
        { status: 400 }
      );
    }

    const db = DatabaseManager.getInstance();
    
    let abstract;
    if (id) {
      abstract = await db.executeOne(
        'SELECT * FROM abstracts WHERE id = ?',
        [id]
      );
    } else if (filename) {
      abstract = await db.executeOne(
        'SELECT * FROM abstracts WHERE fileName = ?',
        [filename]
      );
    }

    if (!abstract) {
      return NextResponse.json(
        { success: false, message: 'Abstract not found' },
        { status: 404 }
      );
    }

    // Construct the file path - try multiple locations for compatibility
    const uploadsDir = path.join(process.cwd(), 'uploads', 'abstracts');
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
    
    let filePath = path.join(uploadsDir, abstract.fileName);
    let fileBuffer;

    try {
      // Try primary uploads directory first
      fileBuffer = await readFile(filePath);
    } catch (primaryError) {
      try {
        // Fallback to public uploads directory
        filePath = path.join(publicUploadsDir, abstract.fileName);
        fileBuffer = await readFile(filePath);
      } catch (fallbackError) {
        console.error('File not found in either location:', { primaryError, fallbackError });
        return NextResponse.json(
          { success: false, message: 'File not found on server' },
          { status: 404 }
        );
      }
    }
      
    // Get file extension to determine content type
    const ext = path.extname(abstract.fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${abstract.fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading abstract:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download abstract' },
      { status: 500 }
    );
  }
}
