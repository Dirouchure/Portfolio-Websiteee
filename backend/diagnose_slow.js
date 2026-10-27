const db = require('./config/db');
const axios = require('axios');

async function diagnose() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 DIAGNOSING SLOW PERFORMANCE & PROFILE ISSUES             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Test 1: Database Connection
  console.log('TEST 1: Database Connection');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const start = Date.now();
    await db.query('SELECT 1');
    const time = Date.now() - start;
    console.log(`✅ Database responsive: ${time}ms`);
    if (time > 100) {
      console.log('⚠️  WARNING: Database response time > 100ms');
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }
  console.log('');

  // Test 2: Profile Query Speed
  console.log('TEST 2: Profile Query Performance');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const start = Date.now();
    const [profile] = await db.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
    const time = Date.now() - start;
    
    if (profile.length > 0) {
      console.log(`✅ Profile found (ID: ${profile[0].id})`);
      console.log(`   Name: ${profile[0].full_name}`);
      console.log(`   Query time: ${time}ms`);
      if (time > 50) {
        console.log('⚠️  WARNING: Profile query slow (> 50ms)');
      }
    } else {
      console.log('❌ No profile found in database!');
    }
  } catch (error) {
    console.log('❌ Profile query failed:', error.message);
  }
  console.log('');

  // Test 3: Projects Query Speed
  console.log('TEST 3: Projects Query Performance');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const start = Date.now();
    const [projects] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    const time = Date.now() - start;
    console.log(`✅ Found ${projects.length} projects`);
    console.log(`   Query time: ${time}ms`);
    if (time > 100) {
      console.log('⚠️  WARNING: Projects query slow (> 100ms)');
    }
  } catch (error) {
    console.log('❌ Projects query failed:', error.message);
  }
  console.log('');

  // Test 4: Skills Query Speed
  console.log('TEST 4: Skills Query Performance');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const start = Date.now();
    const [skills] = await db.query('SELECT * FROM skills ORDER BY category, skill_name');
    const time = Date.now() - start;
    console.log(`✅ Found ${skills.length} skills`);
    console.log(`   Query time: ${time}ms`);
    if (time > 100) {
      console.log('⚠️  WARNING: Skills query slow (> 100ms)');
    }
  } catch (error) {
    console.log('❌ Skills query failed:', error.message);
  }
  console.log('');

  // Test 5: Backend API Response
  console.log('TEST 5: Backend API Response Times');
  console.log('─────────────────────────────────────────────────────────────');
  
  const endpoints = [
    { name: 'Health Check', url: 'http://localhost:5001/api/health' },
    { name: 'Profile', url: 'http://localhost:5001/api/profile' },
    { name: 'Projects', url: 'http://localhost:5001/api/projects' },
    { name: 'Skills', url: 'http://localhost:5001/api/skills' },
  ];

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      const time = Date.now() - start;
      console.log(`✅ ${endpoint.name}: ${time}ms`);
      if (time > 500) {
        console.log(`   ⚠️  SLOW! Response time > 500ms`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint.name}: Backend not running`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`❌ ${endpoint.name}: TIMEOUT (> 5 seconds)`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }
  console.log('');

  // Test 6: Database Table Status
  console.log('TEST 6: Database Tables Check');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const tables = ['admin', 'profile', 'projects', 'skills', 'education', 'certificates'];
    for (const table of tables) {
      const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`✅ ${table}: ${rows[0].count} records`);
    }
  } catch (error) {
    console.log('❌ Table check failed:', error.message);
  }
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('DIAGNOSIS COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('RECOMMENDATIONS:');
  console.log('');
  console.log('If queries are slow (> 100ms):');
  console.log('  1. Add database indexes (see optimize_database.sql)');
  console.log('  2. Restart MySQL service');
  console.log('  3. Check MySQL configuration');
  console.log('');
  console.log('If API endpoints are slow (> 500ms):');
  console.log('  1. Restart backend server');
  console.log('  2. Check for memory leaks');
  console.log('  3. Optimize API routes');
  console.log('');
  console.log('If profile not showing:');
  console.log('  1. Check if profile exists in database');
  console.log('  2. Verify frontend API URL in .env');
  console.log('  3. Check browser console for errors');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════\n');

  process.exit(0);
}

diagnose().catch(error => {
  console.error('Diagnosis failed:', error);
  process.exit(1);
});
