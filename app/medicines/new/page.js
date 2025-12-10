'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMedicinePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agencyName: '',
    medicineName: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    price: '',
    minimumStockLevel: '10',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📤 Submitting form data:', formData);

    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (data.success) {
        alert('✅ Medicine added successfully!');
        router.push('/medicines');
      } else {
        const errorMsg = data.message || 'Failed to add medicine';
        setError(errorMsg);
        console.error('❌ API Error:', errorMsg);
      }
    } catch (err) {
      console.error('❌ Catch Error:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/medicines')}
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
          ← Back to Medicines
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
          Add New Medicine
        </h1>
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
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '32px'
      }}>
        {/* Medicine Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Medicine Name *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="medicineName"
            type="text"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="e.g., Paracetamol 500mg"
            required
          />
        </div>

        {/* Agency/Manufacturer Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Agency/Manufacturer Name *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="agencyName"
            type="text"
            value={formData.agencyName}
            onChange={handleChange}
            placeholder="e.g., Cipla Ltd"
            required
          />
        </div>

        {/* Batch Number */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Batch Number *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="batchNumber"
            type="text"
            value={formData.batchNumber}
            onChange={handleChange}
            placeholder="e.g., BTH123456"
            required
          />
        </div>

        {/* Expiry Date */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Expiry Date *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Quantity *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 100"
            required
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Price (₹) *
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 25.50"
            required
          />
        </div>

        {/* Minimum Stock Level */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Minimum Stock Level (for low stock alerts)
          </label>
          <input
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            name="minimumStockLevel"
            type="number"
            min="0"
            value={formData.minimumStockLevel}
            onChange={handleChange}
            placeholder="e.g., 10"
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Notes (Optional)
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              minHeight: '100px',
              resize: 'vertical'
            }}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information..."
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 32px',
              borderRadius: '6px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : '✓ Add Medicine'}
          </button>
          <button
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 32px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            type="button"
            onClick={() => router.push('/medicines')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}