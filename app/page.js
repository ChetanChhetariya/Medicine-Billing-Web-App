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
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
<div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
        src="/medicallogo.jpg" 
        alt="Dwarkesh Medical" 
        style={{ height: '70px', width: 'auto' }}
        />
        </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/medicines" style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#0EA5E9',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(14, 165, 233, 0.2)'
            }}>
              💊 Medicines
            </Link>
            <Link href="/invoices" style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#10B981',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(16, 185, 129, 0.2)'
            }}>
              🧾 Invoices
            </Link>
            <Link href="/reports" style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#8B5CF6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(139, 92, 246, 0.2)'
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
            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
            <h3 style={{ fontSize: '0.875rem', opacity: 0.95, margin: '0 0 0.5rem 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Total Medicines
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0, lineHeight: '1' }}>
              {stats.totalMedicines}
            </p>
          </div>

          {/* Low Stock */}
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '0.875rem', opacity: 0.95, margin: '0 0 0.5rem 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Low Stock Items
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0, lineHeight: '1' }}>
              {stats.lowStock}
            </p>
          </div>

          {/* Total Invoices */}
          <div style={{
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
            <h3 style={{ fontSize: '0.875rem', opacity: 0.95, margin: '0 0 0.5rem 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Total Invoices
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0, lineHeight: '1' }}>
              {stats.totalInvoices}
            </p>
          </div>

          {/* Total Revenue */}
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '0.875rem', opacity: 0.95, margin: '0 0 0.5rem 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Total Revenue
            </h3>
            <p style={{ fontSize: '3rem', fontWeight: '700', margin: 0, lineHeight: '1' }}>
              ₹{stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ 
              width: '4px', 
              height: '24px', 
              backgroundColor: '#0EA5E9', 
              borderRadius: '2px' 
            }}></span>
            Recent Invoices
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F1F5F9',
                  borderBottom: '2px solid #E2E8F0'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>INVOICE #</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PATIENT</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DATE</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                      <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>No invoices yet. Create your first invoice!</p>
                    </td>
                  </tr>
                ) : (
                  invoices.slice(0, 5).map((invoice, idx) => (
                    <tr key={invoice._id || idx} style={{ 
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <strong style={{ color: '#0F172A', fontWeight: '600' }}>{invoice.invoiceNumber || 'N/A'}</strong>
                      </td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        {invoice.patientName || invoice.customerName || 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748B' }}>
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '700', color: '#10B981', fontSize: '1.125rem' }}>
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
              transition: 'all 0.2s'
            }}>
              View All Invoices →
            </Link>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStock > 0 && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ 
              fontSize: '2.5rem',
              backgroundColor: '#FEF3C7',
              borderRadius: '12px',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400E', fontSize: '1.125rem', fontWeight: '700' }}>
                Low Stock Alert!
              </h3>
              <p style={{ margin: 0, color: '#78350F', fontSize: '0.9375rem' }}>
                {stats.lowStock} medicine(s) are running low on stock. Please reorder soon.
              </p>
            </div>
            <Link href="/medicines" style={{
              padding: '0.625rem 1.5rem',
              backgroundColor: '#F59E0B',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s'
            }}>
              View Medicines
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
