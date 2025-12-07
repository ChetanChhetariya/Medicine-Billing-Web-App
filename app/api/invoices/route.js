import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const {
      invoiceNumber,
      customerName,
      phone,
      medicines,
      totalAmount,
      paymentMethod
    } = body;

    // Validation
    if (!invoiceNumber || !customerName || !phone || !medicines || medicines.length === 0) {
      return Response.json({ 
        success: false, 
        message: 'Please provide all required fields' 
      }, { status: 400 });
    }

    // Update medicine stock quantities
    for (const med of medicines) {
      if (med.medicineId) {
        await Medicine.findByIdAndUpdate(
          med.medicineId,
          { $inc: { quantity: -med.quantity } }
        );
      }
    }

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      phone,
      medicines,
      totalAmount: Number(totalAmount),
      paymentMethod,
      status: 'Pending',
      date: new Date()
    });

    return Response.json({ 
      success: true, 
      message: 'Invoice created successfully',
      data: invoice 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return Response.json({ 
      success: false, 
      message: error.message || 'Failed to create invoice'
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const invoices = await Invoice.find({}).sort({ createdAt: -1 });

    return Response.json({ 
      success: true, 
      data: invoices 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return Response.json({ 
      success: false, 
      message: error.message || 'Failed to fetch invoices'
    }, { status: 500 });
  }
}