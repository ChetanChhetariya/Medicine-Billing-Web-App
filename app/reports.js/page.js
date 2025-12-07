'use client';

import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?type=${reportType}`);
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', textDecoration: 'none' }}>
            🏥 Medicine Billing System
          </a>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/" style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              🏠 Dashboard
            </a>
            <a href="/medicines" style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              💊 Medicines
            </a>
            <a href="/invoices" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              🧾 Invoices
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '2rem' }}>
          📊 Reports & Analytics
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['sales', 'inventory', 'low-stock', 'expiring-soon'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: reportType === type ? '#3b82f6' : '#fff',
                color: reportType === type ? '#fff' : '#1f2937',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Loading report...
          </div>
        ) : (
          <div>
            {reportType === 'sales' && reportData && <SalesReport data={reportData} />}
            {reportType === 'inventory' && reportData && <InventoryReport data={reportData} />}
            {reportType === 'low-stock' && reportData && <LowStockReport data={reportData} />}
            {reportType === 'expiring-soon' && reportData && <ExpiringReport data={reportData} />}
          </div>
        )}
      </main>
    </div>
  );
}

function SalesReport({ data }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Sales</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹{data.totalSales?.toFixed(2) || '0.00'}</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{data.totalInvoices || 0} invoices</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Average Sale</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>₹{data.averageSale?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Tax</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>₹{data.totalTax?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Discount</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>₹{data.totalDiscount?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Sales by Payment Method</h3>
        {data.salesByPaymentMethod && Object.entries(data.salesByPaymentMethod).length > 0 ? (
          Object.entries(data.salesByPaymentMethod).map(([method, amount]) => (
            <div key={method} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{method}</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>₹{amount.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#6b7280', padding: '1rem 0' }}>No payment data available</p>
        )}
      </div>

      {data.topSellingMedicines && data.topSellingMedicines.length > 0 && (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Top Selling Medicines</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Medicine</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Quantity Sold</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topSellingMedicines.map((med, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{med.name}</td>
                  <td style={{ padding: '0.75rem' }}>{med.quantity}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10b981' }}>₹{med.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InventoryReport({ data }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Medicines</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{data.totalMedicines || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Value</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹{data.totalValue?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Quantity</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{data.totalQuantity || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Average Price</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>₹{data.averagePrice?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Inventory by Category</h3>
        {data.categoryBreakdown && Object.keys(data.categoryBreakdown).length > 0 ? (
          Object.entries(data.categoryBreakdown).map(([category, info]) => (
            <div key={category} style={{ 
              padding: '1rem', 
              marginBottom: '0.75rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>{category}</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>₹{info.value.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>{info.count} items</span>
                <span>{info.quantity} units</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#6b7280', padding: '1rem 0' }}>No category data available</p>
        )}
      </div>
    </div>
  );
}

function LowStockReport({ data }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Out of Stock</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{data.outOfStockCount || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Critical Stock</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{data.criticalStockCount || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #fbbf24' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Low Stock</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{data.lowStockItems || 0}</p>
        </div>
      </div>

      {data.medicines && data.medicines.length > 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Low Stock Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Medicine</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Batch</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Quantity</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.medicines.map((med) => (
                <tr key={med._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{med.name}</td>
                  <td style={{ padding: '0.75rem' }}>{med.batchNumber}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>{med.quantity}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: med.quantity === 0 ? '#fee2e2' : med.quantity <= 5 ? '#fed7aa' : '#fef3c7',
                      color: med.quantity === 0 ? '#991b1b' : med.quantity <= 5 ? '#c2410c' : '#92400e'
                    }}>
                      {med.quantity === 0 ? 'Out of Stock' : med.quantity <= 5 ? 'Critical' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', textAlign: 'center', color: '#6b7280' }}>
          No low stock items found
        </div>
      )}
    </div>
  );
}

function ExpiringReport({ data }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Expired</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{data.expiredCount || 0}</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Value: ₹{data.expiredValue?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Expiring in 1 Month</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{data.expiringIn1MonthCount || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #fbbf24' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Expiring in 3 Months</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{data.expiringIn3MonthsCount || 0}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Expiring in 6 Months</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{data.expiringIn6MonthsCount || 0}</p>
        </div>
      </div>

      {data.expired && data.expired.length > 0 && (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444' }}>⚠️ Expired Medicines</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Medicine</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Batch</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Expiry Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Quantity</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Value Lost</th>
              </tr>
            </thead>
            <tbody>
              {data.expired.map((med) => (
                <tr key={med._id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fef2f2' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{med.name}</td>
                  <td style={{ padding: '0.75rem' }}>{med.batchNumber}</td>
                  <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '500' }}>
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{med.quantity}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#ef4444' }}>
                    ₹{(med.price * med.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.expiringIn1Month && data.expiringIn1Month.length > 0 && (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#f59e0b' }}>📅 Expiring in 1 Month</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Medicine</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Batch</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Expiry Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Quantity</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.expiringIn1Month.map((med) => (
                <tr key={med._id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fffbeb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{med.name}</td>
                  <td style={{ padding: '0.75rem' }}>{med.batchNumber}</td>
                  <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: '500' }}>
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{med.quantity}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>
                    ₹{(med.price * med.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}