import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/invoice';
import Medicine from '@/models/medicine';

// GET - Fetch reports and analytics
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }
    
    switch (reportType) {
      case 'sales':
        return await getSalesReport(dateFilter);
      
      case 'inventory':
        return await getInventoryReport();
      
      case 'low-stock':
        return await getLowStockReport();
      
      case 'expiring-soon':
        return await getExpiringSoonReport();
      
      case 'dashboard':
        return await getDashboardStats(dateFilter);
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid report type. Use: sales, inventory, low-stock, expiring-soon, or dashboard'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function getSalesReport(dateFilter) {
  const invoices = await Invoice.find(dateFilter);
  
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = invoices.length;
  const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);
  const totalDiscount = invoices.reduce((sum, inv) => sum + inv.discount, 0);
  
  const salesByPaymentMethod = invoices.reduce((acc, inv) => {
    acc[inv.paymentMethod] = (acc[inv.paymentMethod] || 0) + inv.grandTotal;
    return acc;
  }, {});
  
  const salesByStatus = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});
  
  const dailySales = invoices.reduce((acc, inv) => {
    const date = new Date(inv.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { sales: 0, count: 0 };
    }
    acc[date].sales += inv.grandTotal;
    acc[date].count += 1;
    return acc;
  }, {});
  
  // Top selling medicines
  const medicinesSold = {};
  invoices.forEach(inv => {
    inv.items.forEach(item => {
      const key = item.medicineName;
      if (!medicinesSold[key]) {
        medicinesSold[key] = { quantity: 0, revenue: 0 };
      }
      medicinesSold[key].quantity += item.quantity;
      medicinesSold[key].revenue += item.total;
    });
  });
  
  const topSellingMedicines = Object.entries(medicinesSold)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  return NextResponse.json({
    success: true,
    data: {
      totalSales,
      totalInvoices,
      totalTax,
      totalDiscount,
      averageSale: totalInvoices > 0 ? totalSales / totalInvoices : 0,
      salesByPaymentMethod,
      salesByStatus,
      dailySales,
      topSellingMedicines
    }
  });
}

async function getInventoryReport() {
  const medicines = await Medicine.find();
  
  const totalMedicines = medicines.length;
  const totalValue = medicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  const totalQuantity = medicines.reduce((sum, med) => sum + med.quantity, 0);
  
  const categoryBreakdown = medicines.reduce((acc, med) => {
    const cat = med.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { count: 0, value: 0, quantity: 0 };
    }
    acc[cat].count++;
    acc[cat].value += med.price * med.quantity;
    acc[cat].quantity += med.quantity;
    return acc;
  }, {});
  
  const manufacturerBreakdown = medicines.reduce((acc, med) => {
    const mfr = med.manufacturer || 'Unknown';
    if (!acc[mfr]) {
      acc[mfr] = { count: 0, value: 0 };
    }
    acc[mfr].count++;
    acc[mfr].value += med.price * med.quantity;
    return acc;
  }, {});
  
  return NextResponse.json({
    success: true,
    data: {
      totalMedicines,
      totalValue,
      totalQuantity,
      averagePrice: totalQuantity > 0 ? totalValue / totalQuantity : 0,
      categoryBreakdown,
      manufacturerBreakdown
    }
  });
}

async function getLowStockReport() {
  const lowStockThreshold = 10;
  const lowStockMedicines = await Medicine.find({
    quantity: { $lte: lowStockThreshold }
  }).sort({ quantity: 1 });
  
  const outOfStock = lowStockMedicines.filter(m => m.quantity === 0);
  const criticalStock = lowStockMedicines.filter(m => m.quantity > 0 && m.quantity <= 5);
  const lowStock = lowStockMedicines.filter(m => m.quantity > 5 && m.quantity <= 10);
  
  return NextResponse.json({
    success: true,
    data: {
      lowStockCount: lowStockMedicines.length,
      outOfStockCount: outOfStock.length,
      criticalStockCount: criticalStock.length,
      lowStockItems: lowStock.length,
      medicines: lowStockMedicines,
      outOfStock,
      criticalStock,
      lowStock
    }
  });
}

async function getExpiringSoonReport() {
  const today = new Date();
  const oneMonth = new Date();
  oneMonth.setMonth(oneMonth.getMonth() + 1);
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  
  const [expired, expiringIn1Month, expiringIn3Months, expiringIn6Months] = await Promise.all([
    Medicine.find({ expiryDate: { $lt: today } }).sort({ expiryDate: 1 }),
    Medicine.find({ expiryDate: { $gte: today, $lt: oneMonth } }).sort({ expiryDate: 1 }),
    Medicine.find({ expiryDate: { $gte: oneMonth, $lt: threeMonths } }).sort({ expiryDate: 1 }),
    Medicine.find({ expiryDate: { $gte: threeMonths, $lt: sixMonths } }).sort({ expiryDate: 1 })
  ]);
  
  const expiredValue = expired.reduce((sum, m) => sum + (m.price * m.quantity), 0);
  
  return NextResponse.json({
    success: true,
    data: {
      expiredCount: expired.length,
      expiredValue,
      expiringIn1MonthCount: expiringIn1Month.length,
      expiringIn3MonthsCount: expiringIn3Months.length,
      expiringIn6MonthsCount: expiringIn6Months.length,
      expired,
      expiringIn1Month,
      expiringIn3Months,
      expiringIn6Months
    }
  });
}

async function getDashboardStats(dateFilter) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const [
    todayInvoices,
    monthInvoices,
    allInvoices,
    totalMedicines,
    lowStockMedicines,
    expiredMedicines,
    expiringSoon
  ] = await Promise.all([
    Invoice.find({ createdAt: { $gte: today } }),
    Invoice.find({ createdAt: { $gte: thisMonth } }),
    Invoice.find(dateFilter),
    Medicine.countDocuments(),
    Medicine.countDocuments({ quantity: { $lte: 10 } }),
    Medicine.countDocuments({ expiryDate: { $lt: new Date() } }),
    Medicine.countDocuments({
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    })
  ]);
  
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const monthSales = monthInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalSales = allInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = allInvoices.length;
  
  const recentInvoices = await Invoice.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('items.medicine');
  
  return NextResponse.json({
    success: true,
    data: {
      todaySales,
      todayInvoices: todayInvoices.length,
      monthSales,
      monthInvoices: monthInvoices.length,
      totalSales,
      totalInvoices,
      totalMedicines,
      lowStockCount: lowStockMedicines,
      expiredCount: expiredMedicines,
      expiringSoonCount: expiringSoon,
      recentInvoices
    }
  });
}