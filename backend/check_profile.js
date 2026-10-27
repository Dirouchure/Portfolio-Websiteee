const db = require('./config/db');

async function checkProfile() {
  try {
    const [rows] = await db.query('SELECT * FROM profile WHERE id = 1');
    
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  CURRENT PROFILE IN DATABASE                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    
    if (rows.length > 0) {
      const profile = rows[0];
      console.log('ID:', profile.id);
      console.log('Name:', profile.full_name);
      console.log('Title:', profile.title);
      console.log('Email:', profile.email);
      console.log('Phone:', profile.phone);
      console.log('Location:', profile.location);
      console.log('\nBio:', profile.bio);
      console.log('\nObjective:', profile.objective);
      console.log('\nProfile Image:', profile.profile_image);
      console.log('\n═══════════════════════════════════════════════════════════════\n');
    } else {
      console.log('❌ No profile found!\n');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  process.exit(0);
}

checkProfile();
