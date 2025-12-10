import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';

export async function PUT(request, { params }) {
  try {
    // Await params for Next.js 16
    const { id } = await params;
    
    // Parse the request body to get the new status
    const body = await request.json();
    const { status } = body;

    console.log('📝 Updating invoice status:', { id, status });

    // Validate status
    if (!status || !['Pending', 'Paid', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid status. Must be Pending, Paid, or Cancelled' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find and update the invoice
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status: status },
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run schema validators
      }
    );

    if (!invoice) {
      console.log('❌ Invoice not found:', id);
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    console.log('✅ Invoice status updated successfully:', invoice.status);

    return NextResponse.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice
    });

  } catch (error) {
    console.error('❌ Error updating invoice status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update invoice status',
        error: error.message 
      },
      { status: 500 }
    );
  }
}