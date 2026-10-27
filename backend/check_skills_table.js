const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSkillsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('Checking skills table structure...\n');
    
    // Check table structure
    const [columns] = await connection.execute('DESCRIBE skills');
    console.log('Table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    console.log('\n');
    
    // Check current skills
    const [skills] = await connection.execute('SELECT * FROM skills');
    console.log(`Current skills count: ${skills.length}\n`);
    
    if (skills.length > 0) {
      console.log('Existing skills:');
      skills.forEach(s => {
        console.log(`  ID: ${s.id} - ${s.skill_name} (${s.category}) - ${s.proficiency}%`);
      });
    }
    
    // Try to insert a test skill
    console.log('\n--- Testing INSERT ---');
    try {
      const [result] = await connection.execute(
        'INSERT INTO skills (skill_name, category, proficiency) VALUES (?, ?, ?)',
        ['Test Skill', 'Testing', 85]
      );
      console.log(`✓ Test insert successful! ID: ${result.insertId}`);
      
      // Delete the test skill
      await connection.execute('DELETE FROM skills WHERE id = ?', [result.insertId]);
      console.log('✓ Test skill deleted');
    } catch (err) {
      console.error('✗ Insert failed:', err.message);
      console.error('SQL Error Code:', err.code);
      console.error('SQL Error Number:', err.errno);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkSkillsTable();
