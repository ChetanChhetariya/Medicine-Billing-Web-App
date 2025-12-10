import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    console.log('📥 Received invoice data:', body);
    
    const {
      invoiceNumber,
      customerName,
      customerPhone,  // Changed from 'phone'
      items,          // Changed from 'medicines'
      totalAmount,
      paymentMethod,
      discount,
      subtotal,
      status
    } = body;

    // Validation
    if (!invoiceNumber || !customerName || !customerPhone || !items || items.length === 0) {
      console.error('❌ Validation failed:', { invoiceNumber, customerName, customerPhone, itemsLength: items?.length });
      return Response.json({ 
        success: false, 
        message: 'Please provide all required fields' 
      }, { status: 400 });
    }

    // Update medicine stock quantities
    for (const item of items) {
      if (item.medicineId) {
        const medicine = await Medicine.findById(item.medicineId);
        
        if (!medicine) {
          console.error(`Medicine not found: ${item.medicineId}`);
          continue;
        }

        if (medicine.quantity < item.quantity) {
          return Response.json({ 
            success: false, 
            message: `Insufficient stock for ${item.medicineName}. Available: ${medicine.quantity}` 
          }, { status: 400 });
        }

        await Medicine.findByIdAndUpdate(
          item.medicineId,
          { $inc: { quantity: -item.quantity } }
        );
        
        console.log(`✅ Updated stock for ${item.medicineName}: -${item.quantity}`);
      }
    }

    // Create invoice with correct field names
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      customerPhone,  // Use customerPhone
      items,          // Use items
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      totalAmount: Number(totalAmount),
      paymentMethod,
      status: status || 'Pending'
    });

    console.log('✅ Invoice created successfully:', invoice._id);

    return Response.json({ 
      success: true, 
      message: 'Invoice created successfully',
      data: invoice 
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating invoice:', error);
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