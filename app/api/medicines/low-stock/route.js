import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; 
import Medicine from '@/models/medicine';

export async function GET() {
  try {
    await connectDB();

    // Find medicines where stock is less than or equal to 10
    const lowStockItems = await Medicine.find({
      stock: { $lte: 10 }
    })
      .sort({ stock: 1 })
      .limit(10);

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error('Low stock fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock items' },
      { status: 500 }
    );
  }
}