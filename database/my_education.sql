-- DIRO UCHURE - EDUCATION UPDATE (4TH YEAR STUDENT)
-- Run this in phpMyAdmin

USE portfolio_db;

-- Clear old education data
DELETE FROM education;

-- Add your education as 4th year student
INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
VALUES (
  'Addis Ababa University',           -- CHANGE THIS to your university name
  'Bachelor of Computer Science',      -- CHANGE THIS to your degree
  'Computer Science',                  -- CHANGE THIS to your major
  2021,                                -- CHANGE THIS to when you started
  2025,                                -- CHANGE THIS to expected graduation
  'Currently pursuing Bachelor degree in Computer Science (4th year). Specializing in software development, web technologies, multimedia production, and video editing. Expected graduation: 2025. GPA: 3.5/4.0'
);

-- You can add more education entries if you have them
-- Example: High School, Certificates, Online Courses, etc.

-- Uncomment and modify if you have additional education:

-- INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
-- VALUES (
--   'Video Editing Bootcamp',
--   'Professional Certificate',
--   'Video Production & Editing',
--   2023,
--   2023,
--   'Completed intensive training in Adobe Premiere Pro, After Effects, DaVinci Resolve, color grading, and motion graphics.'
-- );

-- INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
-- VALUES (
--   'Your High School Name',
--   'High School Diploma',
--   'Science',
--   2017,
--   2021,
--   'Graduated with honors. Focused on science and technology subjects.'
-- );

SELECT '✅ Education updated! You are now shown as 4th year student.' as Message;

-- Display your education
SELECT * FROM education;
