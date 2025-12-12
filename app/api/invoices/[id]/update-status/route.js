import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';

// PUT - Update invoice status
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Await params to unwrap the Promise
    const { id } = await params;
    const { status } = await request.json();
    
    if (!status || !['Pending', 'Paid', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be Pending, Paid, or Cancelled' },
        { status: 400 }
      );
    }
    
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}