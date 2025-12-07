'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    totalInvoices: 0,
    totalRevenue: 0
  });
  const [invoices, setInvoices] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch medicines
      const medRes = await fetch('/api/medicines');
      const medData = await medRes.json();
      if (medData.success) {
        setMedicines(medData.data);
        const lowStockCount = medData.data.filter(m => m.quantity < 10).length;
        setStats(prev => ({
          ...prev,
          totalMedicines: medData.data.length,
          lowStock: lowStockCount
        }));
      }

      // Fetch invoices
      const invRes = await fetch('/api/invoices');
      const invData = await invRes.json();
      if (invData.success) {
        setInvoices(invData.data);
        const revenue = invData.data.reduce((sum, inv) => sum + (inv.grandTotal || inv.totalAmount || 0), 0);
        setStats(prev => ({
          ...prev,
          totalInvoices: invData.data.length,
          totalRevenue: revenue
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            🏥 Medicine Billing System
          </h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/medicines" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              💊 Medicines
            </Link>
            <Link href="/invoices" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              🧾 Invoices
            </Link>
            <Link href="/reports" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              📊 Reports
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Total Medicines */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
            <h3 style={{ fontSize: '1rem', opacity: 0.9, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Total Medicines
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              {stats.totalMedicines}
            </p>
          </div>

          {/* Low Stock */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1rem', opacity: 0.9, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Low Stock Items
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              {stats.lowStock}
            </p>
          </div>

          {/* Total Invoices */}
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
            <h3 style={{ fontSize: '1rem', opacity: 0.9, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Total Invoices
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              {stats.totalInvoices}
            </p>
          </div>

          {/* Total Revenue */}
          <div style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1rem', opacity: 0.9, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Total Revenue
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              ₹{stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #667eea',
            paddingLeft: '1rem'
          }}>
            📋 Recent Invoices
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>INVOICE #</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>PATIENT</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>DATE</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                      No invoices yet. Create your first invoice!
                    </td>
                  </tr>
                ) : (
                  invoices.slice(0, 5).map((invoice, idx) => (
                    <tr key={invoice._id || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>
                        <strong>{invoice.invoiceNumber || 'N/A'}</strong>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {invoice.patientName || invoice.customerName || 'N/A'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '600', color: '#10b981' }}>
                        ₹{(invoice.grandTotal || invoice.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/invoices" style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              View All Invoices →
            </Link>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStock > 0 && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e', fontSize: '1.125rem', fontWeight: '600' }}>
                Low Stock Alert!
              </h3>
              <p style={{ margin: 0, color: '#78350f' }}>
                {stats.lowStock} medicine(s) are running low on stock. Please reorder soon.
              </p>
            </div>
            <Link href="/medicines" style={{
              marginLeft: 'auto',
              padding: '0.5rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              View Medicines
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}