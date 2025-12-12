import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  doctorName: {
    type: String,
    trim: true,
    maxlength: 30,
    default: ''
  },
  items: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: String,
    quantity: Number,
    price: Number,
    gstRate: {
      type: Number,
      default: 12  // Default GST rate 12% (6% CGST + 6% SGST)
    },
    cgst: {
      type: Number,
      default: 0
    },
    sgst: {
      type: Number,
      default: 0
    },
    subtotal: Number  // Total including GST
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI'],  // Updated: Removed 'Card' and 'POS'
    default: 'Cash'
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Paid'
  }
}, {
  timestamps: true
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);