const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { sendServerError } = require('../utils/errors');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM experience ORDER BY start_date DESC');
    res.json(rows);
  } catch (error) {
    sendServerError(res, error);
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { company_name, position, start_date, end_date, is_current, responsibilities, technologies } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO experience (company_name, position, start_date, end_date, is_current, responsibilities, technologies) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [company_name, position, start_date, end_date, is_current, responsibilities, technologies]
    );

    res.status(201).json({ message: 'Experience added successfully', id: result.insertId });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { company_name, position, start_date, end_date, is_current, responsibilities, technologies } = req.body;

  try {
    await db.query(
      'UPDATE experience SET company_name = ?, position = ?, start_date = ?, end_date = ?, is_current = ?, responsibilities = ?, technologies = ? WHERE id = ?',
      [company_name, position, start_date, end_date, is_current, responsibilities, technologies, id]
    );

    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM experience WHERE id = ?', [id]);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
