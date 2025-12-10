import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/medicine';

// GET - Fetch all medicines
export async function GET() {
  try {
    await dbConnect();
    const medicines = await Medicine.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: medicines });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}

// POST - Create new medicine
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('Creating medicine with data:', body);
    
    // Map field names from form to database schema
    const medicineData = {
      name: body.name || body.medicineName,
      agency: body.agency || body.agencyName || body.manufacturer,
      batchNumber: body.batchNumber || body.batch,
      expiryDate: body.expiryDate || body.expiry,
      quantity: parseInt(body.quantity) || 0,
      price: parseFloat(body.price) || 0,
      minimumStockLevel: parseInt(body.minimumStockLevel) || 10,
      description: body.description || body.notes || ''
    };
    
    console.log('Mapped medicine data:', medicineData);
    
    const medicine = await Medicine.create(medicineData);
    console.log('Medicine created successfully:', medicine);
    
    return NextResponse.json(
      { success: true, data: medicine, message: 'Medicine added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating medicine:', error);
    console.error('Error details:', error.message);
    
    // Handle duplicate batch number
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A medicine with this batch number already exists' },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create medicine' },
      { status: 500 }
    );
  }
}