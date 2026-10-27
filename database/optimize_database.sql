-- Optimize Database Performance
USE portfolio_db;

-- Add indexes for faster queries
ALTER TABLE profile ADD INDEX idx_updated_at (updated_at);
ALTER TABLE projects ADD INDEX idx_created_at (created_at);
ALTER TABLE skills ADD INDEX idx_category (category);
ALTER TABLE education ADD INDEX idx_start_year (start_year);
ALTER TABLE certificates ADD INDEX idx_issue_date (issue_date);
ALTER TABLE contact_messages ADD INDEX idx_is_read (is_read);
ALTER TABLE contact_messages ADD INDEX idx_created_at (created_at);

-- Optimize tables
OPTIMIZE TABLE admin;
OPTIMIZE TABLE profile;
OPTIMIZE TABLE projects;
OPTIMIZE TABLE skills;
OPTIMIZE TABLE education;
OPTIMIZE TABLE certificates;
OPTIMIZE TABLE contact_messages;

SELECT 'Database optimized successfully!' as Status;
