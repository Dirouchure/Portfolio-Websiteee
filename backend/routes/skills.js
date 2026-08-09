const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM skills ORDER BY category, skill_name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { skill_name, category, proficiency } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO skills (skill_name, category, proficiency) VALUES (?, ?, ?)',
      [skill_name, category, proficiency]
    );

    res.status(201).json({ message: 'Skill added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { skill_name, category, proficiency } = req.body;

  try {
    await db.query(
      'UPDATE skills SET skill_name = ?, category = ?, proficiency = ? WHERE id = ?',
      [skill_name, category, proficiency, id]
    );

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
