import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const {
      invoiceNumber,
      customerName,
      phone,
      medicines,
      totalAmount,
      paymentMethod,
      discount,
      tax
    } = req.body;

    // Validation
    if (!invoiceNumber || !customerName || !phone || !medicines || medicines.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
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

    return res.status(201).json({ 
      success: true, 
      message: 'Invoice created successfully',
      data: invoice 
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create invoice'
    });
  }
}