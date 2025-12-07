'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientContact: '',
    items: [],
    paymentMethod: 'Cash',
    discount: 0,
    gstRate: 5 // Default 5% GST for medicines
  });

  const [currentItem, setCurrentItem] = useState({
    medicine: '',
    quantity: 1,
    price: 0,
    gstRate: 5 // Medicine-specific GST rate
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines');
      if (res.ok) {
        const data = await res.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const handleMedicineSelect = (e) => {
    const medicineId = e.target.value;
    const medicine = medicines.find(m => m._id === medicineId);
    
    if (medicine) {
      setCurrentItem({
        medicine: medicineId,
        medicineName: medicine.name,
        quantity: 1,
        price: medicine.price,
        stock: medicine.stock,
        gstRate: medicine.gstRate || 5 // Use medicine's GST rate or default 5%
      });
    }
  };

  const addItem = () => {
    if (!currentItem.medicine || currentItem.quantity <= 0) {
      alert('Please select a medicine and enter valid quantity');
      return;
    }

    if (currentItem.quantity > currentItem.stock) {
      alert(`Only ${currentItem.stock} units available in stock`);
      return;
    }

    const itemTotal = currentItem.quantity * currentItem.price;
    
    setFormData({
      ...formData,
      items: [...formData.items, {
        medicine: currentItem.medicine,
        medicineName: currentItem.medicineName,
        quantity: currentItem.quantity,
        price: currentItem.price,
        gstRate: currentItem.gstRate,
        subtotal: itemTotal
      }]
    });

    setCurrentItem({
      medicine: '',
      quantity: 1,
      price: 0,
      gstRate: 5
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateCGST = () => {
    // CGST is half of total GST (split equally between CGST and SGST)
    let totalCGST = 0;
    formData.items.forEach(item => {
      const gstAmount = (item.subtotal * item.gstRate) / 100;
      totalCGST += gstAmount / 2; // CGST is 50% of total GST
    });
    return totalCGST;
  };

  const calculateSGST = () => {
    // SGST is half of total GST (split equally between CGST and SGST)
    let totalSGST = 0;
    formData.items.forEach(item => {
      const gstAmount = (item.subtotal * item.gstRate) / 100;
      totalSGST += gstAmount / 2; // SGST is 50% of total GST
    });
    return totalSGST;
  };

  const calculateTotalGST = () => {
    return calculateCGST() + calculateSGST();
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalGST() - (formData.discount || 0);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV${year}${month}${day}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.patientContact) {
      alert('Please enter patient name and contact');
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
        patientName: formData.patientName,
        patientContact: formData.patientContact,
        items: formData.items.map(item => ({
          medicine: item.medicine,
          quantity: item.quantity,
          price: item.price,
          gstRate: item.gstRate
        })),
        subtotal: calculateSubtotal(),
        cgst: calculateCGST(),
        sgst: calculateSGST(),
        totalGst: calculateTotalGST(),
        discount: formData.discount || 0,
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        date: new Date()
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (res.ok) {
        alert('Invoice created successfully!');
        router.push('/invoices');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to create invoice'}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Invoice</h1>
        <p className="text-sm text-gray-600 mt-2">
          * GST rates: Life-saving drugs (0% or exempt) | Most medicines (5%) | Some items (12-18%)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Patient Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Patient Name *</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Number *</label>
            <input
              type="text"
              value={formData.patientContact}
              onChange={(e) => setFormData({ ...formData, patientContact: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          
          <div className="grid grid-cols-12 gap-2 mb-4">
            <div className="col-span-5">
              <select
                value={currentItem.medicine}
                onChange={handleMedicineSelect}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Medicine</option>
                {medicines.map((med) => (
                  <option key={med._id} value={med._id}>
                    {med.name} - ₹{med.price} (Stock: {med.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                placeholder="Qty"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={currentItem.price}
                readOnly
                placeholder="Price"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                value={currentItem.gstRate}
                onChange={(e) => setCurrentItem({ ...currentItem, gstRate: parseFloat(e.target.value) || 5 })}
                placeholder="GST%"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="18"
                step="0.01"
              />
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={addItem}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Medicine</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-center">GST%</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.medicineName}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">₹{item.price}</td>
                      <td className="px-4 py-2 text-center">{item.gstRate}%</td>
                      <td className="px-4 py-2 text-right">₹{item.subtotal.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 font-bold"
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>

            <label className="block text-sm font-medium mb-2 mt-4">Discount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700">CGST:</span>
                <span className="font-semibold text-blue-600">₹{calculateCGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">SGST:</span>
                <span className="font-semibold text-blue-600">₹{calculateSGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-700">Total GST:</span>
                <span className="text-blue-600">₹{calculateTotalGST().toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{formData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t-2 pt-2 mt-2">
                <span>Grand Total:</span>
                <span className="text-green-600">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GST Information Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">GST Information for Pharmaceutical Products:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Life-saving drugs: Exempt or 0% GST</li>
            <li>• Most medicines: 5% GST (as per 56th GST Council meeting)</li>
            <li>• Some medical goods: 12% or 18% GST</li>
            <li>• GST is split equally between CGST and SGST for intra-state transactions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/invoices')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}