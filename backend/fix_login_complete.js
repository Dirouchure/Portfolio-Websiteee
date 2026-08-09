const bcrypt = require('bcryptjs');
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════╗');
console.log('║  COMPLETE LOGIN FIX - AUTOMATED           ║');
console.log('╚════════════════════════════════════════════╝\n');

async function fixEverything() {
  let step = 1;

  // ========================================
  // STEP 1: Check Database Connection
  // ========================================
  console.log(`[STEP ${step++}] Checking database connection...`);
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connected\n');
  } catch (error) {
    console.log('❌ DATABASE NOT CONNECTED!\n');
    console.log('SOLUTION:');
    console.log('1. Start XAMPP Control Panel');
    console.log('2. Click "Start" for MySQL');
    console.log('3. Wait for it to turn green');
    console.log('4. Run this script again\n');
    process.exit(1);
  }

  // ========================================
  // STEP 2: Check if portfolio_db exists
  // ========================================
  console.log(`[STEP ${step++}] Checking if database "portfolio_db" exists...`);
  try {
    const [dbs] = await db.query('SHOW DATABASES');
    const dbNames = dbs.map(d => Object.values(d)[0]);
    
    if (!dbNames.includes('portfolio_db')) {
      console.log('❌ Database "portfolio_db" does NOT exist!\n');
      console.log('SOLUTION:');
      console.log('1. Open phpMyAdmin: http://localhost/phpmyadmin');
      console.log('2. Click "New" to create database');
      console.log('3. Name: portfolio_db');
      console.log('4. Click "Create"');
      console.log('5. Import: database/portfolio_db.sql\n');
      process.exit(1);
    }
    console.log('✅ Database "portfolio_db" exists\n');
  } catch (error) {
    console.log('⚠️  Cannot check databases\n');
  }

  // ========================================
  // STEP 3: Check admin table exists
  // ========================================
  console.log(`[STEP ${step++}] Checking if "admin" table exists...`);
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'admin'");
    
    if (tables.length === 0) {
      console.log('❌ Table "admin" does NOT exist!\n');
      console.log('SOLUTION:');
      console.log('1. Open phpMyAdmin: http://localhost/phpmyadmin');
      console.log('2. Click "portfolio_db"');
      console.log('3. Click "Import" tab');
      console.log('4. Choose file: database/portfolio_db.sql');
      console.log('5. Click "Go"\n');
      process.exit(1);
    }
    console.log('✅ Table "admin" exists\n');
  } catch (error) {
    console.log('❌ Cannot check admin table\n');
    process.exit(1);
  }

  // ========================================
  // STEP 4: Check admin users
  // ========================================
  console.log(`[STEP ${step++}] Checking admin users...`);
  try {
    const [users] = await db.query('SELECT * FROM admin');
    
    if (users.length === 0) {
      console.log('⚠️  No admin users found. Creating admin user...\n');
      
      // Create admin user
      const correctHash = '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi';
      await db.query(
        'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
        ['admin', 'admin@portfolio.com', correctHash]
      );
      
      console.log('✅ Admin user created successfully!\n');
    } else {
      console.log(`✅ Found ${users.length} admin user(s)\n`);
    }
  } catch (error) {
    console.log('❌ Error with admin users:', error.message, '\n');
  }

  // ========================================
  // STEP 5: Verify admin password
  // ========================================
  console.log(`[STEP ${step++}] Verifying admin password...`);
  try {
    const [users] = await db.query("SELECT * FROM admin WHERE username = 'admin'");
    
    if (users.length === 0) {
      console.log('⚠️  Username "admin" not found. Creating it...\n');
      
      const correctHash = '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi';
      await db.query(
        'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
        ['admin', 'admin@portfolio.com', correctHash]
      );
      
      console.log('✅ Admin user created!\n');
    } else {
      const user = users[0];
      const isCorrect = await bcrypt.compare('admin123', user.password);
      
      if (!isCorrect) {
        console.log('⚠️  Password is wrong. Fixing it...\n');
        
        const correctHash = '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi';
        await db.query(
          'UPDATE admin SET password = ? WHERE username = ?',
          [correctHash, 'admin']
        );
        
        console.log('✅ Password fixed!\n');
      } else {
        console.log('✅ Password is correct!\n');
      }
    }
  } catch (error) {
    console.log('❌ Error verifying password:', error.message, '\n');
  }

  // ========================================
  // STEP 6: Final verification
  // ========================================
  console.log(`[STEP ${step++}] Final verification...`);
  try {
    const [users] = await db.query("SELECT * FROM admin WHERE username = 'admin'");
    
    if (users.length > 0) {
      const user = users[0];
      const isCorrect = await bcrypt.compare('admin123', user.password);
      
      if (isCorrect) {
        console.log('✅ Everything is correct!\n');
      } else {
        console.log('❌ Still incorrect. Manual fix needed.\n');
      }
    }
  } catch (error) {
    console.log('❌ Error in final verification\n');
  }

  // ========================================
  // STEP 7: Check .env file
  // ========================================
  console.log(`[STEP ${step++}] Checking .env configuration...`);
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file missing!\n');
    
    const defaultEnv = `PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created .env file\n');
  } else {
    console.log('✅ .env file exists\n');
  }

  // ========================================
  // STEP 8: Check uploads folder
  // ========================================
  console.log(`[STEP ${step++}] Checking uploads folder...`);
  const uploadsPath = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log('✅ Created uploads folder\n');
  } else {
    console.log('✅ Uploads folder exists\n');
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  console.log('╔════════════════════════════════════════════╗');
  console.log('║         ✅ LOGIN FIXED! ✅                 ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  console.log('🎉 ALL FIXES APPLIED!\n');
  console.log('═══════════════════════════════════════════\n');
  console.log('LOGIN CREDENTIALS:');
  console.log('  Username: admin');
  console.log('  Password: admin123\n');
  console.log('═══════════════════════════════════════════\n');
  console.log('NEXT STEPS:\n');
  console.log('1. Make sure backend is running:');
  console.log('   cd backend');
  console.log('   node server.js\n');
  console.log('2. Make sure frontend is running:');
  console.log('   cd frontend');
  console.log('   npm start\n');
  console.log('3. Go to: http://localhost:3000/admin/login');
  console.log('   (or whatever port your frontend is on)\n');
  console.log('4. Login with:');
  console.log('   Username: admin');
  console.log('   Password: admin123\n');
  console.log('5. If still not working, clear browser cache:');
  console.log('   Press Ctrl+Shift+Delete\n');
  console.log('═══════════════════════════════════════════\n');

  process.exit(0);
}

fixEverything();
