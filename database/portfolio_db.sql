CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE education (
  id INT PRIMARY KEY AUTO_INCREMENT,
  school_name VARCHAR(200) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  start_year INT,
  end_year INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  skill_name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  proficiency INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  highlights TEXT,
  technologies VARCHAR(255),
  tags VARCHAR(255),
  image VARCHAR(255),
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  project_url VARCHAR(255),
  category VARCHAR(50),
  status ENUM('completed', 'in-progress', 'planning') DEFAULT 'completed',
  client_name VARCHAR(200),
  start_date DATE,
  end_date DATE,
  duration VARCHAR(50),
  team_size INT DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  organization VARCHAR(200),
  issue_date DATE,
  certificate_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(200) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  responsibilities TEXT,
  technologies VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'video',
  price VARCHAR(100),
  duration VARCHAR(100),
  features TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_reel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500) NOT NULL,
  video_type ENUM('youtube', 'vimeo') DEFAULT 'youtube',
  category VARCHAR(100),
  duration VARCHAR(50),
  views INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin account: username=admin, password=admin123
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');

INSERT INTO profile (full_name, title, bio, objective, email, phone) 
VALUES (
  'Diro Uchure', 
  'Full Stack Web Developer', 
  'Passionate Full Stack Developer with experience in building modern, responsive web applications and robust APIs.', 
  'Seeking opportunities to leverage my skills in engineering innovative and impactful digital solutions.',
  'dirouchure@gmail.com',
  '+251940672637'
);

INSERT INTO services (service_name, description, icon, price, duration, features, is_active, display_order) VALUES
('Full Stack Web Development', 'End-to-end custom web application design, development, and deployment.', 'code', 'Contact for Quote', '1-3 weeks', 'React & Node.js, REST API development, Database architecture, Responsive UI', TRUE, 1),
('Frontend Engineering', 'Modern, performant, mobile-first web user interfaces and interactive dashboards.', 'palette', 'Contact for Quote', '3-7 days', 'React.js, Modern CSS & Animations, Cross-browser compatibility, Performance tuning', TRUE, 2),
('Backend & API Architecture', 'Robust backend architecture, database schema design, and secure authentication.', 'server', 'Contact for Quote', '1-2 weeks', 'Express.js & Node.js, MySQL / PostgreSQL, JWT Authentication, Security & Rate Limiting', TRUE, 3);

INSERT INTO projects (
  title, description, highlights, technologies, tags, github_url, live_url, category, status, duration, team_size, is_featured, views
) VALUES (
  'Online Examination System',
  'A robust, full-featured web-based online examination and assessment platform featuring automated grading, timed tests, role-based student and instructor portals, secure test submissions, and performance analytics.',
  'Automated grading engine, Real-time exam timer and session management, Instructor question bank and test authoring, Detailed student scorecards and analytics',
  'React, Node.js, Express.js, MySQL, REST API',
  'react, nodejs, express, mysql, examination, assessment, education',
  'https://github.com/Dirouchure/online-examination-system',
  'https://github.com/Dirouchure/online-examination-system',
  'Web Application',
  'completed',
  '1 month',
  1,
  TRUE,
  128
);

