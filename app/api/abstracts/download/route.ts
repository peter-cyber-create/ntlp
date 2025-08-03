import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const id = searchParams.get('id');

    if (!filename && !id) {
      return NextResponse.json({ error: 'Missing filename or id parameter' }, { status: 400 });
    }

    // If we have an ID, we would normally look it up in the database
    // For now, we'll use the filename directly
    const targetFilename = filename || `abstract_${id}.pdf`;
    
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
    const ext = path.extname(targetFilename).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 
                       ext === '.doc' ? 'application/msword' :
                       ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                       'application/octet-stream';

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${targetFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading abstract:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
