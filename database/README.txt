DATABASE SETUP GUIDE

=== FILES ===
1. portfolio_db.sql       - Main database schema with tables and default data
2. sample_data.sql        - Optional sample data (skills, projects, education, etc.)
3. DROP_DATABASE.sql      - Use this to completely remove the database
4. README.txt            - This file

=== SETUP METHODS ===

METHOD 1: Using phpMyAdmin (Recommended)
1. Start XAMPP Control Panel
2. Start MySQL service
3. Open browser and go to: http://localhost/phpmyadmin
4. Click "Import" tab
5. Click "Choose File" and select: portfolio_db.sql
6. Click "Go" button
7. Wait for success message
8. (Optional) Import sample_data.sql for demo content

METHOD 2: Using MySQL Command Line
1. Start XAMPP Control Panel
2. Start MySQL service
3. Open Command Prompt/Terminal
4. Navigate to database folder:
   cd c:\Users\hp\Desktop\portfolio-website\database
5. Run command:
   mysql -u root -p < portfolio_db.sql
6. Press Enter (no password by default in XAMPP)
7. (Optional) Run: mysql -u root -p < sample_data.sql

METHOD 3: Copy-Paste SQL
1. Open phpMyAdmin
2. Click "SQL" tab
3. Open portfolio_db.sql in text editor
4. Copy all content
5. Paste into SQL tab
6. Click "Go"

=== VERIFY INSTALLATION ===
1. In phpMyAdmin, click "portfolio_db" in left sidebar
2. You should see 8 tables:
   - admin
   - profile
   - education
   - skills
   - projects
   - certificates
   - experience
   - contact_messages

=== DEFAULT CREDENTIALS ===
Admin Login:
Username: admin
Password: admin123

IMPORTANT: Change default password after first login!

=== TABLE DESCRIPTIONS ===

admin - Administrator accounts
  - Stores admin login credentials
  - Default: username=admin, password=admin123

profile - Personal information
  - Full name, title, bio, contact info
  - Profile image and resume file paths
  - Social media links

education - Educational background
  - School name, degree, department
  - Years attended, description

skills - Technical skills
  - Skill name, category, proficiency percentage

projects - Portfolio projects
  - Title, description, technologies
  - GitHub and live demo links
  - Project images

certificates - Certifications
  - Certificate title, organization
  - Issue date, certificate images

experience - Work experience
  - Company name, position, dates
  - Responsibilities, technologies used

contact_messages - Contact form submissions
  - Name, email, subject, message
  - Read/unread status

=== SAMPLE DATA ===
The sample_data.sql file includes:
- 12 sample skills across different categories
- 2 education entries
- 2 work experiences
- 4 sample projects
- 4 certificates

Use this for testing the application before adding your real data.

=== RESET DATABASE ===
To completely reset the database:
1. Run DROP_DATABASE.sql in phpMyAdmin
2. Run portfolio_db.sql again
3. (Optional) Run sample_data.sql

=== BACKUP DATABASE ===
To backup your database:
1. Open phpMyAdmin
2. Click "portfolio_db" database
3. Click "Export" tab
4. Keep default settings
5. Click "Go"
6. Save the .sql file

=== TROUBLESHOOTING ===

Error: Access denied
- Check MySQL is running in XAMPP
- Default username is "root" with no password

Error: Database exists
- Run DROP_DATABASE.sql first
- Or use DROP DATABASE IF EXISTS in the SQL

Error: Table already exists
- Drop the database and recreate
- Or delete individual tables manually

Connection refused
- Start MySQL in XAMPP Control Panel
- Check port 3306 is not blocked

=== CUSTOMIZATION ===

Change Admin Password:
1. Generate hash using Node.js:
   const bcrypt = require('bcryptjs');
   bcrypt.hash('your_password', 10, (err, hash) => {
     console.log(hash);
   });
2. Update in database:
   UPDATE admin SET password = 'your_hash_here' WHERE username = 'admin';

Add Your Profile:
UPDATE profile SET 
  full_name = 'Your Name',
  title = 'Your Title',
  bio = 'Your bio text',
  email = 'your.email@example.com',
  phone = '+1234567890'
WHERE id = 1;

=== SECURITY NOTES ===
- Change default admin password immediately
- Use strong passwords for production
- Keep database credentials secure
- Regular backups recommended
- Update JWT_SECRET in backend .env file

=== DATABASE STRUCTURE ===

portfolio_db
├── admin (1 row)
├── profile (1 row)
├── education (0-N rows)
├── skills (0-N rows)
├── projects (0-N rows)
├── certificates (0-N rows)
├── experience (0-N rows)
└── contact_messages (0-N rows)

Primary Keys: Auto-increment ID on all tables
Foreign Keys: None (simple structure for portfolio)
Indexes: Automatic on primary keys and unique fields

=== SUPPORT ===
If you encounter issues:
1. Check XAMPP MySQL is running
2. Verify credentials in backend/.env
3. Check phpMyAdmin for errors
4. Review MySQL error logs in XAMPP
5. Ensure port 3306 is available
