import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { connectToMongoose } from '@/lib/mongodb';
import { Abstract } from '@/lib/models';

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

    await connectToMongoose();
    
    let abstract;
    if (id) {
      abstract = await Abstract.findById(id);
    } else if (filename) {
      abstract = await Abstract.findOne({ fileName: filename });
    }

    if (!abstract) {
      return NextResponse.json(
        { success: false, message: 'Abstract not found' },
        { status: 404 }
      );
    }

    // Construct the file path
    const uploadsDir = path.join(process.cwd(), 'uploads', 'abstracts');
    const filePath = path.join(uploadsDir, abstract.fileName);

    try {
      const fileBuffer = await readFile(filePath);
      
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
    } catch (fileError) {
      console.error('Error reading file:', fileError);
      return NextResponse.json(
        { success: false, message: 'File not found on server' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error downloading abstract:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download abstract' },
      { status: 500 }
    );
  }
}
