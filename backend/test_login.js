const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function testLogin() {
  console.log('=== TESTING LOGIN SYSTEM ===\n');

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const [result] = await db.query('SELECT 1 as test');
    console.log('✓ Database connected successfully\n');

    // Test 2: Check if admin table exists
    console.log('2. Checking admin table...');
    const [tables] = await db.query("SHOW TABLES LIKE 'admin'");
    if (tables.length === 0) {
      console.log('✗ Admin table does NOT exist!');
      console.log('  Solution: Import database/portfolio_db.sql\n');
      process.exit(1);
    }
    console.log('✓ Admin table exists\n');

    // Test 3: Check if admin user exists
    console.log('3. Checking admin user...');
    const [users] = await db.query('SELECT * FROM admin');
    console.log(`Found ${users.length} admin user(s)\n`);
    
    if (users.length === 0) {
      console.log('✗ No admin users found!');
      console.log('  Solution: Run the INSERT command below in phpMyAdmin:\n');
      console.log("  DELETE FROM admin;");
      console.log("  INSERT INTO admin (username, email, password) VALUES ('admin', 'admin@portfolio.com', '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW');\n");
      process.exit(1);
    }

    // Test 4: Show admin users
    console.log('4. Admin users in database:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. Username: ${user.username}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Password Hash: ${user.password.substring(0, 20)}...`);
    });
    console.log('');

    // Test 5: Test password comparison
    console.log('5. Testing password for username "admin"...');
    const adminUser = users.find(u => u.username === 'admin');
    
    if (!adminUser) {
      console.log('✗ Username "admin" not found!');
      console.log('  Available usernames:', users.map(u => u.username).join(', '));
      console.log('\n  Solution: Use one of the available usernames OR run this in phpMyAdmin:\n');
      console.log("  INSERT INTO admin (username, email, password) VALUES ('admin', 'admin@portfolio.com', '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW');\n");
      process.exit(1);
    }

    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isMatch) {
      console.log(`✓ Password "admin123" is CORRECT!\n`);
      console.log('=== LOGIN CREDENTIALS ===');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('=========================\n');
      console.log('✓ Everything is working! You can login now.');
    } else {
      console.log(`✗ Password "admin123" does NOT match!\n`);
      console.log('The password hash in database is wrong.');
      console.log('Solution: Run this in phpMyAdmin SQL tab:\n');
      console.log("DELETE FROM admin WHERE username='admin';");
      console.log("INSERT INTO admin (username, email, password) VALUES ('admin', 'admin@portfolio.com', '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW');\n");
    }

  } catch (error) {
    console.log('✗ Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. MySQL is not running (start XAMPP)');
    console.log('2. Database "portfolio_db" does not exist');
    console.log('3. Wrong database credentials in backend/.env');
  }

  process.exit(0);
}

testLogin();
