-- Update email from diro.uchure@gmail.com to dirouchure@gmail.com
USE portfolio_db;

UPDATE profile 
SET email = 'dirouchure@gmail.com' 
WHERE id = 1;

SELECT * FROM profile WHERE id = 1;
