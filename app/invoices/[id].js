import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invoice ID is required' 
      });
    }

    const invoice = await Invoice.findById(id).populate('medicines.medicineId');

    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: invoice 
    });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch invoice'
    });
  }
}