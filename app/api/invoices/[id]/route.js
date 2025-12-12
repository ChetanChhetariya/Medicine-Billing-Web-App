import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';

// GET - Fetch single invoice
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Await params to unwrap the Promise
    const { id } = await params;
    
    const invoice = await Invoice.findById(id).lean();
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update invoice
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Await params to unwrap the Promise
    const { id } = await params;
    const body = await request.json();
    
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
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
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // FIXED: Await params to unwrap the Promise
    const { id } = await params;
    
    const invoice = await Invoice.findByIdAndDelete(id);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}