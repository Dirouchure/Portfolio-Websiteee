const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create folders if they don't exist
const folders = ['uploads/profile', 'uploads/projects', 'uploads/certificates', 'uploads/resume'];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const getDestination = (req, file) => {
  const url = req.originalUrl || '';

  if (url.includes('/profile/upload-image')) {
    return 'uploads/profile/';
  }
  if (url.includes('/profile/upload-resume')) {
    return 'uploads/resume/';
  }
  if (url.includes('/certificates')) {
    return 'uploads/certificates/';
  }
  if (url.includes('/projects')) {
    return 'uploads/projects/';
  }

  switch (file.fieldname) {
    case 'resume':
      return 'uploads/resume/';
    case 'profile_image':
      return 'uploads/profile/';
    case 'certificate_image':
      return 'uploads/certificates/';
    default:
      return 'uploads/';
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getDestination(req, file));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and PDFs only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = upload;
