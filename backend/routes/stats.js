const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { sendError } = require('../utils/errors');

router.get('/', verifyToken, async (req, res) => {
  try {
    const tables = [
      'projects',
      'skills',
      'certificates',
      'experience',
      'education',
      'services',
    ];

    const counts = {};
    for (const table of tables) {
      try {
        const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
        counts[table] = rows[0].count;
      } catch {
        counts[table] = 0;
      }
    }

    try {
      const [messages] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread FROM contact_messages'
      );
      counts.messages = messages[0].total;
      counts.unread_messages = messages[0].unread || 0;
    } catch {
      counts.messages = 0;
      counts.unread_messages = 0;
    }

    res.json(counts);
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

module.exports = router;
