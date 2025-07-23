import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import { Abstract } from '@/lib/models';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PerformanceMonitor } from '@/lib/performance';

export async function GET() {
  try {
    await connectToMongoose();
    
    const abstracts = await Abstract.find({})
      .sort({ submittedAt: -1 })
      .limit(50);
    
    const stats = {
      total: await Abstract.countDocuments(),
      pending: await Abstract.countDocuments({ status: 'pending' }),
      accepted: await Abstract.countDocuments({ status: 'accepted' }),
      rejected: await Abstract.countDocuments({ status: 'rejected' }),
      byType: {
        oral: await Abstract.countDocuments({ presentationType: 'oral' }),
        poster: await Abstract.countDocuments({ presentationType: 'poster' })
      },
      byCategory: {}
    };
    
    return NextResponse.json({
      success: true,
      data: abstracts,
      stats,
      count: abstracts.length
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
    
    // Connect to database with performance monitoring
    await PerformanceMonitor.measure('database-connection', async () => {
      await connectToMongoose();
    });
    
    // Parse form data
    const formData = await PerformanceMonitor.measure('form-data-parsing', async () => {
      return await request.formData();
    });
    
    const abstractDataString = formData.get('abstractData') as string;
    const file = formData.get('abstractFile') as File;
    
    if (!abstractDataString) {
      return NextResponse.json(
        { success: false, message: 'Abstract data is required' },
        { status: 400 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Abstract file is required' },
        { status: 400 }
      );
    }
    
    const abstractData = JSON.parse(abstractDataString);
    
    // Validate required fields (fast operation)
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
    
    // Validate file (fast operation)
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
    
    // Parallel operations to improve performance
    const [existingAbstract, fileBuffer, uploadsDir] = await Promise.all([
      // Check if email already exists
      PerformanceMonitor.measure('duplicate-check', async () => {
        return await Abstract.findOne({ 
          'primaryAuthor.email': abstractData.primaryAuthor.email 
        }).select('_id').lean(); // Use lean() for better performance
      }),
      
      // Process file in parallel
      PerformanceMonitor.measure('file-processing', async () => {
        const bytes = await file.arrayBuffer();
        return Buffer.from(bytes);
      }),
      
      // Create uploads directory in parallel
      PerformanceMonitor.measure('directory-creation', async () => {
        const dir = path.join(process.cwd(), 'uploads', 'abstracts');
        try {
          await mkdir(dir, { recursive: true });
        } catch (error) {
          // Directory might already exist
        }
        return dir;
      })
    ]);
    
    if (existingAbstract) {
      return NextResponse.json(
        {
          success: false,
          message: 'An abstract has already been submitted with this email address'
        },
        { status: 409 }
      );
    }
    
    // Generate unique filename and save file
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `abstract_${timestamp}_${abstractData.primaryAuthor.lastName.toLowerCase()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Save file and create database record in parallel
    const [, savedAbstract] = await Promise.all([
      PerformanceMonitor.measure('file-save', async () => {
        await writeFile(filePath, fileBuffer);
      }),
      
      PerformanceMonitor.measure('database-save', async () => {
        const abstractRecord = new Abstract({
          ...abstractData,
          fileName: fileName,
          filePath: filePath,
          fileSize: file.size,
          fileType: file.type
        });
        return await abstractRecord.save();
      })
    ]);
    
    PerformanceMonitor.end('abstract-submission-total');
    
    return NextResponse.json({
      success: true,
      message: 'Abstract submitted successfully',
      data: {
        id: savedAbstract._id,
        title: savedAbstract.title,
        submittedAt: savedAbstract.submittedAt
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
    await connectToMongoose();
    
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

    const updateData: any = {
      status,
      reviewedAt: new Date()
    };

    if (reviewComments) {
      updateData.reviewComments = reviewComments;
    }

    const updatedAbstract = await Abstract.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAbstract) {
      return NextResponse.json(
        { success: false, message: 'Abstract not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Abstract status updated successfully',
      data: updatedAbstract
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
    await connectToMongoose();
    
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { success: false, message: 'Abstract IDs are required' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',');
    const result = await Abstract.deleteMany({ _id: { $in: idArray } });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} abstract(s)`,
      deletedCount: result.deletedCount
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
