import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';

// GET - Fetch single invoice by ID
export async function GET(request, { params }) {
  try {
    // Await params for Next.js 16
    const { id } = await params;
    
    await dbConnect();
    
    // FIXED: Changed from 'medicines.medicine' to 'items.medicineId'
    // This matches your actual schema structure
    const invoice = await Invoice.findById(id)
      .populate('items.medicineId');
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT - Update invoice by ID
export async function PUT(request, { params }) {
  try {
    // Await params for Next.js 16
    const { id } = await params;
    
    await dbConnect();
    const body = await request.json();
    
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: invoice, 
      message: 'Invoice updated successfully' 
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice by ID
export async function DELETE(request, { params }) {
  try {
    // Await params for Next.js 16
    const { id } = await params;
    
    await dbConnect();
    const invoice = await Invoice.findByIdAndDelete(id);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Invoice deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}