-- FIX ADMIN LOGIN - RUN THIS NOW
-- This will create a working admin user

USE portfolio_db;

-- Delete all existing admin users
DELETE FROM admin;

-- Insert admin user with correct password
-- Username: admin
-- Password: admin123
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');

-- Verify it was inserted
SELECT id, username, email, 'Password is hidden' as password FROM admin;

SELECT 'Admin user created! Login with username: admin and password: admin123' as Message;
