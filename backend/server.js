const db = require("./config/db");


const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const skillsRoutes = require('./routes/skills');
const projectsRoutes = require('./routes/projects');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const certificatesRoutes = require('./routes/certificates');
const contactRoutes = require('./routes/contact');
const videoReelRoutes = require('./routes/video_reel');
const servicesRoutes = require('./routes/services');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/video-reel', videoReelRoutes);
app.use('/api/services', servicesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
