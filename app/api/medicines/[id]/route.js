import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/medicine';

// GET - Fetch single medicine by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const medicine = await Medicine.findById(id);
    
    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: medicine });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medicine' },
      { status: 500 }
    );
  }
}

// PUT - Update medicine by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    const updateData = {
      name: body.name || body.medicineName,
      agency: body.agency || body.agencyName || body.manufacturer,
      batchNumber: body.batchNumber || body.batch,
      expiryDate: body.expiryDate || body.expiry,
      quantity: body.quantity !== undefined ? parseInt(body.quantity) : undefined,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      minimumStockLevel: body.minimumStockLevel !== undefined ? parseInt(body.minimumStockLevel) : undefined,
      description: body.description || body.notes
    };
    
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: medicine, 
      message: 'Medicine updated successfully' 
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update medicine' },
      { status: 500 }
    );
  }
}

// DELETE - Delete medicine by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('Attempting to delete medicine with ID:', id);
    
    await dbConnect();
    const medicine = await Medicine.findByIdAndDelete(id);
    
    if (!medicine) {
      console.log('Medicine not found with ID:', id);
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }
    
    console.log('Medicine deleted successfully:', medicine);
    
    return NextResponse.json(
      { success: true, message: 'Medicine deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete medicine' },
      { status: 500 }
    );
  }
}