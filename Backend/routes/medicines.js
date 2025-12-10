const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find({}).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// GET single medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
});

// POST create new medicine
router.post('/', async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Error creating medicine:', error);
    
    // Handle duplicate batch number error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'A medicine with this batch number already exists' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});

// PUT update medicine by ID
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error('Error updating medicine:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

// DELETE medicine by ID
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

module.exports = router;