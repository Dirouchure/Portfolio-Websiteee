-- NEW FEATURES: VIDEO REEL AND SERVICES
-- Run this after importing portfolio_db.sql

USE portfolio_db;

-- Video Reel Table
CREATE TABLE IF NOT EXISTS video_reel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500) NOT NULL,
  video_type ENUM('youtube', 'vimeo') DEFAULT 'youtube',
  category VARCHAR(100),
  duration VARCHAR(50),
  views INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'video',
  price VARCHAR(100),
  duration VARCHAR(100),
  features TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Video Reel Data
INSERT INTO video_reel (title, description, video_url, video_type, category, duration, is_featured) VALUES
('Wedding Highlights - Emma & James', 'Beautiful wedding ceremony and reception highlights', 'dQw4w9WgXcQ', 'youtube', 'Wedding', '4:30', TRUE),
('Corporate Promo - Tech Startup', 'Dynamic corporate promotional video showcasing innovation', 'dQw4w9WgXcQ', 'youtube', 'Corporate', '2:15', FALSE),
('Music Video - Summer Vibes', 'Energetic music video with creative transitions', 'dQw4w9WgXcQ', 'youtube', 'Music Video', '3:45', FALSE),
('Product Launch - SmartWatch Pro', 'Professional product showcase with motion graphics', 'dQw4w9WgXcQ', 'youtube', 'Commercial', '1:30', FALSE);

-- Sample Services Data
INSERT INTO services (service_name, description, icon, price, duration, features, is_active, display_order) VALUES
('Professional Video Editing', 'Complete video editing from raw footage to final delivery', 'video', '$299 per video', '3-5 days', 'Color grading, Sound design, Motion graphics, Multiple revisions', TRUE, 1),
('Color Grading', 'Professional color correction and grading services', 'palette', '$149 per video', '1-2 days', 'Color correction, Creative grading, LUT creation, Skin tone perfection', TRUE, 2),
('Motion Graphics', 'Custom motion graphics and animations', 'magic', '$199 per project', '2-4 days', 'Logo animations, Lower thirds, Title sequences, Visual effects', TRUE, 3),
('Audio Post Production', 'Complete audio mixing and sound design', 'music', '$129 per video', '1-2 days', 'Audio mixing, Sound effects, Music selection, Voice enhancement', TRUE, 4);

SELECT 'Video Reel and Services tables created and sample data inserted successfully!' as Status;
