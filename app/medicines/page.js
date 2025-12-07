'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicinesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    price: '',
    manufacturer: '',
    category: '',
    description: ''
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

    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // FIX: Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error Response:', errorText);
        console.error('Status Code:', response.status);
        setError(`Server error: ${response.status}. Please check if API route exists.`);
        setLoading(false);
        return;
      }

      // FIX: Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON Response:', textResponse);
        setError('Server did not return valid JSON. Check your API route.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert('Medicine added successfully!');
        // Reset form
        setFormData({
          name: '',
          batchNumber: '',
          expiryDate: '',
          quantity: '',
          price: '',
          manufacturer: '',
          category: '',
          description: ''
        });
      } else {
        setError(data.message || 'Failed to add medicine');
      }
    } catch (err) {
      console.error('Catch Error:', err);
      setError('An error occurred while adding medicine. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Add New Medicine
      </h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          color: '#c33',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '32px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Medicine Name *
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Manufacturer
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="manufacturer"
            type="text"
            value={formData.manufacturer}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Category
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Batch Number *
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="batchNumber"
            type="text"
            value={formData.batchNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Expiry Date *
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Quantity *
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Price *
          </label>
          <input
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px'
            }}
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Medicine'}
          </button>
          <button
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
            type="button"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}