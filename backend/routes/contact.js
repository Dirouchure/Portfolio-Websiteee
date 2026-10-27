const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimit');
const { sendError } = require('../utils/errors');
const { sendContactNotification, sendContactAutoReply } = require('../utils/mail');

// Local persistent file fallback for offline database resilience
const fallbackDir = path.join(__dirname, '..', 'uploads');
const fallbackFilePath = path.join(fallbackDir, 'contact_messages_backup.json');

const ensureContactTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    // If DB is offline, continue gracefully
  }
};

const saveMessageToFile = (msg) => {
  try {
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    let list = [];
    if (fs.existsSync(fallbackFilePath)) {
      const raw = fs.readFileSync(fallbackFilePath, 'utf8');
      list = JSON.parse(raw);
    }
    const newEntry = {
      id: Date.now(),
      ...msg,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    list.unshift(newEntry);
    fs.writeFileSync(fallbackFilePath, JSON.stringify(list, null, 2), 'utf8');
    return newEntry.id;
  } catch (err) {
    console.error('File fallback save error:', err.message);
    return Date.now();
  }
};

const getFallbackMessages = () => {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const raw = fs.readFileSync(fallbackFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('File fallback read error:', err.message);
  }
  return [];
};

router.post('/', contactLimiter, [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('subject').optional().trim(),
  body('message').notEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Please provide a valid name, email address, and message.',
      errors: errors.array() 
    });
  }

  const { name, email, subject, message } = req.body;
  const cleanSubject = (subject && subject.trim()) ? subject.trim() : 'Project Inquiry';
  let insertedId = null;
  let savedToDb = false;

  try {
    await ensureContactTable();
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, cleanSubject, message]
    );
    insertedId = result.insertId;
    savedToDb = true;
  } catch (dbError) {
    console.warn('Database unavailable, safely persisted message to backup file:', dbError.message);
  }

  // Always maintain persistent file backup so messages are never lost
  const fileBackupId = saveMessageToFile({ name, email, subject: cleanSubject, message });
  if (!insertedId) {
    insertedId = fileBackupId;
  }

  // Attempt email notifications
  let notificationSent = false;
  try {
    const notification = await sendContactNotification({ name, email, subject: cleanSubject, message }, db);
    notificationSent = Boolean(notification && notification.sent);
    await sendContactAutoReply({ name, email });
  } catch (mailError) {
    console.warn('Mail notification notice:', mailError.message);
  }

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
    id: insertedId,
    emailSent: notificationSent,
    savedToDb
  });
});

router.get('/', verifyToken, async (req, res) => {
  let dbMessages = [];
  try {
    await ensureContactTable();
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    dbMessages = rows || [];
  } catch (error) {
    console.warn('Database fetch notice in contact GET route:', error.message);
  }

  const fileMessages = getFallbackMessages();
  const allMessages = [...dbMessages];
  for (const fm of fileMessages) {
    if (!allMessages.some(m => m.name === fm.name && m.email === fm.email && m.message === fm.message)) {
      allMessages.push(fm);
    }
  }
  allMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(allMessages);
});

router.put('/:id/read', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await ensureContactTable();
    await db.query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);
  } catch (error) {
    // If DB fails, try updating file fallback
    try {
      const msgs = getFallbackMessages();
      const updated = msgs.map(m => m.id === parseInt(id, 10) ? { ...m, is_read: true } : m);
      fs.writeFileSync(fallbackFilePath, JSON.stringify(updated, null, 2), 'utf8');
    } catch (fErr) {}
  }
  res.json({ message: 'Message marked as read' });
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await ensureContactTable();
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  } catch (error) {
    try {
      const msgs = getFallbackMessages();
      const filtered = msgs.filter(m => m.id !== parseInt(id, 10));
      fs.writeFileSync(fallbackFilePath, JSON.stringify(filtered, null, 2), 'utf8');
    } catch (fErr) {}
  }
  res.json({ message: 'Message deleted successfully' });
});

module.exports = router;
