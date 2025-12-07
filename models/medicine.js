import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);