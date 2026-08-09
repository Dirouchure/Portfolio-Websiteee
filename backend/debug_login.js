const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function debugLogin() {
  console.log('\n========================================');
  console.log('DEBUG LOGIN SYSTEM');
  console.log('========================================\n');

  try {
    // Step 1: Test database connection
    console.log('Step 1: Testing database connection...');
    const [testResult] = await db.query('SELECT 1 as test');
    console.log('✓ Database connected\n');

    // Step 2: Check admin table
    console.log('Step 2: Checking admin users in database...');
    const [users] = await db.query('SELECT * FROM admin');
    console.log(`Found ${users.length} admin user(s)\n`);

    if (users.length === 0) {
      console.log('✗ ERROR: No admin users found!\n');
      console.log('SOLUTION: Run this SQL in phpMyAdmin:\n');
      console.log("DELETE FROM admin;");
      console.log("INSERT INTO admin (username, email, password)");
      console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');\n");
      process.exit(1);
    }

    // Step 3: Show all admin users
    console.log('Admin users in database:');
    console.log('------------------------');
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Username: "${user.username}"`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password Hash: ${user.password.substring(0, 30)}...`);
      console.log('');
    });

    // Step 4: Test password for each user
    console.log('Step 3: Testing passwords...\n');
    
    for (const user of users) {
      console.log(`Testing user: "${user.username}"`);
      
      // Test with 'admin123'
      const isMatch1 = await bcrypt.compare('admin123', user.password);
      console.log(`  Password "admin123": ${isMatch1 ? '✓ WORKS' : '✗ FAILED'}`);
      
      // Test with 'Admin123'
      const isMatch2 = await bcrypt.compare('Admin123', user.password);
      console.log(`  Password "Admin123": ${isMatch2 ? '✓ WORKS' : '✗ FAILED'}`);
      
      console.log('');
    }

    // Step 5: Test the exact login flow
    console.log('Step 4: Simulating login with username "admin"...\n');
    const username = 'admin';
    const password = 'admin123';
    
    const [loginUsers] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    
    if (loginUsers.length === 0) {
      console.log('✗ ERROR: Username "admin" not found in database!\n');
      console.log('Available usernames:');
      users.forEach(u => console.log(`  - "${u.username}"`));
      console.log('\nSOLUTION: Run this SQL:\n');
      console.log("DELETE FROM admin;");
      console.log("INSERT INTO admin (username, email, password)");
      console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');\n");
      process.exit(1);
    }

    const loginUser = loginUsers[0];
    const isValidPassword = await bcrypt.compare(password, loginUser.password);

    console.log('Login Test Results:');
    console.log('-------------------');
    console.log(`Username: "${username}" - ${loginUsers.length > 0 ? '✓ Found' : '✗ Not Found'}`);
    console.log(`Password: "${password}" - ${isValidPassword ? '✓ Correct' : '✗ Wrong'}`);
    console.log('');

    if (isValidPassword) {
      console.log('========================================');
      console.log('✓✓✓ LOGIN SHOULD WORK! ✓✓✓');
      console.log('========================================');
      console.log('\nCredentials:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('\nIf still not working, check:');
      console.log('1. Backend is running (node server.js)');
      console.log('2. Frontend points to http://localhost:5000');
      console.log('3. Clear browser cache');
      console.log('4. Check browser console for errors (F12)');
    } else {
      console.log('========================================');
      console.log('✗✗✗ PASSWORD IS WRONG IN DATABASE ✗✗✗');
      console.log('========================================');
      console.log('\nRun this SQL in phpMyAdmin NOW:\n');
      console.log("DELETE FROM admin;");
      console.log("INSERT INTO admin (username, email, password)");
      console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');");
    }

  } catch (error) {
    console.log('✗ ERROR:', error.message);
    console.log('\nPossible issues:');
    console.log('1. MySQL not running (start XAMPP)');
    console.log('2. Database "portfolio_db" does not exist');
    console.log('3. Check backend/.env file settings');
  }

  console.log('\n');
  process.exit(0);
}

debugLogin();
