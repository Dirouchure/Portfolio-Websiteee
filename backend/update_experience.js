const db = require('./config/db');

async function updateExperience() {
  try {
    console.log('🔄 Updating years of experience...\n');
    
    // First, check if column exists, if not add it
    try {
      await db.query('ALTER TABLE profile ADD COLUMN years_of_experience VARCHAR(20) DEFAULT "3+"');
      console.log('✅ Added years_of_experience column');
    } catch (e) {
      if (e.message.includes('Duplicate column')) {
        console.log('ℹ️ Column already exists');
      } else {
        throw e;
      }
    }
    
    // Update profile table
    await db.query('UPDATE profile SET years_of_experience = ? WHERE id = 1', ['3+']);
    console.log('✅ Updated profile table: years_of_experience = "3+"');
    
    // Verify the update
    const [result] = await db.query('SELECT years_of_experience FROM profile WHERE id = 1');
    console.log('✅ Current value in database:', result[0].years_of_experience);
    
    console.log('\n✅ Update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateExperience();
