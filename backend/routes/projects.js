const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { sendServerError } = require('../utils/errors');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY is_featured DESC, created_at DESC');
    res.json(rows);
  } catch (error) {
    sendServerError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await db.query('UPDATE projects SET views = views + 1 WHERE id = ?', [id]);
    
    res.json(rows[0]);
  } catch (error) {
    sendServerError(res, error);
  }
});

router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { 
    title, description, technologies, github_url, live_url, category,
    status, client_name, start_date, end_date, duration, team_size,
    project_url, highlights, tags, is_featured
  } = req.body;
  // Save with folder path: projects/filename
  const image = req.file ? 'projects/' + req.file.filename : null;

  try {
    const [result] = await db.query(
      `INSERT INTO projects (
        title, description, technologies, image, github_url, live_url, category,
        status, client_name, start_date, end_date, duration, team_size,
        project_url, highlights, tags, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, technologies, image, github_url, live_url, category,
        status || 'completed', client_name, start_date, end_date, duration, team_size || 1,
        project_url, highlights, tags, is_featured || false
      ]
    );

    res.status(201).json({ message: 'Project added successfully', id: result.insertId });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { 
    title, description, technologies, github_url, live_url, category,
    status, client_name, start_date, end_date, duration, team_size,
    project_url, highlights, tags, is_featured
  } = req.body;

  try {
    let query = `UPDATE projects SET 
      title = ?, description = ?, technologies = ?, github_url = ?, live_url = ?, category = ?,
      status = ?, client_name = ?, start_date = ?, end_date = ?, duration = ?, team_size = ?,
      project_url = ?, highlights = ?, tags = ?, is_featured = ?`;
    
    let params = [
      title, description, technologies, github_url, live_url, category,
      status, client_name, start_date, end_date, duration, team_size,
      project_url, highlights, tags, is_featured
    ];

    if (req.file) {
      query += ', image = ?';
      // Save with folder path: projects/filename
      params.push('projects/' + req.file.filename);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
