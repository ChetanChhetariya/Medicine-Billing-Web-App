'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [discountType, setDiscountType] = useState('amount'); // 'amount' or 'percentage'
  const searchRef = useRef(null);
  
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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter medicines based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(med => 
        med.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMedicines(data.data);
          setFilteredMedicines(data.data);
        } else {
          setMedicines([]);
          setFilteredMedicines([]);
        }
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
      setFilteredMedicines([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleMedicineSelect = (medicine) => {
    setCurrentItem({
      medicine: medicine._id,
      medicineName: medicine.name,
      quantity: 1,
      price: medicine.price,
      availableStock: medicine.quantity
    });
    setSearchTerm(medicine.name);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentItem({
      medicine: '',
      quantity: 1,
      price: 0
    });
    setShowDropdown(false);
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

    clearSearch();
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * formData.discount) / 100;
    }
    return formData.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
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
        discount: calculateDiscount(),
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        status: 'Pending'
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await res.json();

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
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
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back to Invoices
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
        {/* Customer Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Customer Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Contact Number *
            </label>
            <input
              type="text"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              required
            />
          </div>
        </div>

        {/* Items Section with Searchable Dropdown */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Add Items</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* Searchable Medicine Dropdown */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="🔍 Search medicine (e.g., PE, DO, PAR...)"
                  style={{ 
                    width: '100%', 
                    padding: '10px 36px 10px 12px', 
                    border: '2px solid #3b82f6', 
                    borderRadius: '6px', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#6b7280',
                      padding: '4px'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Dropdown List */}
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '2px solid #3b82f6',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((med) => (
                      <div
                        key={med._id}
                        onClick={() => handleMedicineSelect(med)}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                          {med.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          ₹{med.price} • Stock: {med.quantity} • Batch: {med.batchNumber}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                      No medicines found starting with "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              type="number"
              min="1"
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
              placeholder="Quantity"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
            <input
              type="number"
              value={currentItem.price}
              readOnly
              placeholder="Price"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px' }}
            />
            <button
              type="button"
              onClick={addItem}
              style={{ 
                padding: '10px 16px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Add Item
            </button>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Medicine</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Subtotal</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>{item.medicineName}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>₹{item.price}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>₹{item.subtotal.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          style={{ 
                            color: '#ef4444', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '20px', 
                            fontWeight: 'bold',
                            padding: '4px 8px'
                          }}
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

        {/* Payment and Totals with Dual Discount System */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white' }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>

            {/* Dual Discount System */}
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginTop: '16px', marginBottom: '8px', color: '#374151' }}>
              Discount Type
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setDiscountType('amount');
                  setFormData({ ...formData, discount: 0 });
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `2px solid ${discountType === 'amount' ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: discountType === 'amount' ? '#eff6ff' : 'white',
                  color: discountType === 'amount' ? '#3b82f6' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                ₹ Amount
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscountType('percentage');
                  setFormData({ ...formData, discount: 0 });
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `2px solid ${discountType === 'percentage' ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: discountType === 'percentage' ? '#eff6ff' : 'white',
                  color: discountType === 'percentage' ? '#3b82f6' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                % Percentage
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Discount {discountType === 'percentage' ? '(%)' : '(₹)'}
            </label>
            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? 100 : undefined}
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              placeholder={discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount'}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
            {discountType === 'percentage' && formData.discount > 0 && (
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                Discount Amount: ₹{calculateDiscount().toFixed(2)}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal:</span>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            {formData.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ef4444' }}>
                <span style={{ fontSize: '14px' }}>
                  Discount {discountType === 'percentage' ? `(${formData.discount}%)` : ''}:
                </span>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>-₹{calculateDiscount().toFixed(2)}</span>
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
            style={{ 
              padding: '10px 24px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px', 
              backgroundColor: 'white', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
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
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}