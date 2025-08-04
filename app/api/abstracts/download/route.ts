import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import DatabaseManager from '@/lib/mysql';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filename = searchParams.get('filename');
    const id = searchParams.get('id');

    if (!filename && !id) {
      return NextResponse.json({ error: 'Missing filename or id parameter' }, { status: 400 });
    }

    let targetFilename = filename;
    let downloadFilename = filename;
    let abstractData = null;

    // If we have an ID, look up the abstract in the database
    if (id) {
      const db = DatabaseManager.getInstance();
      const abstracts = await db.execute(`
        SELECT id, title, authors, fileName
        FROM abstracts 
        WHERE id = ?
        LIMIT 1
      `, [id]);

      if (abstracts.length > 0) {
        abstractData = abstracts[0];
        targetFilename = abstractData.fileName;
      }
    } else if (filename) {
      // If only filename provided, try to find the abstract by filename
      const db = DatabaseManager.getInstance();
      const abstracts = await db.execute(`
        SELECT id, title, authors, fileName
        FROM abstracts 
        WHERE fileName = ?
        LIMIT 1
      `, [filename]);

      if (abstracts.length > 0) {
        abstractData = abstracts[0];
      }
    }

    // Create a professional filename if we have abstract data
    if (abstractData && targetFilename) {
      const authorName = abstractData.authors ? abstractData.authors.split(',')[0].trim() : 'Unknown';
      const title = abstractData.title ? abstractData.title.substring(0, 30).replace(/[^a-zA-Z0-9\s]/g, '').trim() : 'Abstract';
      const fileExt = path.extname(targetFilename);
      
      // Format: "AuthorName - AbstractTitle.pdf"
      downloadFilename = `${authorName} - ${title}${fileExt}`;
    }

    if (!targetFilename) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Check both possible upload locations
    const possiblePaths = [
      path.join(process.cwd(), 'uploads', 'abstracts', targetFilename),
      path.join(process.cwd(), 'public', 'uploads', 'abstracts', targetFilename)
    ];

    let filePath = '';
    let fileBuffer: Buffer;

    // Try to find the file in possible locations
    for (const possiblePath of possiblePaths) {
      try {
        fileBuffer = await readFile(possiblePath);
        filePath = possiblePath;
        break;
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    if (!filePath || !fileBuffer!) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Determine content type based on file extension
    const ext = targetFilename ? path.extname(targetFilename).toLowerCase() : '.pdf';
    const contentType = ext === '.pdf' ? 'application/pdf' : 
                       ext === '.doc' ? 'application/msword' :
                       ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                       'application/octet-stream';

    // Return the file with appropriate headers and professional filename
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading abstract:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
