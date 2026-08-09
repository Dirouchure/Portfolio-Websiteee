USE portfolio_db;

-- Delete existing admin account
DELETE FROM admin;


INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@portfolio.com', '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW');

-- Verify the admin account was created
SELECT id, username, email, 'Password is hashed' as password_status FROM admin;
