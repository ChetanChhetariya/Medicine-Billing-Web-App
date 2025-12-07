import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/invoice';

export async function PUT(request) {
  try {
    await connectDB();
    
    const { invoiceId, status } = await request.json();
    
    console.log('Received update request:', { invoiceId, status });
    
    if (!invoiceId || !status) {
      return NextResponse.json(
        { success: false, message: 'Invoice ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    console.log('Invoice updated successfully:', updatedInvoice);

    return NextResponse.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: updatedInvoice
    });

  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating invoice status' },
      { status: 500 }
    );
  }
}