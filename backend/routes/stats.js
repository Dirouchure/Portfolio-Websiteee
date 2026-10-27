const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
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

    let dbTotal = 0;
    let dbUnread = 0;
    try {
      const [messages] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread FROM contact_messages'
      );
      dbTotal = Number(messages[0]?.total || 0);
      dbUnread = Number(messages[0]?.unread || 0);
    } catch (e) {}

    let fileTotal = 0;
    let fileUnread = 0;
    try {
      const fallbackPath = path.join(__dirname, '..', 'uploads', 'contact_messages_backup.json');
      if (fs.existsSync(fallbackPath)) {
        const list = JSON.parse(fs.readFileSync(fallbackPath, 'utf8') || '[]');
        fileTotal = list.length;
        fileUnread = list.filter(m => !m.is_read).length;
      }
    } catch (e) {}

    counts.messages = Math.max(dbTotal, fileTotal);
    counts.unread_messages = Math.max(dbUnread, fileUnread);

    res.json(counts);
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

module.exports = router;
