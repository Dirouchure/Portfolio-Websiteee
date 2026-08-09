-- UPDATE PROFILE WITH YOUR NAME
-- Run this in phpMyAdmin

USE portfolio_db;

-- Update profile with your information
UPDATE profile SET 
  full_name = 'Diro Uchure',
  title = 'Professional Video Editor',
  bio = 'Creative video editor with expertise in storytelling, color grading, and motion graphics. Transforming raw footage into compelling visual narratives.',
  objective = 'Passionate about creating engaging video content that captivates audiences and delivers powerful messages through expert editing and creative vision.',
  email = 'diro.uchure@gmail.com',
  phone = '+251940672637',
  location = 'Ethiopia'
WHERE id = 1;

SELECT 'Profile updated with Diro Uchure!' as Status;

-- Show updated profile
SELECT * FROM profile;
