-- ═══════════════════════════════════════════════════════════════
--  FIX PROFILE AND ADMIN - COMPLETE SOLUTION
-- ═══════════════════════════════════════════════════════════════

USE portfolio_db;

-- ═══════════════════════════════════════════════════════════════
--  STEP 1: FIX ADMIN USER
-- ═══════════════════════════════════════════════════════════════

-- Delete all existing admin users
DELETE FROM admin;

-- Create admin user
-- Username: admin
-- Password: admin123
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');

SELECT '✅ Admin user created!' as Status;
SELECT 'Username: admin' as Login;
SELECT 'Password: admin123' as Password;


-- ═══════════════════════════════════════════════════════════════
--  STEP 2: FIX PROFILE DATA
-- ═══════════════════════════════════════════════════════════════

-- Delete existing profile
DELETE FROM profile;

-- Create profile for Diro Uchure
INSERT INTO profile (
    full_name, 
    title, 
    bio, 
    objective,
    email, 
    phone, 
    location,
    github_url,
    linkedin_url,
    twitter_url
) VALUES (
    'Diro Uchure',
    'Full Stack Web Developer',
    'I am a passionate Full Stack Web Developer with expertise in building modern web applications. I specialize in React, Node.js, and MySQL, creating responsive and user-friendly solutions. I love turning ideas into reality through clean code and elegant design.',
    'Seeking opportunities to leverage my skills in creating innovative web solutions that make a difference.',
    'dirouchure@gmail.com',
    '+251940672637',
    'Addis Ababa, Ethiopia',
    'https://github.com/dirouchure',
    'https://linkedin.com/in/dirouchure',
    'https://twitter.com/dirouchure'
);

SELECT '✅ Profile created!' as Status;
SELECT full_name, title, email, phone FROM profile;


-- ═══════════════════════════════════════════════════════════════
--  STEP 3: ADD SAMPLE SKILLS
-- ═══════════════════════════════════════════════════════════════

DELETE FROM skills;

INSERT INTO skills (skill_name, category, proficiency) VALUES
('React', 'frontend', 90),
('Node.js', 'backend', 85),
('JavaScript', 'frontend', 95),
('HTML5', 'frontend', 95),
('CSS3', 'frontend', 90),
('MySQL', 'database', 80),
('Express.js', 'backend', 85),
('Git', 'tools', 85),
('MongoDB', 'database', 75),
('TypeScript', 'frontend', 70);

SELECT '✅ Skills added!' as Status;


-- ═══════════════════════════════════════════════════════════════
--  STEP 4: ADD SAMPLE PROJECT
-- ═══════════════════════════════════════════════════════════════

INSERT INTO projects (title, description, technologies, github_url, live_url, category)
SELECT 
    'Portfolio Website',
    'A modern, responsive portfolio website built with React and Node.js. Features include admin panel, contact form, and dynamic content management system.',
    'React, Node.js, MySQL, Express.js, CSS3',
    'https://github.com/dirouchure/portfolio',
    'http://localhost:3001',
    'Web Development'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Portfolio Website');

SELECT '✅ Sample project added!' as Status;


-- ═══════════════════════════════════════════════════════════════
--  STEP 5: ADD SAMPLE EDUCATION
-- ═══════════════════════════════════════════════════════════════

INSERT INTO education (school_name, degree, department, start_year, end_year, description)
SELECT 
    'Addis Ababa University',
    'Bachelor of Science',
    'Computer Science',
    2018,
    2022,
    'Focused on software engineering, web development, and database management systems.'
WHERE NOT EXISTS (SELECT 1 FROM education);

SELECT '✅ Education added!' as Status;


-- ═══════════════════════════════════════════════════════════════
--  FINAL STATUS
-- ═══════════════════════════════════════════════════════════════

SELECT '═══════════════════════════════════════════════════════════════' as '';
SELECT '✅ DATABASE FIXED!' as Status;
SELECT '═══════════════════════════════════════════════════════════════' as '';

SELECT CONCAT('Admin users: ', COUNT(*)) as AdminCount FROM admin;
SELECT CONCAT('Profiles: ', COUNT(*)) as ProfileCount FROM profile;
SELECT CONCAT('Skills: ', COUNT(*)) as SkillsCount FROM skills;
SELECT CONCAT('Projects: ', COUNT(*)) as ProjectsCount FROM projects;
SELECT CONCAT('Education: ', COUNT(*)) as EducationCount FROM education;

SELECT '═══════════════════════════════════════════════════════════════' as '';
SELECT '🔐 ADMIN LOGIN:' as Info;
SELECT 'Username: admin' as Username;
SELECT 'Password: admin123' as Password;
SELECT 'URL: http://localhost:3001/admin/login' as URL;
SELECT '═══════════════════════════════════════════════════════════════' as '';
