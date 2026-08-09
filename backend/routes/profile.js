const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profile LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/', verifyToken, async (req, res) => {
  const { full_name, title, bio, objective, phone, email, location, github_url, linkedin_url, twitter_url } = req.body;

  try {
    await db.query(
      `UPDATE profile SET full_name = ?, title = ?, bio = ?, objective = ?, 
       phone = ?, email = ?, location = ?, github_url = ?, linkedin_url = ?, twitter_url = ? WHERE id = 1`,
      [full_name, title, bio, objective, phone, email, location, github_url, linkedin_url, twitter_url]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/upload-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const filename = req.file.filename;
    await db.query('UPDATE profile SET profile_image = ? WHERE id = 1', [filename]);
    res.json({ message: 'Image uploaded successfully', filename });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/upload-resume', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    const filename = req.file.filename;
    await db.query('UPDATE profile SET resume_file = ? WHERE id = 1', [filename]);
    res.json({ message: 'Resume uploaded successfully', filename });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
