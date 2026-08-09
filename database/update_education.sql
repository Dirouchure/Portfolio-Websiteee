-- UPDATE EDUCATION - 4TH YEAR STUDENT
-- Run this in phpMyAdmin

USE portfolio_db;

-- Clear existing education data
DELETE FROM education;

-- Add your current education (4th year student)
INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
VALUES (
  'Your University Name',  -- Change this to your university
  'Bachelor of Science',   -- Change to your degree
  'Software Engineering',  -- Change to your department/major
  2021,                    -- Change to your start year
  2025,                    -- Change to expected graduation year
  'Currently in 4th year, focusing on software development, web technologies, and video editing. Expected graduation in 2025.'
);

-- Or if you want to add video editing related education:
-- Uncomment and modify if needed

-- INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
-- VALUES (
--   'Film & Media Academy',
--   'Certificate in Video Production',
--   'Video Editing & Post-Production',
--   2023,
--   2024,
--   'Specialized training in professional video editing, color grading, motion graphics, and visual effects.'
-- );

SELECT 'Education updated! You are now shown as 4th year student.' as Status;

-- Show updated education
SELECT * FROM education;
