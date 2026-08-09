const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Get all services
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add service (protected)
router.post('/', verifyToken, async (req, res) => {
  const { service_name, description, icon, price, duration, features, is_active, display_order } = req.body;
  
  if (!service_name) {
    return res.status(400).json({ message: 'Service name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO services (service_name, description, icon, price, duration, features, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [service_name, description, icon || 'video', price, duration, features, is_active !== false, display_order || 0]
    );
    res.status(201).json({ message: 'Service added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service (protected)
router.put('/:id', verifyToken, async (req, res) => {
  const { service_name, description, icon, price, duration, features, is_active, display_order } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE services SET service_name = ?, description = ?, icon = ?, price = ?, duration = ?, features = ?, is_active = ?, display_order = ? WHERE id = ?',
      [service_name, description, icon, price, duration, features, is_active, display_order, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
