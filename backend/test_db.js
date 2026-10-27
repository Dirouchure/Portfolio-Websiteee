const db = require('./config/db');

async function testDatabase() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  TESTING DATABASE CONNECTION                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    
    // Check admin table
    console.log('Checking ADMIN table...');
    const [admins] = await db.query('SELECT id, username, email FROM admin');
    console.log('✅ Admin users:', admins.length);
    if (admins.length > 0) {
      admins.forEach(admin => {
        console.log(`   - ID: ${admin.id}, Username: ${admin.username}, Email: ${admin.email}`);
      });
    } else {
      console.log('❌ No admin users found!');
    }
    
    // Check profile table
    console.log('\nChecking PROFILE table...');
    const [profiles] = await db.query('SELECT * FROM profile');
    console.log('✅ Profiles:', profiles.length);
    if (profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}, Name: ${profile.full_name}, Title: ${profile.title}`);
      });
      
      console.log('\n--- LATEST PROFILE (ORDER BY ID DESC) ---');
      const [latest] = await db.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
      if (latest.length > 0) {
        const p = latest[0];
        console.log('ID:', p.id);
        console.log('Name:', p.full_name);
        console.log('Title:', p.title);
        console.log('Email:', p.email);
        console.log('Phone:', p.phone);
        console.log('Location:', p.location);
        console.log('Profile Image:', p.profile_image);
      }
    } else {
      console.log('❌ No profiles found!');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.log('❌ DATABASE ERROR:', error.message);
  }
  
  process.exit(0);
}

testDatabase();
