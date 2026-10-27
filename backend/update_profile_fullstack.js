const db = require('./config/db');

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  UPDATE PROFILE - FULL STACK WEB DEVELOPER                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

async function updateProfile() {
  try {
    console.log('Updating profile...\n');
    
    // Update profile
    await db.query(`
      UPDATE profile SET 
        full_name = ?,
        title = ?,
        bio = ?,
        objective = ?,
        email = ?,
        phone = ?,
        location = ?
      WHERE id = 1
    `, [
      'Diro Uchure',
      'Full Stack Web Developer',
      'Passionate Full Stack Web Developer with expertise in building modern, scalable web applications using React, Node.js, and MySQL. I create exceptional digital experiences with clean code and user-focused design.',
      'Building innovative web solutions that solve real-world problems and deliver exceptional user experiences.',
      'dirouchure@gmail.com',
      '+251940672637',
      'Ethiopia'
    ]);
    
    console.log('✅ Profile updated!\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('NEW PROFILE:');
    console.log('  Name: Diro Uchure');
    console.log('  Title: Full Stack Web Developer');
    console.log('  Bio: Passionate Full Stack Web Developer...');
    console.log('  Email: dirouchure@gmail.com');
    console.log('  Phone: +251940672637');
    console.log('  Location: Ethiopia\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Restart your servers to see the changes!\n');
    console.log('1. Stop backend (Ctrl+C)');
    console.log('2. Stop frontend (Ctrl+C)');
    console.log('3. Run: START_FRESH.bat\n');
    console.log('Or just refresh your browser if servers are already running!\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  process.exit(0);
}

updateProfile();
