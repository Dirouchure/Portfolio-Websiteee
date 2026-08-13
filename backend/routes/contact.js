const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimit');
const { sendError } = require('../utils/errors');
const { sendContactNotification, sendContactAutoReply } = require('../utils/mail');

router.post('/', contactLimiter, [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('subject').optional().trim(),
  body('message').notEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    const notification = await sendContactNotification({ name, email, subject, message }, db);
    const autoReply = await sendContactAutoReply({ name, email });

    const response = {
      message: 'Message sent successfully',
      id: result.insertId,
      emailSent: notification.sent,
    };

    if (!notification.sent && notification.reason === 'not_configured') {
      response.message = 'Message received successfully';
    } else if (!notification.sent) {
      response.message = 'Message received — email notification could not be sent';
    }

    if (autoReply.sent) {
      response.autoReplySent = true;
    }

    res.status(201).json(response);
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

router.put('/:id/read', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Server error', error);
  }
});

module.exports = router;
