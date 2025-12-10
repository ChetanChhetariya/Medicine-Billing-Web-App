'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invoices/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const data = await response.json();
      
      if (data.success) {
        setInvoice(data.data);
      } else {
        setError(data.message || 'Failed to load invoice');
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {error || 'Invoice not found'}
        </div>
        <button
          onClick={() => router.push('/invoices')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        '@media print': { display: 'none' }
      }}>
        <button
          onClick={() => router.push('/invoices')}
          style={{
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ← Back to Invoices
        </button>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* Invoice */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        {/* Invoice Header */}
        <div style={{ 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px', 
          marginBottom: '30px' 
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            INVOICE
          </h1>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>
            {invoice.invoiceNumber}
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            Date: {new Date(invoice.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
            BILL TO:
          </h3>
          <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>
            {invoice.customerName}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Phone: {invoice.customerPhone}
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Item</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Qty</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{item.medicineName}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ color: '#6b7280' }}>Subtotal:</span>
              <span style={{ fontWeight: '500' }}>₹{invoice.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            
            {invoice.discount > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #e5e7eb',
                color: '#ef4444'
              }}>
                <span>Discount:</span>
                <span style={{ fontWeight: '500' }}>-₹{invoice.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              fontSize: '20px',
              fontWeight: 'bold',
              borderTop: '2px solid #e5e7eb',
              marginTop: '8px'
            }}>
              <span>Total:</span>
              <span style={{ color: '#059669' }}>₹{invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div style={{ 
          marginTop: '30px', 
          padding: '16px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '6px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280' }}>Payment Method:</span>
            <span style={{ fontWeight: '500' }}>{invoice.paymentMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>Status:</span>
            <span style={{ 
              fontWeight: '500',
              color: invoice.status === 'Paid' ? '#059669' : 
                     invoice.status === 'Cancelled' ? '#dc2626' : '#ca8a04'
            }}>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '2px solid #e5e7eb',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          Thank you for your business!
        </div>
      </div>
    </div>
  );
}