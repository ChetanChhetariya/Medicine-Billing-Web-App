'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const invoicesRes = await fetch('/api/invoices');
      const invoicesData = await invoicesRes.json();
      if (invoicesData.success) {
        setInvoices(invoicesData.data);
      }

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
        case 'custom':
          const start = customDates.startDate ? new Date(customDates.startDate) : null;
          const end = customDates.endDate ? new Date(customDates.endDate) : null;
          
          if (start && end) {
            end.setHours(23, 59, 59, 999);
            return invoiceDate >= start && invoiceDate <= end;
          } else if (start) {
            return invoiceDate >= start;
          } else if (end) {
            end.setHours(23, 59, 59, 999);
            return invoiceDate <= end;
          }
          return true;
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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
    }
  };

  const applyCustomRange = () => {
    if (!customDates.startDate && !customDates.endDate) {
      alert('Please select at least one date');
      return;
    }
    setFilter('custom');
  };

  const clearCustomRange = () => {
    setCustomDates({ startDate: '', endDate: '' });
    setFilter('all');
    setShowCustomRange(false);
  };

  const printReport = () => {
    window.print();
  };

  const filteredStats = calculateStats();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '2rem' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }} className="no-print">
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          textDecoration: 'none',
          color: '#475569',
          fontWeight: '600',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F1F5F9';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.75rem'
            }}>
              📊
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
              Sales Reports
            </h1>
          </div>
          <button
            onClick={printReport}
            className="no-print"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.25)';
            }}
          >
            <Printer size={20} />
            Print Report
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0'
      }} className="no-print">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: showCustomRange ? '1.5rem' : '0' }}>
          {[
            { value: 'all', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Last 7 Days' },
            { value: 'month', label: 'Last 30 Days' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: filter === f.value ? '#8B5CF6' : '#F1F5F9',
                color: filter === f.value ? '#FFFFFF' : '#475569',
                border: '2px solid',
                borderColor: filter === f.value ? '#8B5CF6' : '#E2E8F0',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9375rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (filter !== f.value) {
                  e.currentTarget.style.backgroundColor = '#E2E8F0';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== f.value) {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                }
              }}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => handleFilterChange('custom')}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: filter === 'custom' ? '#8B5CF6' : '#F1F5F9',
              color: filter === 'custom' ? '#FFFFFF' : '#475569',
              border: '2px solid',
              borderColor: filter === 'custom' ? '#8B5CF6' : '#E2E8F0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9375rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (filter !== 'custom') {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== 'custom') {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }
            }}
          >
            <Calendar size={16} />
            Custom Range
          </button>
        </div>

        {/* Custom Date Range Picker */}
        {showCustomRange && (
          <div style={{ 
            paddingTop: '1.5rem',
            borderTop: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', marginBottom: '1rem', color: '#475569' }}>
              Select Custom Date Range
            </h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '600' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDates.startDate}
                  onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })}
                  style={{
                    padding: '0.625rem',
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '600' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customDates.endDate}
                  onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })}
                  style={{
                    padding: '0.625rem',
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={applyCustomRange}
                  style={{
                    padding: '0.625rem 1.25rem',
                    backgroundColor: '#10B981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10B981';
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={clearCustomRange}
                  style={{
                    padding: '0.625rem 1.25rem',
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#EF4444';
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            {filter === 'custom' && (customDates.startDate || customDates.endDate) && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.875rem 1.25rem', 
                backgroundColor: '#DBEAFE', 
                borderRadius: '10px',
                border: '1px solid #93C5FD'
              }}>
                <p style={{ fontSize: '0.9375rem', color: '#1E40AF', margin: 0, fontWeight: '500' }}>
                  📊 Showing data from{' '}
                  <strong>{customDates.startDate || 'beginning'}</strong> to{' '}
                  <strong>{customDates.endDate || 'today'}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
          <div style={{ 
            display: 'inline-block',
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTop: '4px solid #8B5CF6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', fontWeight: '500' }}>Loading reports...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              padding: '1.75rem', 
              borderRadius: '16px', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #10B981'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981' }}>
                ₹{filteredStats.totalRevenue.toFixed(2)}
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#FFFFFF', 
              padding: '1.75rem', 
              borderRadius: '16px', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #0EA5E9'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Invoices
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0EA5E9' }}>
                {filteredStats.totalInvoices}
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#FFFFFF', 
              padding: '1.75rem', 
              borderRadius: '16px', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #8B5CF6'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Avg Invoice Value
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8B5CF6' }}>
                ₹{filteredStats.avgInvoiceValue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2rem', 
            marginBottom: '2rem', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0F172A' }}>
              Payment Methods
            </h3>
            {Object.keys(filteredStats.paymentMethods).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {Object.entries(filteredStats.paymentMethods).map(([method, count]) => (
                  <div key={method} style={{ 
                    padding: '1.25rem', 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ fontSize: '0.875rem', color: '#64748B', textTransform: 'capitalize', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {method}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0F172A' }}>
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>No payment data available</p>
            )}
          </div>

          {/* Invoices Table */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0F172A' }}>
              Invoice Details
            </h3>
            
            {getFilteredInvoices().length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📄</div>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                  No invoices found for the selected period
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#F1F5F9',
                      borderBottom: '2px solid #E2E8F0'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Invoice #
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Customer
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Phone
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Amount
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Payment
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredInvoices().map((invoice, idx) => (
                      <tr key={invoice._id} style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#0F172A', fontSize: '0.9375rem' }}>
                          {invoice.invoiceNumber}
                        </td>
                        <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9375rem' }}>
                          {invoice.patientName || invoice.customerName}
                        </td>
                        <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                          {invoice.patientContact || invoice.customerPhone}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '700', color: '#10B981', fontSize: '1rem' }}>
                          ₹{(invoice.grandTotal || invoice.totalAmount).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '9999px',
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize'
                          }}>
                            {invoice.paymentMethod}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                          {new Date(invoice.createdAt).toLocaleDateString('en-IN', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

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