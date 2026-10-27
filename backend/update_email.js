const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateEmail() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('Connected to database...');
    
    // Update email
    const [result] = await connection.execute(
      'UPDATE profile SET email = ? WHERE id = 1',
      ['dirouchure@gmail.com']
    );
    
    console.log('✓ Email updated successfully!');
    console.log(`Rows affected: ${result.affectedRows}`);
    
    // Verify the change
    const [rows] = await connection.execute('SELECT email FROM profile WHERE id = 1');
    console.log('\nCurrent email:', rows[0]?.email);
    
  } catch (error) {
    console.error('Error updating email:', error.message);
  } finally {
    await connection.end();
  }
}

updateEmail();
