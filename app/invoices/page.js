"use client"

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Home, Pill, BarChart3, Plus, Eye, FileText } from 'lucide-react';

export default function InvoiceSystem() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('invoice');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    payment: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  const invoices = [
    {
      id: 'INV-1762426468372',
      customer: 'Ghelubhai Chhetariya',
      phone: '9985647123',
      amount: 2601.43,
      payment: 'Cash',
      status: 'Pending',
      date: '11/6/2025'
    },
    {
      id: 'INV-1760765990871',
      customer: 'Chetan Chhetariya',
      phone: '9876523410',
      amount: 2002.75,
      payment: 'Cash',
      status: 'Pending',
      date: '10/18/2025'
    },
    {
      id: 'INV-1760764910205',
      customer: 'Chetan Ahir',
      phone: '9873985641',
      amount: 1145.00,
      payment: 'Card',
      status: 'Pending',
      date: '10/18/2025'
    },
    {
      id: 'INV-1760534648656',
      customer: 'sujal ahir',
      phone: '7865496547',
      amount: 2590.00,
      payment: 'Cash',
      status: 'Pending',
      date: '10/15/2025'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    let matchesSearch = true;
    
    if (searchQuery) {
      switch(searchBy) {
        case 'invoice':
          matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case 'patient':
          matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case 'mobile':
          matchesSearch = invoice.phone.includes(searchQuery);
          break;
        default:
          matchesSearch = true;
      }
    }

    const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
    const matchesPayment = filters.payment === 'all' || invoice.payment === filters.payment;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Medicine Billing System</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicines
            </button>
            <button className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-gray-700" />
            <h2 className="text-3xl font-bold text-gray-800">Invoices</h2>
          </div>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md">
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-3 items-center">
            {/* Search By Dropdown */}
            <div className="relative">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700 font-medium min-w-[200px]"
              >
                <option value="invoice">Invoice/Receipt No</option>
                <option value="patient">Patient Name</option>
                <option value="mobile">Mobile No</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  searchBy === 'invoice' ? 'Search by invoice/receipt number...' :
                  searchBy === 'patient' ? 'Search by patient name...' :
                  'Search by mobile number...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-300 relative"
            >
              <Filter className="w-5 h-5" />
              More Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear Button */}
            {(searchQuery || activeFiltersCount > 0) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={filters.payment}
                  onChange={(e) => setFilters({...filters, payment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredInvoices.length}</span> of <span className="font-semibold text-gray-800">{invoices.length}</span> invoices
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.phone}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{invoice.payment}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={invoice.status}
                        onChange={(e) => {
                          console.log(`Status changed to: ${e.target.value}`);
                        }}
                        className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full border-none cursor-pointer"
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">No invoices found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}