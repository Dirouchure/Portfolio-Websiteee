const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkEmail() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('Checking profile table...\n');
    
    // Check all profile data
    const [rows] = await connection.execute('SELECT * FROM profile');
    
    if (rows.length === 0) {
      console.log('No profile data found. Creating profile with new email...');
      
      await connection.execute(
        `INSERT INTO profile (full_name, email, phone, location, bio, title) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'Diro Uchure',
          'dirouchure@gmail.com',
          '+251 your-phone',
          'Ethiopia',
          'Full Stack Web Developer',
          'Full Stack Web Developer'
        ]
      );
      
      console.log('✓ Profile created with email: dirouchure@gmail.com');
    } else {
      console.log('Current profile data:');
      console.log('ID:', rows[0].id);
      console.log('Name:', rows[0].full_name);
      console.log('Email:', rows[0].email);
      console.log('Phone:', rows[0].phone);
      
      // Update to new email
      await connection.execute(
        'UPDATE profile SET email = ? WHERE id = ?',
        ['dirouchure@gmail.com', rows[0].id]
      );
      
      console.log('\n✓ Email updated to: dirouchure@gmail.com');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkEmail();
