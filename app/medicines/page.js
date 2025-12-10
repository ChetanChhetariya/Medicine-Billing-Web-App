'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
      const data = await response.json();
      if (data.success) {
        setMedicines(data.data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMedicines(medicines.filter(med => med._id !== id));
        alert('Medicine deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete medicine. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('An error occurred while deleting the medicine. Please check your connection and try again.');
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const searchLower = searchTerm.toLowerCase();
    const name = (med.name || med.medicineName || '').toLowerCase();
    const manufacturer = (med.manufacturer || med.agency || med.companyName || '').toLowerCase();
    const batch = (med.batchNumber || med.batch || '').toLowerCase();
    
    return name.includes(searchLower) || 
           manufacturer.includes(searchLower) || 
           batch.includes(searchLower);
  });

  const truncateText = (text, maxLength) => {
    if (!text) return 'N/A';
    const str = String(text);
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(numPrice)) return 'N/A';
    return `₹${numPrice.toFixed(2)}`;
  };

  const getName = (med) => {
    return med.name || med.medicineName || 'N/A';
  };

  const getManufacturer = (med) => {
    return med.manufacturer || med.agency || med.companyName || 'N/A';
  };

  const getBatch = (med) => {
    return med.batchNumber || med.batch || 'N/A';
  };

  const getExpiry = (med) => {
    return med.expiryDate || med.expiry || null;
  };

  const getQuantity = (med) => {
    const qty = med.quantity || med.stock || 0;
    return typeof qty === 'number' ? qty : parseInt(qty) || 0;
  };

  const getPrice = (med) => {
    return med.price || med.sellingPrice || med.mrp || 0;
  };

  const getDescription = (med) => {
    return med.description || med.notes || med.info || '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      {/* Back Button - Separate at top left */}
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          textDecoration: 'none',
          color: '#374151',
          fontWeight: '600',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Pill style={{ color: '#ec4899' }} size={32} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Medicines
            </h1>
          </div>
          <Link href="/medicines/new" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={20} />
            Add Medicine
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} size={20} />
          <input
            type="text"
            placeholder="Search by medicine name, agency, or batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 3rem',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #8b5cf6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '1rem' }}>Loading medicines...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
            <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
              {searchTerm ? 'No medicines found matching your search.' : 'No medicines available yet.'}
            </p>
            {!searchTerm && (
              <Link href="/medicines/new" style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                Add Your First Medicine
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  color: '#fff'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderRadius: '10px 0 0 0', whiteSpace: 'nowrap' }}>
                    Medicine Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Agency/Manufacturer
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Batch Number
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Expiry Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Quantity
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Price
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Description
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderRadius: '0 10px 0 0', whiteSpace: 'nowrap' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med, idx) => (
                  <tr key={med._id || idx} style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>
                      {getName(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.95rem' }}>
                      {getManufacturer(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.95rem' }}>
                      {getBatch(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.95rem' }}>
                      {formatDate(getExpiry(med))}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        backgroundColor: getQuantity(med) < 10 ? '#fee2e2' : '#d1fae5',
                        color: getQuantity(med) < 10 ? '#dc2626' : '#059669',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {getQuantity(med)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#8b5cf6', fontWeight: '700', fontSize: '0.95rem' }}>
                      {formatPrice(getPrice(med))}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.95rem' }} title={getDescription(med) || 'No description'}>
                      {truncateText(getDescription(med), 20)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDelete(med._id)}
                        title="Delete medicine"
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#b91c1c';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Trash2 size={16} />
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