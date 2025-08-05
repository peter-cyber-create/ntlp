#!/bin/bash

echo "🔧 Alternative Deployment Methods for Route Fix"
echo "=============================================="
echo ""

# Method 1: Try with different SSH options
echo "Method 1: Try SCP with verbose output and different options"
echo "scp -v -o PasswordAuthentication=yes app/api/abstracts/download/route.ts root@172.27.0.9:/var/www/ntlp-frontend/app/api/abstracts/download/"
echo ""

# Method 2: Create a text version of the fix
echo "Method 2: Manual copy via text file"
echo "Creating route-fix.txt with the complete fixed content..."

cat > route-fix.txt << 'EOF'
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

    // If id is provided, look up the abstract in database
    if (id && !filename) {
      const db = DatabaseManager.getInstance();
      const result = await db.query('SELECT fileName, title, authors FROM abstracts WHERE id = ?', [id]);
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'Abstract not found' }, { status: 404 });
      }

      const abstract = result[0];
      targetFilename = abstract.fileName;
      
      // Create a professional download filename
      const sanitizedTitle = abstract.title
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      
      const sanitizedAuthors = abstract.authors
        .split(',')[0]
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 20);
      
      const fileExtension = path.extname(targetFilename);
      downloadFilename = `${sanitizedAuthors}_${sanitizedTitle}${fileExtension}`;
    }

    // Construct file path - check both possible locations
    const uploadDir = path.join(process.cwd(), 'uploads', 'abstracts');
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', 'abstracts');
    
    let filePath = path.join(uploadDir, targetFilename);
    let fileExists = false;
    
    try {
      await readFile(filePath);
      fileExists = true;
    } catch {
      // Try the public uploads directory
      filePath = path.join(publicUploadDir, targetFilename);
      try {
        await readFile(filePath);
        fileExists = true;
      } catch {
        fileExists = false;
      }
    }

    if (!fileExists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Security check: ensure the file is within allowed directories
    const normalizedPath = path.resolve(filePath);
    const allowedDir1 = path.resolve(uploadDir);
    const allowedDir2 = path.resolve(publicUploadDir);
    
    if (!normalizedPath.startsWith(allowedDir1) && !normalizedPath.startsWith(allowedDir2)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Update download count if this was accessed by id
    if (id) {
      try {
        const db = DatabaseManager.getInstance();
        await db.query('UPDATE abstracts SET download_count = download_count + 1 WHERE id = ?', [id]);
      } catch (error) {
        console.error('Failed to update download count:', error);
      }
    }

    // Determine content type
    const ext = path.extname(targetFilename).toLowerCase();
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
      case '.txt':
        contentType = 'text/plain';
        break;
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading abstract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
EOF

echo "✅ Created route-fix.txt with complete fixed code"
echo ""

# Method 3: Show exact steps for manual copying
echo "Method 3: Manual Steps via SSH Terminal"
echo "1. SSH into the server:"
echo "   ssh root@172.27.0.9"
echo ""
echo "2. Navigate to the file location:"
echo "   cd /var/www/ntlp-frontend/app/api/abstracts/download/"
echo ""
echo "3. Backup the current file:"
echo "   cp route.ts route.ts.backup"
echo ""
echo "4. Edit the file:"
echo "   nano route.ts"
echo ""
echo "5. Replace the content with the content from route-fix.txt"
echo ""
echo "6. Save and rebuild:"
echo "   cd /var/www/ntlp-frontend"
echo "   npm run build"
echo "   pm2 restart ntlp-frontend"
echo ""

# Method 4: Try using fresh-deploy script
echo "Method 4: Use Fresh Deploy Script (if you can resolve SSH access)"
echo "./fresh-deploy.sh"
echo ""

echo "📋 Key Changes Needed:"
echo "  - Line 7: Add 'export const dynamic = \"force-dynamic\";'"
echo "  - Line 11: Change to 'const { searchParams } = request.nextUrl;'"
echo "  - Remove any usage of 'new URL(request.url)'"
echo ""
echo "🎯 This will fix the build error and allow all 15/15 pages to generate successfully."
