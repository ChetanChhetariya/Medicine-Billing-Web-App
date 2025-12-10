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
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '2rem' }}>
      {/* Back Button */}
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
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.75rem'
            }}>
              💊
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
              Medicines
            </h1>
          </div>
          <Link href="/medicines/new" style={{
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
            Add Medicine
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8'
          }} size={20} />
          <input
            type="text"
            placeholder="Search by medicine name, agency, or batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem 1rem 3.5rem',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '1rem',
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
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0'
      }}>
        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9375rem', fontWeight: '500' }}>
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
            <div style={{ 
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid #E2E8F0',
              borderTop: '4px solid #0EA5E9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', fontWeight: '500' }}>Loading medicines...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💊</div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
              {searchTerm ? 'No medicines found matching your search.' : 'No medicines available yet.'}
            </p>
            {!searchTerm && (
              <Link href="/medicines/new" style={{
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
                Add Your First Medicine
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F1F5F9',
                  borderBottom: '2px solid #E2E8F0'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Medicine Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Agency/Manufacturer
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Batch Number
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Expiry Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Quantity
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Price
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Description
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med, idx) => (
                  <tr key={med._id || idx} style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#0F172A', fontSize: '0.9375rem' }}>
                      {getName(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9375rem' }}>
                      {getManufacturer(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                      {getBatch(med)}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }}>
                      {formatDate(getExpiry(med))}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        backgroundColor: getQuantity(med) < 10 ? '#FEE2E2' : '#D1FAE5',
                        color: getQuantity(med) < 10 ? '#DC2626' : '#059669',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        {getQuantity(med)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#0EA5E9', fontWeight: '700', fontSize: '1rem' }}>
                      {formatPrice(getPrice(med))}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9375rem' }} title={getDescription(med) || 'No description'}>
                      {truncateText(getDescription(med), 20)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDelete(med._id)}
                        title="Delete medicine"
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#DC2626';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#EF4444';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
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