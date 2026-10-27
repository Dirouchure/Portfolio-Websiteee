const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendServerError } = require('../utils/errors');

const fallbackDir = path.join(__dirname, '..', 'uploads');
const fallbackProfilePath = path.join(fallbackDir, 'profile_backup.json');

const saveProfileToFile = (data) => {
  try {
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    let current = {};
    if (fs.existsSync(fallbackProfilePath)) {
      try {
        current = JSON.parse(fs.readFileSync(fallbackProfilePath, 'utf8') || '{}');
      } catch (e) {}
    }
    const merged = { ...current, ...data, updated_at: new Date().toISOString() };
    fs.writeFileSync(fallbackProfilePath, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (err) {
    console.error('Profile fallback save error:', err.message);
    return data;
  }
};

const getFallbackProfile = () => {
  try {
    if (fs.existsSync(fallbackProfilePath)) {
      const raw = fs.readFileSync(fallbackProfilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Profile fallback read error:', err.message);
  }
  return null;
};

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

const ensureProfileTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        bio TEXT,
        objective TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        location VARCHAR(100),
        profile_image VARCHAR(255),
        resume_file VARCHAR(255),
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        twitter_url VARCHAR(255),
        telegram_url VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('ensureProfileTable notice:', err.message);
  }
};

const DEFAULT_PROFILE_DATA = {
  full_name: 'Diro Uchure',
  title: 'Software Engineering Student & Full Stack Developer',
  bio: 'Software Engineering student at Haramaya University with a passion for building modern, scalable web applications. Experienced in full-stack development with React, Node.js, and MySQL. Committed to writing clean code and creating impactful digital solutions.',
  objective: 'Seeking opportunities to leverage my skills in engineering innovative and reliable digital solutions.',
  phone: '+251940672637',
  email: 'dirouchure@gmail.com',
  location: 'Haramaya University, Ethiopia',
  years_of_experience: '3+',
  github_url: 'https://github.com/Dirouchure',
  linkedin_url: 'https://linkedin.com/in/dirouchure',
  twitter_url: 'https://twitter.com/dirouchure',
  telegram_url: 'https://t.me/forall4037',
  profile_image: '/images/profile.jpg',
  resume_file: '',
};

const formatProfile = (profile) => {
  if (!profile) return DEFAULT_PROFILE_DATA;
  return {
    ...profile,
    phone: profile.phone || DEFAULT_PROFILE_DATA.phone,
    email: profile.email || DEFAULT_PROFILE_DATA.email,
    location: profile.location || DEFAULT_PROFILE_DATA.location,
    github_url: profile.github_url || DEFAULT_PROFILE_DATA.github_url,
    linkedin_url: profile.linkedin_url || DEFAULT_PROFILE_DATA.linkedin_url,
    twitter_url: profile.twitter_url || DEFAULT_PROFILE_DATA.twitter_url,
    telegram_url: profile.telegram_url || DEFAULT_PROFILE_DATA.telegram_url,
    profile_image: resolveUploadPath(profile.profile_image),
    resume_file: resolveUploadPath(profile.resume_file),
  };
};

router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  let dbProfile = null;

  try {
    await ensureProfileTable();
    const [rows] = await db.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
    if (rows && rows.length > 0) {
      dbProfile = rows[0];
    }
  } catch (error) {
    console.warn('Database fetch notice for profile:', error.message);
  }

  // 1. If database has profile, sync to persistent file backup and return
  if (dbProfile) {
    saveProfileToFile(dbProfile);
    return res.json(formatProfile(dbProfile));
  }

  // 2. If database is offline or empty, load from file backup
  const fileProfile = getFallbackProfile();
  if (fileProfile) {
    return res.json(formatProfile(fileProfile));
  }

  // 3. Fallback to default template (flagged as default)
  return res.json({ ...DEFAULT_PROFILE_DATA, _is_default: true });
});

router.put('/', verifyToken, async (req, res) => {
  const { 
    full_name, title, bio, objective, phone, email, 
    location, github_url, linkedin_url, twitter_url, telegram_url, years_of_experience 
  } = req.body;

  const profilePayload = {
    full_name: full_name || DEFAULT_PROFILE_DATA.full_name,
    title: title || DEFAULT_PROFILE_DATA.title,
    bio: bio || '',
    objective: objective || '',
    phone: phone || '',
    email: email || '',
    location: location || '',
    github_url: github_url || '',
    linkedin_url: linkedin_url || '',
    twitter_url: twitter_url || '',
    telegram_url: telegram_url || DEFAULT_PROFILE_DATA.telegram_url,
    years_of_experience: years_of_experience || '3+'
  };

  // Always write to disk backup immediately so user changes are 100% permanent
  const savedFileProfile = saveProfileToFile(profilePayload);
  let finalProfile = savedFileProfile;

  try {
    await ensureProfileTable();
    const params = [
      profilePayload.full_name,
      profilePayload.title,
      profilePayload.bio,
      profilePayload.objective,
      profilePayload.phone,
      profilePayload.email,
      profilePayload.location,
      profilePayload.github_url,
      profilePayload.linkedin_url,
      profilePayload.twitter_url,
      profilePayload.telegram_url
    ];

    const [existing] = await db.query('SELECT id FROM profile ORDER BY id DESC LIMIT 1');
    let profileId;

    if (existing.length === 0) {
      const [insertResult] = await db.query(
        `INSERT INTO profile (full_name, title, bio, objective, phone, email, location, github_url, linkedin_url, twitter_url, telegram_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );
      profileId = insertResult.insertId;
    } else {
      profileId = existing[0].id;
      await db.query(
        `UPDATE profile SET full_name = ?, title = ?, bio = ?, objective = ?, 
         phone = ?, email = ?, location = ?, github_url = ?, linkedin_url = ?, twitter_url = ?, telegram_url = ? WHERE id = ?`,
        [...params, profileId]
      );
    }

    const [rows] = await db.query('SELECT * FROM profile WHERE id = ?', [profileId]);
    if (rows && rows.length > 0) {
      finalProfile = rows[0];
      saveProfileToFile(finalProfile);
    }
  } catch (error) {
    console.warn('Database update notice in profile PUT route (saved to persistent file):', error.message);
  }

  res.json({ message: 'Profile updated successfully', profile: formatProfile(finalProfile) });
});

router.post('/upload-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const filename = 'profile/' + req.file.filename;

    // Persist immediately in file backup
    const savedFileProfile = saveProfileToFile({ profile_image: filename });
    let finalProfile = savedFileProfile;

    try {
      await ensureProfileTable();
      const [existing] = await db.query('SELECT id FROM profile ORDER BY id DESC LIMIT 1');
      let profileId;

      if (existing.length === 0) {
        const [insertResult] = await db.query(
          'INSERT INTO profile (full_name, title, profile_image) VALUES (?, ?, ?)',
          ['Diro Uchure', 'Full Stack Web Developer', filename]
        );
        profileId = insertResult.insertId;
      } else {
        profileId = existing[0].id;
        await db.query('UPDATE profile SET profile_image = ? WHERE id = ?', [filename, profileId]);
      }

      const [rows] = await db.query('SELECT * FROM profile WHERE id = ?', [profileId]);
      if (rows && rows.length > 0) {
        finalProfile = rows[0];
        saveProfileToFile(finalProfile);
      }
    } catch (dbErr) {
      console.warn('Database notice for image upload (saved to file):', dbErr.message);
    }

    res.json({ message: 'Image uploaded successfully', filename, profile: formatProfile(finalProfile) });
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

    // Persist immediately in file backup
    const savedFileProfile = saveProfileToFile({ resume_file: filename });
    let finalProfile = savedFileProfile;

    try {
      await ensureProfileTable();
      const [existing] = await db.query('SELECT id FROM profile ORDER BY id DESC LIMIT 1');
      let profileId;

      if (existing.length === 0) {
        const [insertResult] = await db.query(
          'INSERT INTO profile (full_name, title, resume_file) VALUES (?, ?, ?)',
          ['Diro Uchure', 'Full Stack Web Developer', filename]
        );
        profileId = insertResult.insertId;
      } else {
        profileId = existing[0].id;
        await db.query('UPDATE profile SET resume_file = ? WHERE id = ?', [filename, profileId]);
      }

      const [rows] = await db.query('SELECT * FROM profile WHERE id = ?', [profileId]);
      if (rows && rows.length > 0) {
        finalProfile = rows[0];
        saveProfileToFile(finalProfile);
      }
    } catch (dbErr) {
      console.warn('Database notice for resume upload (saved to file):', dbErr.message);
    }

    res.json({ message: 'Resume uploaded successfully', filename, profile: formatProfile(finalProfile) });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
