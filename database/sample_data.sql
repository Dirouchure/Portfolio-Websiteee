USE portfolio_db;

INSERT INTO skills (skill_name, category, proficiency) VALUES
('JavaScript', 'Programming Languages', 90),
('Python', 'Programming Languages', 85),
('Java', 'Programming Languages', 80),
('HTML', 'Web Technologies', 95),
('CSS', 'Web Technologies', 90),
('React', 'Frameworks', 88),
('Node.js', 'Frameworks', 85),
('Express.js', 'Frameworks', 82),
('MySQL', 'Databases', 80),
('MongoDB', 'Databases', 75),
('Git', 'Tools', 85),
('Docker', 'Tools', 70);

INSERT INTO education (school_name, degree, department, start_year, end_year, description) VALUES
('University Name', 'Bachelor of Science', 'Computer Science', 2018, 2022, 'Graduated with honors. Focused on software engineering and web development.'),
('High School Name', 'High School Diploma', 'Science', 2014, 2018, 'Completed with excellent grades in mathematics and computer science.');

INSERT INTO experience (company_name, position, start_date, end_date, is_current, responsibilities, technologies) VALUES
('Tech Company Inc', 'Full Stack Developer', '2022-06-01', NULL, TRUE, 'Developing and maintaining web applications, collaborating with cross-functional teams, implementing new features and bug fixes.', 'React, Node.js, MongoDB, AWS'),
('Startup XYZ', 'Junior Developer', '2021-01-01', '2022-05-31', FALSE, 'Built responsive web interfaces, integrated APIs, worked on database design.', 'JavaScript, HTML, CSS, MySQL');

INSERT INTO projects (title, description, technologies, github_url, live_url, category) VALUES
('E-commerce Website', 'Full-featured online shopping platform with user authentication, product catalog, shopping cart, and payment integration.', 'React, Node.js, Express, MongoDB, Stripe', 'https://github.com/yourusername/ecommerce', 'https://ecommerce-demo.com', 'Web Development'),
('Task Management App', 'Collaborative task management application with real-time updates and team collaboration features.', 'React, Firebase, Material-UI', 'https://github.com/yourusername/taskmanager', 'https://taskmanager-demo.com', 'Web Development'),
('Weather Dashboard', 'Real-time weather dashboard with location-based forecasts and interactive maps.', 'JavaScript, OpenWeather API, Chart.js', 'https://github.com/yourusername/weather', 'https://weather-demo.com', 'Web Development'),
('Portfolio Website', 'Personal portfolio website with admin panel for content management.', 'React, Node.js, MySQL', 'https://github.com/yourusername/portfolio', 'https://yourportfolio.com', 'Web Development');

INSERT INTO certificates (title, organization, issue_date) VALUES
('Full Stack Web Development', 'Coursera', '2022-03-15'),
('JavaScript Algorithms and Data Structures', 'freeCodeCamp', '2021-11-20'),
('React - The Complete Guide', 'Udemy', '2022-01-10'),
('Node.js Certification', 'OpenJS Foundation', '2022-05-05');
