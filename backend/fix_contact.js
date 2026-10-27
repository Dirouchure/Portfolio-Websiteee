const db = require('./config/db');

async function fixContact() {
  try {
    console.log('🔍 Checking contact_messages table...\n');
    
    // Check if table exists
    const [tables] = await db.query('SHOW TABLES LIKE "contact_messages"');
    
    if (tables.length === 0) {
      console.log('❌ contact_messages table does NOT exist');
      console.log('📝 Creating table...');
      
      await db.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(500),
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('✅ contact_messages table created successfully!');
    } else {
      console.log('✅ contact_messages table exists');
      
      // Check column structure
      const [columns] = await db.query('DESCRIBE contact_messages');
      console.log('\nTable columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
      
      // Count messages
      const [count] = await db.query('SELECT COUNT(*) as count FROM contact_messages');
      console.log(`\n📊 Total messages in database: ${count[0].count}`);
    }
    
    console.log('\n✅ Contact form is ready to use!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixContact();
