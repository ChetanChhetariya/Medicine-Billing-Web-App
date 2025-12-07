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
  phone: {
    type: String,
    required: true,
    trim: true
  },
  medicines: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Online'],
    default: 'Cash'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);