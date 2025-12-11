'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const storeConfig = {
    name: "Dwarkesh Medical",
    address: "Shop No.581, Nr Meghaji Pethraj Chhatralay, Jadeswar Road, Khambhalia",
    dlNo: "GJ-DBD-259547",
    phone: "+918488956256", 
    logoPath: "/invoicemedicallogo.jpg" 
  };

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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '20px', color: '#6b7280', fontFamily: 'Georgia, serif' }}>
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
          padding: '14px 18px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '16px'
        }}>
          {error || 'Invoice not found'}
        </div>
        <button
          onClick={() => router.push('/invoices')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-invoice { 
            box-shadow: none !important; 
            border: none !important;
            padding: 20px !important;
          }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Actions - Hidden on Print */}
        <div className="no-print" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '24px'
        }}>
          <button
            onClick={() => router.push('/invoices')}
            style={{
              backgroundColor: '#e5e7eb',
              color: '#374151',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              fontFamily: 'Georgia, serif'
            }}
          >
            ← Back to Invoices
          </button>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: 'Georgia, serif'
            }}
          >
            🖨️ Print Invoice
          </button>
        </div>

        {/* Invoice - Professional Format */}
        <div className="print-invoice" style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontFamily: 'Georgia, serif'
        }}>
          
          {/* Store Header with Logo */}
          <div style={{ 
            borderBottom: '3px solid #000', 
            paddingBottom: '20px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Logo */}
            <div style={{ 
              width: '90px', 
              height: '90px', 
              flexShrink: 0
            }}>
              <img
                src={storeConfig.logoPath}
                alt="Medical Logo"
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  objectFit: 'contain' 
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Store Name - One Line */}
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '42px', 
                fontWeight: '700', 
                margin: '0',
                color: '#1e3a8a',
                letterSpacing: '1px',
                fontFamily: 'Georgia, serif'
              }}>
                {storeConfig.name}
              </h1>
            </div>
          </div>

          {/* Contact Info - Full Width */}
          <div style={{ 
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#333',
            marginBottom: '24px',
            fontFamily: 'Georgia, serif'
          }}>
            <div style={{ marginBottom: '6px' }}>
              <strong>Mobile:</strong> {storeConfig.phone}
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Address:</strong> {storeConfig.address}
            </div>
            <div>
              <strong>DL No.:</strong> {storeConfig.dlNo}
            </div>
          </div>

          {/* Bill Info Header */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '28px',
            fontSize: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Bill Number:</strong> {invoice.invoiceNumber}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Bill Date Time:</strong> {formatDate(invoice.createdAt)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Payer Name:</strong> {invoice.paymentMethod?.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Name:</strong> {invoice.customerName}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Mobile:</strong> {invoice.customerPhone}
              </div>
            </div>
          </div>

          {/* Bill Details Title */}
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '12px 18px',
            fontWeight: 'bold',
            fontSize: '17px',
            marginBottom: '18px',
            borderRadius: '4px',
            fontFamily: 'Georgia, serif'
          }}>
            BILL DETAILS
          </div>

          {/* Items Table */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '15px',
            marginBottom: '28px',
            fontFamily: 'Georgia, serif'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '14px 10px', textAlign: 'left', fontWeight: 'bold' }}>S.No.</th>
                <th style={{ padding: '14px 10px', textAlign: 'left', fontWeight: 'bold' }}>Item/Batch</th>
                <th style={{ padding: '14px 10px', textAlign: 'center', fontWeight: 'bold' }}>Qty</th>
                <th style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>Price</th>
                <th style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>CGST</th>
                <th style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>SGST</th>
                <th style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>Tax Amt</th>
                <th style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>Net Amt</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => {
                const medicineData = item.medicineId || {};
                const cgst = item.cgst || 0;
                const sgst = item.sgst || 0;
                const taxAmt = (item.subtotal || 0) - (cgst + sgst);
                
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '14px 10px' }}>{index + 1}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {item.medicineName || 'N/A'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {medicineData.batchNumber || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>₹{item.price?.toFixed(2)}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>₹{cgst.toFixed(2)}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>₹{sgst.toFixed(2)}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>₹{taxAmt.toFixed(2)}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 'bold' }}>
                      ₹{item.subtotal?.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Receipt Details Section */}
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '12px 18px',
            fontWeight: 'bold',
            fontSize: '17px',
            marginBottom: '18px',
            borderRadius: '4px',
            fontFamily: 'Georgia, serif'
          }}>
            RECEIPT DETAILS
          </div>

          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '15px',
            marginBottom: '24px',
            fontFamily: 'Georgia, serif'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>S.No.</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>Mode</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>Receipt Date Time</th>
                <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold' }}>Net Amt</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>Transaction Type</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 10px' }}>1</td>
                <td style={{ padding: '12px 10px' }}>{invoice.paymentMethod}</td>
                <td style={{ padding: '12px 10px' }}>{formatDate(invoice.createdAt)}</td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold' }}>
                  ₹{invoice.totalAmount?.toFixed(2)}
                </td>
                <td style={{ padding: '12px 10px' }}>
                  {invoice.status === 'Paid' ? 'Paid Settlement' : invoice.status}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terms and Conditions in Gujarati */}
          <div style={{ 
            fontSize: '13px', 
            lineHeight: '1.8',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            fontFamily: 'Georgia, serif'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>દવા પરત કરવાના નિયમો:</div>
            <div>૧. દવા પરત કરવા માટે ઓછામાં ઓછી 5 નંગ હોવા જોઈએ.</div>
            <div>૨. ખરીદીના 30 દિવસની અંદર જ દવા પરત થઈ શકે છે.</div>
            <div>૩. જે દવાઓ ફ્રિજમાં રાખવાની જરૂર હોય એવી દવાઓ પાછી નહીં લેવાય.</div>
            <div>૪. દવાઓ પરત કરવા માટે મૂળ બિલ હોવું જરૂરી છે.</div>
          </div>

          {/* Total Summary */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            fontSize: '15px',
            paddingTop: '16px',
            borderTop: '2px solid #ddd',
            fontFamily: 'Georgia, serif'
          }}>
            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Amount:</div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', minWidth: '120px' }}>
              ₹{invoice.subtotal?.toFixed(2) || '0.00'}
            </div>
            
            {invoice.discount > 0 && (
              <>
                <div style={{ textAlign: 'right', color: '#dc2626' }}>Discount:</div>
                <div style={{ textAlign: 'right', color: '#dc2626', minWidth: '120px' }}>
                  -₹{invoice.discount?.toFixed(2)}
                </div>
              </>
            )}
            
            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>Net Amount:</div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', minWidth: '120px' }}>
              ₹{invoice.totalAmount?.toFixed(2)}
            </div>
            
            <div style={{ textAlign: 'right' }}>Received Amount:</div>
            <div style={{ textAlign: 'right', minWidth: '120px' }}>
              ₹{Math.ceil(invoice.totalAmount || 0)}
            </div>
            
            <div style={{ textAlign: 'right' }}>Refunded Amount:</div>
            <div style={{ textAlign: 'right', minWidth: '120px' }}>₹0</div>
          </div>

          {/* Footer Note */}
          <div style={{ 
            marginTop: '20px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#666',
            fontFamily: 'Georgia, serif'
          }}>
            આ બિલ નવા GST2.0 નિયમ મુજબ બનેલ છે
          </div>

          {/* Print Info */}
          <div style={{ 
            marginTop: '24px',
            paddingTop: '14px',
            borderTop: '1px solid #ddd',
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Georgia, serif'
          }}>
            <div>Printed By: System</div>
            <div>Print Date & Time: {formatDate(new Date())}</div>
          </div>
        </div>
      </div>
    </>
  );
}