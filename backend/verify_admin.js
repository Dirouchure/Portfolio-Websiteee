const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function verifyAdmin() {
  console.log('\n========================================');
  console.log('VERIFYING ADMIN USER');
  console.log('========================================\n');

  try {
    // Check admin users
    const [users] = await db.query('SELECT * FROM admin');
    
    console.log(`Found ${users.length} admin user(s)\n`);
    
    if (users.length === 0) {
      console.log('❌ NO ADMIN USER FOUND!\n');
      console.log('RUN THIS SQL IN PHPMYADMIN NOW:\n');
      console.log('DELETE FROM admin;');
      console.log("INSERT INTO admin (username, email, password)");
      console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');\n");
      process.exit(1);
    }

    // Check each user
    for (const user of users) {
      console.log('Admin User:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Username: "${user.username}"`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password Hash: ${user.password.substring(0, 30)}...\n`);

      // Test password
      const testPassword = 'admin123';
      const isMatch = await bcrypt.compare(testPassword, user.password);
      
      console.log(`Testing password "admin123":`);
      if (isMatch) {
        console.log(`  ✅ CORRECT! Login should work!\n`);
        console.log('Login with:');
        console.log(`  Username: ${user.username}`);
        console.log('  Password: admin123\n');
      } else {
        console.log(`  ❌ WRONG! Password hash is incorrect!\n`);
        console.log('FIX: Run this SQL in phpMyAdmin:\n');
        console.log(`DELETE FROM admin WHERE username='${user.username}';`);
        console.log("INSERT INTO admin (username, email, password)");
        console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');\n");
      }
    }

    console.log('========================================\n');

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('\nMake sure:');
    console.log('1. MySQL is running (XAMPP)');
    console.log('2. Database "portfolio_db" exists');
    console.log('3. Backend/.env has correct database settings\n');
  }

  process.exit(0);
}

verifyAdmin();
