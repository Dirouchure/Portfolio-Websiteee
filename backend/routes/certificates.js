const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM certificates ORDER BY issue_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { title, organization, issue_date } = req.body;
  const certificate_image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'INSERT INTO certificates (title, organization, issue_date, certificate_image) VALUES (?, ?, ?, ?)',
      [title, organization, issue_date, certificate_image]
    );

    res.status(201).json({ message: 'Certificate added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, organization, issue_date } = req.body;

  try {
    let query = 'UPDATE certificates SET title = ?, organization = ?, issue_date = ?';
    let params = [title, organization, issue_date];

    if (req.file) {
      query += ', certificate_image = ?';
      params.push(req.file.filename);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ message: 'Certificate updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
