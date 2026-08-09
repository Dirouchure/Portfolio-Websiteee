const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM video_reel ORDER BY is_featured DESC, created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM video_reel WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Increment views
router.post('/:id/view', async (req, res) => {
  try {
    await db.query('UPDATE video_reel SET views = views + 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'View counted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add video (protected)
router.post('/', verifyToken, async (req, res) => {
  const { title, description, video_url, video_type, category, duration, is_featured } = req.body;
  
  if (!title || !video_url) {
    return res.status(400).json({ message: 'Title and video URL are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO video_reel (title, description, video_url, video_type, category, duration, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, video_url, video_type || 'youtube', category, duration, is_featured || false]
    );
    res.status(201).json({ message: 'Video added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update video (protected)
router.put('/:id', verifyToken, async (req, res) => {
  const { title, description, video_url, video_type, category, duration, is_featured } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE video_reel SET title = ?, description = ?, video_url = ?, video_type = ?, category = ?, duration = ?, is_featured = ? WHERE id = ?',
      [title, description, video_url, video_type, category, duration, is_featured, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete video (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM video_reel WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
