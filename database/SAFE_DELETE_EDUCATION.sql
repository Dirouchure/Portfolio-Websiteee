-- SAFE DELETE EDUCATION - Choose what you want to delete
-- Run this in phpMyAdmin

USE portfolio_db;

-- ═══════════════════════════════════════════════════════════════
-- OPTION 1: DELETE ALL EDUCATION (use with caution!)
-- ═══════════════════════════════════════════════════════════════
-- Uncomment the line below to delete ALL education records:

-- DELETE FROM education;

-- ═══════════════════════════════════════════════════════════════
-- OPTION 2: DELETE SPECIFIC EDUCATION BY ID
-- ═══════════════════════════════════════════════════════════════
-- First, see all education records with their IDs:

SELECT * FROM education;

-- Then delete specific one by ID:
-- Replace XX with the actual ID number you want to delete:

-- DELETE FROM education WHERE id = XX;

-- Example:
-- DELETE FROM education WHERE id = 1;  -- Deletes education with ID 1
-- DELETE FROM education WHERE id = 2;  -- Deletes education with ID 2

-- ═══════════════════════════════════════════════════════════════
-- OPTION 3: DELETE BY SCHOOL NAME
-- ═══════════════════════════════════════════════════════════════
-- Delete education from specific school:

-- DELETE FROM education WHERE school_name = 'Your School Name';

-- Example:
-- DELETE FROM education WHERE school_name = 'Addis Ababa University';

-- ═══════════════════════════════════════════════════════════════
-- OPTION 4: DELETE BY YEAR
-- ═══════════════════════════════════════════════════════════════
-- Delete education from specific year:

-- DELETE FROM education WHERE start_year = 2021;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICATION: Show remaining education after delete
-- ═══════════════════════════════════════════════════════════════

SELECT '✅ Delete operation completed!' as Status;
SELECT 'Remaining education records:' as Info;
SELECT * FROM education;

-- ═══════════════════════════════════════════════════════════════
-- SAFETY TIPS:
-- ═══════════════════════════════════════════════════════════════
-- 1. Always SELECT before DELETE to see what will be deleted
-- 2. Uncomment only the DELETE statement you want to use
-- 3. Make sure you have backup of your database
-- 4. Double-check the ID or name before deleting
-- 5. Cannot undo DELETE - be careful!

