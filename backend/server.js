const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();

require("./config/db");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
const corsOrigin = (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.trim())
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : true;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const skillsRoutes = require("./routes/skills");
const projectsRoutes = require("./routes/projects");
const educationRoutes = require("./routes/education");
const certificatesRoutes = require("./routes/certificates");
const experienceRoutes = require("./routes/experience");
const servicesRoutes = require("./routes/services");
const contactRoutes = require("./routes/contact");
const statsRoutes = require("./routes/stats");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio Backend API",
    status: "Running",
    endpoints: {
      health: "/api/health",
      profile: "/api/profile",
      login: "/api/auth/login",
    },
  });
});

// Global JSON error handler (handles Multer errors, file validation, etc.)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  res.status(status).json({
    message: err.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV === "production" ? {} : { error: err.stack }),
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
