-- RESET ADMIN USER - FIX LOGIN PROBLEM
-- Run this in phpMyAdmin if you can't login

USE portfolio_db;

-- Delete existing admin users
DELETE FROM admin;

-- Insert correct admin user
-- Username: admin
-- Password: admin123
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW');

SELECT 'Admin user reset successfully! Login with: admin / admin123' as Status;
