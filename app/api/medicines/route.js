import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/medicine';

export async function GET(req) {
  try {
    await dbConnect();

    const medicines = await Medicine.find({}).sort({ createdAt: -1 });

    return Response.json({ 
      success: true, 
      data: medicines 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching medicines:', error);
    return Response.json({ 
      success: false, 
      message: error.message || 'Failed to fetch medicines'
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const {
      agencyName,
      medicineName,
      batchNumber,
      expiryDate,
      quantity,
      price,
      minimumStockLevel,
      notes
    } = body;

    // Validation
    if (!agencyName || !medicineName || !batchNumber || !expiryDate || !quantity || !price) {
      return Response.json({ 
        success: false, 
        message: 'Please provide all required fields' 
      }, { status: 400 });
    }

    const medicine = await Medicine.create({
      agencyName,
      medicineName,
      batchNumber,
      expiryDate,
      quantity: Number(quantity),
      price: Number(price),
      minimumStockLevel: minimumStockLevel ? Number(minimumStockLevel) : 10,
      notes
    });

    return Response.json({ 
      success: true, 
      message: 'Medicine added successfully',
      data: medicine 
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding medicine:', error);
    return Response.json({ 
      success: false, 
      message: error.message || 'Failed to add medicine'
    }, { status: 500 });
  }
}