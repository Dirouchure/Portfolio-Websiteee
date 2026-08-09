-- ENHANCE PROJECTS TABLE WITH DETAILED FEATURES
-- Run this after importing portfolio_db.sql

USE portfolio_db;

-- Add new columns to existing projects table
ALTER TABLE projects 
ADD COLUMN status ENUM('completed', 'in-progress', 'planning') DEFAULT 'completed' AFTER category,
ADD COLUMN client_name VARCHAR(200) AFTER status,
ADD COLUMN start_date DATE AFTER client_name,
ADD COLUMN end_date DATE AFTER start_date,
ADD COLUMN duration VARCHAR(50) AFTER end_date,
ADD COLUMN team_size INT DEFAULT 1 AFTER duration,
ADD COLUMN project_url VARCHAR(255) AFTER live_url,
ADD COLUMN highlights TEXT AFTER description,
ADD COLUMN tags VARCHAR(255) AFTER technologies,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER category,
ADD COLUMN views INT DEFAULT 0 AFTER is_featured,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Update existing projects with sample enhanced data
UPDATE projects SET 
  status = 'completed',
  duration = '2 months',
  team_size = 1,
  highlights = 'Responsive design, Fast loading, SEO optimized',
  tags = 'responsive, modern, professional',
  is_featured = FALSE,
  views = 0
WHERE id > 0;

SELECT 'Projects table enhanced with detailed features!' as Status;
