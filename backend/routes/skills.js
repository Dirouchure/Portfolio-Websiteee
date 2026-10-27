const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { sendError } = require('../utils/errors');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM skills ORDER BY category, skill_name');
    res.json(rows);
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { skill_name, category, proficiency } = req.body;

  // Validation
  if (!skill_name || skill_name.trim() === '') {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  if (proficiency !== undefined && (proficiency < 0 || proficiency > 100)) {
    return res.status(400).json({ message: 'Proficiency must be between 0 and 100' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO skills (skill_name, category, proficiency) VALUES (?, ?, ?)',
      [skill_name.trim(), category?.trim() || null, proficiency || 50]
    );

    res.status(201).json({ 
      message: 'Skill added successfully', 
      id: result.insertId,
      skill: { id: result.insertId, skill_name, category, proficiency }
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This skill already exists' });
    }
    sendError(res, 500, 'Failed to add skill. Please try again.', error);
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { skill_name, category, proficiency } = req.body;

  // Validation
  if (!skill_name || skill_name.trim() === '') {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  if (proficiency !== undefined && (proficiency < 0 || proficiency > 100)) {
    return res.status(400).json({ message: 'Proficiency must be between 0 and 100' });
  }

  try {
    const [result] = await db.query(
      'UPDATE skills SET skill_name = ?, category = ?, proficiency = ? WHERE id = ?',
      [skill_name.trim(), category?.trim() || null, proficiency || 50, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    sendError(res, 500, 'Failed to update skill. Please try again.', error);
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

module.exports = router;
