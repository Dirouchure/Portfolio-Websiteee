const mysql = require('mysql2/promise');
require('dotenv').config();

async function addExperienceField() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('Adding years_of_experience field to profile table...\n');
    
    // Check if column already exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM profile LIKE 'years_of_experience'"
    );
    
    if (columns.length > 0) {
      console.log('✓ Column years_of_experience already exists');
    } else {
      // Add the column
      await connection.execute(
        'ALTER TABLE profile ADD COLUMN years_of_experience VARCHAR(20) DEFAULT "2.5+" AFTER phone'
      );
      console.log('✓ Column years_of_experience added successfully');
    }
    
    // Update the profile with the value
    await connection.execute(
      'UPDATE profile SET years_of_experience = "2.5+" WHERE id = 3'
    );
    console.log('✓ Profile updated with years_of_experience = "2.5+"');
    
    // Verify
    const [profile] = await connection.execute('SELECT full_name, years_of_experience FROM profile WHERE id = 3');
    console.log('\nCurrent profile:');
    console.log('  Name:', profile[0]?.full_name);
    console.log('  Experience:', profile[0]?.years_of_experience);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

addExperienceField();
