const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendServerError } = require('../utils/errors');

const resolveUploadPath = (storedPath) => {
  if (!storedPath) return storedPath;

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const directPath = path.join(uploadsDir, storedPath);

  if (fs.existsSync(directPath)) {
    return storedPath;
  }

  // Legacy: filename stored without subfolder but file moved to profile/
  if (!storedPath.includes('/')) {
    const profilePath = `profile/${storedPath}`;
    if (fs.existsSync(path.join(uploadsDir, profilePath))) {
      return profilePath;
    }
  }

  // Legacy: stored with profile/ prefix but file in uploads root
  if (storedPath.startsWith('profile/')) {
    const rootFile = storedPath.replace('profile/', '');
    if (fs.existsSync(path.join(uploadsDir, rootFile))) {
      return rootFile;
    }
  }

  return storedPath;
};

const formatProfile = (profile) => {
  if (!profile) return {};
  return {
    ...profile,
    profile_image: resolveUploadPath(profile.profile_image),
    resume_file: resolveUploadPath(profile.resume_file),
  };
};

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const [rows] = await db.query('SELECT * FROM profile LIMIT 1');
    res.json(formatProfile(rows[0]));
  } catch (error) {
    sendServerError(res, error);
  }
});

router.put('/', verifyToken, async (req, res) => {
  const { full_name, title, bio, objective, phone, email, location, github_url, linkedin_url, twitter_url } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE profile SET full_name = ?, title = ?, bio = ?, objective = ?, 
       phone = ?, email = ?, location = ?, github_url = ?, linkedin_url = ?, twitter_url = ? WHERE id = 1`,
      [full_name, title, bio, objective, phone, email, location, github_url, linkedin_url, twitter_url]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const [rows] = await db.query('SELECT * FROM profile WHERE id = 1');
    res.json({ message: 'Profile updated successfully', profile: formatProfile(rows[0]) });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.post('/upload-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const filename = 'profile/' + req.file.filename;
    await db.query('UPDATE profile SET profile_image = ? WHERE id = 1', [filename]);
    const [rows] = await db.query('SELECT * FROM profile WHERE id = 1');
    res.json({ message: 'Image uploaded successfully', filename, profile: formatProfile(rows[0]) });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.post('/upload-resume', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    const filename = 'resume/' + req.file.filename;
    await db.query('UPDATE profile SET resume_file = ? WHERE id = 1', [filename]);
    const [rows] = await db.query('SELECT * FROM profile WHERE id = 1');
    res.json({ message: 'Resume uploaded successfully', filename, profile: formatProfile(rows[0]) });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
