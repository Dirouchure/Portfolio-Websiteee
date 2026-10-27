const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure absolute upload directory always points to backend/uploads
const baseUploads = path.join(__dirname, '..', 'uploads');
const folders = ['profile', 'projects', 'certificates', 'resume'];

if (!fs.existsSync(baseUploads)) {
  fs.mkdirSync(baseUploads, { recursive: true });
}

folders.forEach(folder => {
  const dir = path.join(baseUploads, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const getDestination = (req, file) => {
  const url = req.originalUrl || '';

  if (url.includes('/projects')) {
    return path.join(baseUploads, 'projects');
  }
  if (url.includes('/certificates') || file.fieldname === 'certificate_image') {
    return path.join(baseUploads, 'certificates');
  }
  if (url.includes('/profile/upload-resume') || file.fieldname === 'resume') {
    return path.join(baseUploads, 'resume');
  }
  if (url.includes('/profile/upload-image') || file.fieldname === 'profile_image' || file.fieldname === 'image') {
    return path.join(baseUploads, 'profile');
  }

  return baseUploads;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = getDestination(req, file);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|gif|pdf|webp/;
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExts.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, GIF, WEBP and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

module.exports = upload;
