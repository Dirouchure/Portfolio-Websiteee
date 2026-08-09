const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM education ORDER BY end_year DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { school_name, degree, department, start_year, end_year, description } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO education (school_name, degree, department, start_year, end_year, description) VALUES (?, ?, ?, ?, ?, ?)',
      [school_name, degree, department, start_year, end_year, description]
    );

    res.status(201).json({ message: 'Education added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { school_name, degree, department, start_year, end_year, description } = req.body;

  try {
    await db.query(
      'UPDATE education SET school_name = ?, degree = ?, department = ?, start_year = ?, end_year = ?, description = ? WHERE id = ?',
      [school_name, degree, department, start_year, end_year, description, id]
    );

    res.json({ message: 'Education updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM education WHERE id = ?', [id]);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
