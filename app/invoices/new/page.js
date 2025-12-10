'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    items: [],
    paymentMethod: 'Cash',
    discount: 0
  });

  const [currentItem, setCurrentItem] = useState({
    medicine: '',
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines');
      if (res.ok) {
        const data = await res.json();
        console.log('Medicines API response:', data);
        
        // FIX: Extract the data array from the response
        if (data.success && Array.isArray(data.data)) {
          setMedicines(data.data);
        } else {
          console.error('Invalid medicines data format:', data);
          setMedicines([]);
        }
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
    }
  };

  const handleMedicineSelect = (e) => {
    const medicineId = e.target.value;
    const medicine = medicines.find(m => m._id === medicineId);
    
    if (medicine) {
      setCurrentItem({
        medicine: medicineId,
        medicineName: medicine.medicineName,
        quantity: 1,
        price: medicine.price,
        availableStock: medicine.quantity
      });
    }
  };

  const addItem = () => {
    if (!currentItem.medicine || currentItem.quantity <= 0) {
      alert('Please select a medicine and enter valid quantity');
      return;
    }

    if (currentItem.quantity > currentItem.availableStock) {
      alert(`Only ${currentItem.availableStock} units available in stock`);
      return;
    }

    const itemTotal = currentItem.quantity * currentItem.price;
    
    setFormData({
      ...formData,
      items: [...formData.items, {
        medicineId: currentItem.medicine,
        medicineName: currentItem.medicineName,
        quantity: currentItem.quantity,
        price: currentItem.price,
        subtotal: itemTotal
      }]
    });

    // Reset current item
    setCurrentItem({
      medicine: '',
      quantity: 1,
      price: 0
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (formData.discount || 0);
  };

  const generateInvoiceNumber = () => {
    return `INV-${Date.now()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone) {
      alert('Please enter customer name and contact');
      return;
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setLoading(true);

    try {
      const invoiceData = {
        invoiceNumber: generateInvoiceNumber(),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        items: formData.items,
        subtotal: calculateSubtotal(),
        discount: formData.discount || 0,
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        status: 'Pending'
      };

      console.log('Creating invoice:', invoiceData);

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await res.json();
      console.log('Invoice creation result:', result);

      if (result.success) {
        alert('Invoice created successfully!');
        router.push('/invoices');
      } else {
        alert(`Error: ${result.message || 'Failed to create invoice'}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/invoices')}
          style={{
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '14px'
          }}
        >
          ← Back to Invoices
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
        {/* Customer Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Customer Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Contact Number *
            </label>
            <input
              type="text"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              required
            />
          </div>
        </div>

        {/* Items Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Add Items</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <select
              value={currentItem.medicine}
              onChange={handleMedicineSelect}
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">Select Medicine</option>
              {medicines.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.medicineName} - ₹{med.price} (Stock: {med.quantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
              placeholder="Quantity"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <input
              type="number"
              value={currentItem.price}
              readOnly
              placeholder="Price"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb' }}
            />
            <button
              type="button"
              onClick={addItem}
              style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Add Item
            </button>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Medicine</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Subtotal</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{item.medicineName}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>₹{item.price}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>₹{item.subtotal.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment and Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>
              Discount (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280' }}>Subtotal:</span>
              <span style={{ fontWeight: '600' }}>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            {formData.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ef4444' }}>
                <span>Discount:</span>
                <span style={{ fontWeight: '600' }}>-₹{formData.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', borderTop: '2px solid #d1d5db', paddingTop: '12px', marginTop: '12px' }}>
              <span>Total:</span>
              <span style={{ color: '#059669' }}>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => router.push('/invoices')}
            style={{ padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 24px', 
              backgroundColor: loading ? '#9ca3af' : '#10b981', 
              color: 'white', 
              borderRadius: '6px', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}