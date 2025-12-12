import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

// GET - Fetch all invoices
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } },
          { doctorName: { $regex: search, $options: 'i' } }  // Added doctor name search
        ]
      };
    }

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Invoice.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      invoiceNumber,
      customerName,
      customerPhone,
      doctorName,  // Added doctor name
      items,
      subtotal,
      discount,
      totalAmount,
      paymentMethod,
      status
    } = body;

    // Validation
    if (!invoiceNumber || !customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Update medicine stock quantities
    for (const item of items) {
      if (item.medicineId) {
        const medicine = await Medicine.findById(item.medicineId);
        
        if (!medicine) {
          return NextResponse.json(
            { success: false, message: `Medicine not found: ${item.medicineName}` },
            { status: 404 }
          );
        }

        if (medicine.quantity < item.quantity) {
          return NextResponse.json(
            { 
              success: false, 
              message: `Insufficient stock for ${item.medicineName}. Available: ${medicine.quantity}` 
            },
            { status: 400 }
          );
        }

        // Decrease stock
        medicine.quantity -= item.quantity;
        await medicine.save();
      }
    }

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      customerPhone,
      doctorName: doctorName || '',  // Added doctor name with default empty string
      items,
      subtotal: Number(subtotal),
      discount: Number(discount) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod,
      status: status || 'Paid',
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}