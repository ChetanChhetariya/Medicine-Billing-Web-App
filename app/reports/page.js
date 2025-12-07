'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch invoices
      const invoicesRes = await fetch('/api/invoices');
      const invoicesData = await invoicesRes.json();
      if (invoicesData.success) {
        setInvoices(invoicesData.data);
      }

      // Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getFilteredInvoices = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      
      switch(filter) {
        case 'today':
          return invoiceDate >= today;
        case 'week':
          return invoiceDate >= weekAgo;
        case 'month':
          return invoiceDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const calculateStats = () => {
    const filtered = getFilteredInvoices();
    const totalRevenue = filtered.reduce((sum, inv) => sum + (inv.grandTotal || inv.totalAmount || 0), 0);
    const totalInvoices = filtered.length;
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    
    const paymentMethods = filtered.reduce((acc, inv) => {
      acc[inv.paymentMethod] = (acc[inv.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRevenue,
      totalInvoices,
      avgInvoiceValue,
      paymentMethods
    };
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading reports...</p>
      </div>
    );
  }

  const filteredStats = calculateStats();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }} className="no-print">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', textDecoration: 'none' }}>
            🏥 Medicine Billing System
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              🏠 Dashboard
            </Link>
            <Link href="/medicines" style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              💊 Medicines
            </Link>
            <Link href="/invoices" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
              🧾 Invoices
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#1f2937' }}>📊 Sales Reports</h2>
          <button
            onClick={printReport}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }} className="no-print">
          {['all', 'today', 'week', 'month'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === f ? '#8b5cf6' : '#fff',
                color: filter === f ? '#fff' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filter === f ? '600' : '400',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All Time' : f === 'today' ? 'Today' : f === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              ₹{filteredStats.totalRevenue.toFixed(2)}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Invoices</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {filteredStats.totalInvoices}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Avg Invoice Value</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              ₹{filteredStats.avgInvoiceValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Methods</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {Object.entries(filteredStats.paymentMethods).map(([method, count]) => (
              <div key={method} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{method}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Invoice Details</h3>
          
          {getFilteredInvoices().length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No invoices found for the selected period</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Invoice #</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Customer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Phone</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Amount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Payment</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredInvoices().map((invoice) => (
                    <tr key={invoice._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{invoice.invoiceNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{invoice.patientName || invoice.customerName}</td>
                      <td style={{ padding: '0.75rem' }}>{invoice.patientContact || invoice.customerPhone}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10b981' }}>
                        ₹{(invoice.grandTotal || invoice.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{invoice.paymentMethod}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}