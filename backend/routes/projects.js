const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { sendServerError } = require('../utils/errors');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    await ensureProjectsTable();
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

const sanitizeProjectInput = (body) => {
  const { 
    title, description, technologies, github_url, live_url, category,
    status, client_name, start_date, end_date, duration, team_size,
    project_url, highlights, tags, is_featured
  } = body;

  const validStatuses = ['completed', 'in-progress', 'planning'];
  const cleanStatus = validStatuses.includes(status) ? status : 'completed';

  const cleanStartDate = (start_date && typeof start_date === 'string' && start_date.trim() !== '')
    ? start_date.trim()
    : null;

  const cleanEndDate = (end_date && typeof end_date === 'string' && end_date.trim() !== '')
    ? end_date.trim()
    : null;

  const parsedTeamSize = parseInt(team_size, 10);
  const cleanTeamSize = (!isNaN(parsedTeamSize) && parsedTeamSize > 0) ? parsedTeamSize : 1;

  const cleanIsFeatured = (is_featured === true || is_featured === 'true' || is_featured === 1 || is_featured === '1') ? 1 : 0;

  return {
    title: (title && typeof title === 'string') ? title.trim() : '',
    description: (description && description.trim()) ? description.trim() : null,
    technologies: (technologies && technologies.trim()) ? technologies.trim() : null,
    github_url: (github_url && github_url.trim()) ? github_url.trim() : null,
    live_url: (live_url && live_url.trim()) ? live_url.trim() : null,
    category: (category && category.trim()) ? category.trim() : null,
    status: cleanStatus,
    client_name: (client_name && client_name.trim()) ? client_name.trim() : null,
    start_date: cleanStartDate,
    end_date: cleanEndDate,
    duration: (duration && duration.trim()) ? duration.trim() : null,
    team_size: cleanTeamSize,
    project_url: (project_url && project_url.trim()) ? project_url.trim() : null,
    highlights: (highlights && highlights.trim()) ? highlights.trim() : null,
    tags: (tags && tags.trim()) ? tags.trim() : null,
    is_featured: cleanIsFeatured
  };
};

async function ensureProjectsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        highlights TEXT,
        technologies VARCHAR(255),
        tags VARCHAR(255),
        image VARCHAR(255),
        github_url VARCHAR(255),
        live_url VARCHAR(255),
        project_url VARCHAR(255),
        category VARCHAR(50),
        status ENUM('completed', 'in-progress', 'planning') DEFAULT 'completed',
        client_name VARCHAR(200),
        start_date DATE,
        end_date DATE,
        duration VARCHAR(50),
        team_size INT DEFAULT 1,
        is_featured BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure all columns exist in case table was created with older schema
    const columns = [
      { name: 'highlights', sql: 'ALTER TABLE projects ADD COLUMN highlights TEXT' },
      { name: 'technologies', sql: 'ALTER TABLE projects ADD COLUMN technologies VARCHAR(255)' },
      { name: 'tags', sql: 'ALTER TABLE projects ADD COLUMN tags VARCHAR(255)' },
      { name: 'github_url', sql: 'ALTER TABLE projects ADD COLUMN github_url VARCHAR(255)' },
      { name: 'live_url', sql: 'ALTER TABLE projects ADD COLUMN live_url VARCHAR(255)' },
      { name: 'project_url', sql: 'ALTER TABLE projects ADD COLUMN project_url VARCHAR(255)' },
      { name: 'category', sql: 'ALTER TABLE projects ADD COLUMN category VARCHAR(50)' },
      { name: 'status', sql: "ALTER TABLE projects ADD COLUMN status ENUM('completed', 'in-progress', 'planning') DEFAULT 'completed'" },
      { name: 'client_name', sql: 'ALTER TABLE projects ADD COLUMN client_name VARCHAR(200)' },
      { name: 'start_date', sql: 'ALTER TABLE projects ADD COLUMN start_date DATE' },
      { name: 'end_date', sql: 'ALTER TABLE projects ADD COLUMN end_date DATE' },
      { name: 'duration', sql: 'ALTER TABLE projects ADD COLUMN duration VARCHAR(50)' },
      { name: 'team_size', sql: 'ALTER TABLE projects ADD COLUMN team_size INT DEFAULT 1' },
      { name: 'is_featured', sql: 'ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT FALSE' },
      { name: 'views', sql: 'ALTER TABLE projects ADD COLUMN views INT DEFAULT 0' }
    ];

    for (const col of columns) {
      try {
        const [existing] = await db.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = ?`,
          [col.name]
        );
        if (existing.length === 0) {
          await db.query(col.sql);
        }
      } catch (e) {
        // Continue if column already exists or schema cannot be queried
      }
    }

    // Auto-seed Online Examination System if not present
    try {
      const [existingProject] = await db.query(
        "SELECT id FROM projects WHERE title LIKE '%Online Examination%'"
      );
      if (existingProject.length === 0) {
        await db.query(
          `INSERT INTO projects (
            title, description, highlights, technologies, tags, github_url, live_url, category, status, duration, team_size, is_featured, views
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'Online Examination System',
            'A comprehensive, web-based online examination and assessment platform featuring automated grading, timed tests, role-based student and instructor portals, secure submissions, and comprehensive analytics.',
            'Automated evaluation and grading, Timed examination session management, Role-based student and instructor portals, Real-time scorecards and performance analytics',
            'React.js, Node.js, Express.js, MySQL Database, REST API',
            'react, nodejs, express, mysql, database, examination, online-exam, education',
            'https://github.com/Dirouchure/online-examination-system',
            'https://github.com/Dirouchure/online-examination-system',
            'Web Application',
            'completed',
            '1 month',
            1,
            1,
            185
          ]
        );
      }
    } catch (e) {
      // Ignore if table query fails
    }
  } catch (err) {
    console.error('ensureProjectsTable notice:', err.message);
  }
};

router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const clean = sanitizeProjectInput(req.body);

  if (!clean.title) {
    return res.status(400).json({ message: 'Project title is required' });
  }

  // Save with folder path: projects/filename
  const image = req.file ? 'projects/' + req.file.filename : null;

  try {
    await ensureProjectsTable();
    const [result] = await db.query(
      `INSERT INTO projects (
        title, description, technologies, image, github_url, live_url, category,
        status, client_name, start_date, end_date, duration, team_size,
        project_url, highlights, tags, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clean.title, clean.description, clean.technologies, image,
        clean.github_url, clean.live_url, clean.category,
        clean.status, clean.client_name, clean.start_date, clean.end_date,
        clean.duration, clean.team_size, clean.project_url,
        clean.highlights, clean.tags, clean.is_featured
      ]
    );

    res.status(201).json({ message: 'Project added successfully', id: result.insertId });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'Cannot connect to MySQL database. Please make sure MySQL is started in XAMPP.',
        error: error.message
      });
    }
    return res.status(500).json({
      message: 'Failed to add project to database',
      error: error.message
    });
  }
});

router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const clean = sanitizeProjectInput(req.body);

  if (!clean.title) {
    return res.status(400).json({ message: 'Project title is required' });
  }

  try {
    await ensureProjectsTable();
    let query = `UPDATE projects SET 
      title = ?, description = ?, technologies = ?, github_url = ?, live_url = ?, category = ?,
      status = ?, client_name = ?, start_date = ?, end_date = ?, duration = ?, team_size = ?,
      project_url = ?, highlights = ?, tags = ?, is_featured = ?`;
    
    let params = [
      clean.title, clean.description, clean.technologies, clean.github_url, clean.live_url, clean.category,
      clean.status, clean.client_name, clean.start_date, clean.end_date, clean.duration, clean.team_size,
      clean.project_url, clean.highlights, clean.tags, clean.is_featured
    ];

    if (req.file) {
      query += ', image = ?';
      // Save with folder path: projects/filename
      params.push('projects/' + req.file.filename);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);

    // If no row was updated because this project ID does not exist in MySQL yet, insert it!
    if (result.affectedRows === 0) {
      const [existing] = await db.query('SELECT id FROM projects WHERE id = ?', [id]);
      if (existing.length === 0) {
        const image = req.file ? 'projects/' + req.file.filename : null;
        await db.query(
          `INSERT INTO projects (
            id, title, description, technologies, image, github_url, live_url, category,
            status, client_name, start_date, end_date, duration, team_size,
            project_url, highlights, tags, is_featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, clean.title, clean.description, clean.technologies, image,
            clean.github_url, clean.live_url, clean.category,
            clean.status, clean.client_name, clean.start_date, clean.end_date,
            clean.duration, clean.team_size, clean.project_url,
            clean.highlights, clean.tags, clean.is_featured
          ]
        );
      }
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'Cannot connect to MySQL database. Please make sure MySQL is started in XAMPP.',
        error: error.message
      });
    }
    return res.status(500).json({
      message: 'Failed to update project in database',
      error: error.message
    });
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
