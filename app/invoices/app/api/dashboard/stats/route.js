import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Mock statistics - Replace with actual database queries
    const stats = {
      totalSales: 125000,
      totalInvoices: 245,
      totalMedicines: 180,
      lowStockItems: 12,
      todaySales: 5400,
      monthSales: 45000,
      pendingInvoices: 8,
      totalCustomers: 120,
      recentActivity: [
        {
          id: 1,
          type: 'sale',
          description: 'New invoice created',
          amount: 2500,
          time: new Date().toISOString()
        },
        {
          id: 2,
          type: 'stock',
          description: 'Low stock alert: Paracetamol',
          time: new Date().toISOString()
        }
      ],
      topSellingMedicines: [
        { name: 'Paracetamol', sales: 250, revenue: 12500 },
        { name: 'Amoxicillin', sales: 180, revenue: 18000 },
        { name: 'Ibuprofen', sales: 150, revenue: 15000 }
      ],
      salesTrend: [
        { month: 'Jan', sales: 32000 },
        { month: 'Feb', sales: 35000 },
        { month: 'Mar', sales: 38000 },
        { month: 'Apr', sales: 42000 },
        { month: 'May', sales: 45000 }
      ]
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard/stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}