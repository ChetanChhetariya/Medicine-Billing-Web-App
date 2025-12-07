import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

export async function GET(request) {
  try {
    await dbConnect();

    // Get all invoices
    const allInvoices = await Invoice.find({}).sort({ createdAt: -1 });
    
    // Get all medicines
    const allMedicines = await Medicine.find({});

    // Calculate total sales
    const totalSales = allInvoices.reduce((sum, inv) => {
      return sum + (inv.grandTotal || inv.totalAmount || 0);
    }, 0);

    // Total invoices count
    const totalInvoices = allInvoices.length;

    // Total medicines count
    const totalMedicines = allMedicines.length;

    // Low stock items (stock less than 10)
    const lowStockItems = allMedicines.filter(med => med.quantity < 10).length;

    // Today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInvoices = allInvoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate >= today;
    });
    const todaySales = todayInvoices.reduce((sum, inv) => {
      return sum + (inv.grandTotal || inv.totalAmount || 0);
    }, 0);

    // This month's sales
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthInvoices = allInvoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate >= firstDayOfMonth;
    });
    const monthSales = monthInvoices.reduce((sum, inv) => {
      return sum + (inv.grandTotal || inv.totalAmount || 0);
    }, 0);

    // Pending invoices (status != 'paid')
    const pendingInvoices = allInvoices.filter(inv => inv.status !== 'paid').length;

    // Get unique customers count
    const uniqueCustomers = new Set(
      allInvoices.map(inv => inv.patientName || inv.customerName)
    ).size;

    // Recent activity (last 5 invoices)
    const recentActivity = allInvoices.slice(0, 5).map(inv => ({
      id: inv._id,
      type: 'sale',
      description: `Invoice ${inv.invoiceNumber} - ${inv.patientName || inv.customerName}`,
      amount: inv.grandTotal || inv.totalAmount || 0,
      time: inv.createdAt
    }));

    // Add low stock alerts to recent activity
    const lowStockMeds = allMedicines.filter(med => med.quantity < 10).slice(0, 3);
    lowStockMeds.forEach(med => {
      recentActivity.push({
        id: med._id,
        type: 'stock',
        description: `Low stock alert: ${med.name} (${med.quantity} left)`,
        time: new Date().toISOString()
      });
    });

    // Top selling medicines (count from invoice items)
    const medicinesSales = {};
    allInvoices.forEach(inv => {
      if (inv.items && Array.isArray(inv.items)) {
        inv.items.forEach(item => {
          const medName = item.medicineName || 'Unknown';
          if (!medicinesSales[medName]) {
            medicinesSales[medName] = { name: medName, sales: 0, revenue: 0 };
          }
          medicinesSales[medName].sales += item.quantity || 0;
          medicinesSales[medName].revenue += (item.total || (item.price * item.quantity) || 0);
        });
      }
    });

    const topSellingMedicines = Object.values(medicinesSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Sales trend (last 6 months)
    const salesTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthInvoicesData = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= monthDate && invDate <= monthEnd;
      });
      
      const monthTotal = monthInvoicesData.reduce((sum, inv) => {
        return sum + (inv.grandTotal || inv.totalAmount || 0);
      }, 0);

      salesTrend.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthTotal
      });
    }

    const stats = {
      totalSales,
      totalInvoices,
      totalMedicines,
      lowStockItems,
      todaySales,
      monthSales,
      pendingInvoices,
      totalCustomers: uniqueCustomers,
      recentActivity: recentActivity.slice(0, 8),
      topSellingMedicines,
      salesTrend
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