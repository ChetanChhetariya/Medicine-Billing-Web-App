'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  // Fetch invoices from MongoDB
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices');
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.data);
      } else {
        setError(data.message || 'Failed to load invoices');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices from database');
    } finally {
      setLoading(false);
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
        // Refresh the list
        fetchInvoices();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update invoice status');
    }
  };

  // Filter invoices
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>
          Loading invoices...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'transparent',
          border: '1px solid #d1d5db',
          color: '#374151',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '16px',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📄 Invoices
        </h1>
        <button
          onClick={() => router.push('/invoices/new')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Create Invoice
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search By Dropdown */}
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            <option value="invoice">Invoice/Receipt No</option>
            <option value="patient">Patient Name</option>
            <option value="mobile">Mobile No</option>
          </select>

          {/* Search Input */}
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
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          />

          {/* More Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              position: 'relative'
            }}
          >
            More Filters
            {activeFiltersCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Button */}
          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 16px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid #e5e7eb',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Payment Method
              </label>
              <select
                value={filters.payment}
                onChange={(e) => setFilters({...filters, payment: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
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

      {/* Results Count */}
      <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        Showing {filteredInvoices.length} of {invoices.length} invoices
      </div>

      {/* Invoices Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {filteredInvoices.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            {searchQuery || activeFiltersCount > 0 ? 
              'No invoices found matching your search.' : 
              'No invoices yet. Create your first invoice!'
            }
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#6366f1', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Invoice #</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Payment</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice._id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}
                  >
                    <td style={{ padding: '16px', fontWeight: '500' }}>{invoice.invoiceNumber}</td>
                    <td style={{ padding: '16px' }}>{invoice.customerName}</td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>{invoice.customerPhone}</td>
                    <td style={{ padding: '16px', color: '#059669', fontWeight: '600' }}>
                      ₹{invoice.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px' }}>{invoice.paymentMethod}</td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          backgroundColor: 
                            invoice.status === 'Paid' ? '#dcfce7' :
                            invoice.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                          color:
                            invoice.status === 'Paid' ? '#16a34a' :
                            invoice.status === 'Cancelled' ? '#dc2626' : '#ca8a04'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => router.push(`/invoices/${invoice._id}`)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        👁️ View
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