'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('invoice');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    payment: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Starting fetch at:', new Date().toISOString());
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/invoices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      
      if (data.success) {
        setInvoices(data.data || []);
        console.log(`Loaded ${data.data?.length || 0} invoices`);
      } else {
        throw new Error(data.message || 'Failed to load invoices');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to load invoices. Please check console for details.');
      }
    } finally {
      setLoading(false);
      console.log('Fetch completed');
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        fetchInvoices();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update invoice status');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    let matchesSearch = true;
    
    if (searchQuery) {
      switch(searchBy) {
        case 'invoice':
          matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case 'patient':
          matchesSearch = invoice.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case 'mobile':
          matchesSearch = invoice.customerPhone?.includes(searchQuery);
          break;
        default:
          matchesSearch = true;
      }
    }

    const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
    const matchesPayment = filters.payment === 'all' || invoice.paymentMethod === filters.payment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const clearFilters = () => {
    setFilters({
      status: 'all',
      payment: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSearchQuery('');
    setSearchBy('invoice');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
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
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.75rem'
            }}>
              📄
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
              Invoices
            </h1>
          </div>
          <Link href="/invoices/new" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.75rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
          }}
          >
            <Plus size={20} />
            Create Invoice
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          fontWeight: '500',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Error:</strong> {error}
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
              Check browser console (F12) for more details
            </div>
          </div>
          <button 
            onClick={fetchInvoices}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '0.9375rem',
              minWidth: '200px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0EA5E9';
              e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="invoice">Invoice/Receipt No</option>
            <option value="patient">Patient Name</option>
            <option value="mobile">Mobile No</option>
          </select>

          <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }} size={20} />
            <input
              type="text"
              placeholder={
                searchBy === 'invoice' ? 'Search by invoice number...' :
                searchBy === 'patient' ? 'Search by patient name...' :
                'Search by mobile number...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3.5rem',
                border: '2px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
                color: '#0F172A'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0EA5E9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: '#F1F5F9',
              border: '2px solid #E2E8F0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#475569',
              position: 'relative',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
            }}
          >
            More Filters
            {activeFiltersCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#0EA5E9',
                color: 'white',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '2px solid #FECACA',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FECACA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FEE2E2';
              }}
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div style={{ 
            marginTop: '1.25rem', 
            paddingTop: '1.25rem', 
            borderTop: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: '#475569' }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A'
                }}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: '#475569' }}>
                Payment Method
              </label>
              <select
                value={filters.payment}
                onChange={(e) => setFilters({...filters, payment: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A'
                }}
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9375rem', fontWeight: '500' }}>
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
            <div style={{ 
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid #E2E8F0',
              borderTop: '4px solid #6366F1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', fontWeight: '500' }}>Loading invoices...</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748B' }}>
              If this takes too long, check your MongoDB connection
            </p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📄</div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
              {searchQuery || activeFiltersCount > 0 ? 'No invoices found matching your search.' : 'No invoices available yet.'}
            </p>
            {!searchQuery && activeFiltersCount === 0 && (
              <Link href="/invoices/new" style={{
                display: 'inline-block',
                marginTop: '1.5rem',
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}>
                Create Your First Invoice
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#6366F1',
                  color: '#FFFFFF'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Invoice #
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Customer
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Phone
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Amount
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Payment
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
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
                      {invoice.customerName}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                      {invoice.customerPhone}
                    </td>
                    <td style={{ padding: '1rem', color: '#10B981', fontWeight: '700', fontSize: '1rem' }}>
                      ₹{invoice.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                      {invoice.paymentMethod}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                        style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '9999px',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          outline: 'none',
                          backgroundColor: 
                            invoice.status === 'Paid' ? '#D1FAE5' :
                            invoice.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                          color:
                            invoice.status === 'Paid' ? '#059669' :
                            invoice.status === 'Cancelled' ? '#DC2626' : '#CA8A04'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                      {new Date(invoice.createdAt).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => router.push(`/invoices/${invoice._id}`)}
                        title="View invoice"
                        style={{
                          padding: '0.625rem 1.25rem',
                          backgroundColor: '#0EA5E9',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0284C7';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(14, 165, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#0EA5E9';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.2)';
                        }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}