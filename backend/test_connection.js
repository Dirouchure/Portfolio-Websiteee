const mysql = require('mysql2');
require('dotenv').config();

console.log('\n========================================');
console.log('  TESTING DATABASE CONNECTION');
console.log('========================================\n');

console.log('Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '(set)' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('\n');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

async function testConnection() {
  try {
    console.log('Attempting to connect to database...\n');
    
    // Test basic connection
    const [rows] = await promisePool.query('SELECT 1 as test');
    console.log('✓ Database connection successful!\n');

    // Check if tables exist
    console.log('Checking database tables...');
    const [tables] = await promisePool.query('SHOW TABLES');
    console.log(`✓ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log('  -', Object.values(table)[0]);
    });
    console.log('\n');

    // Check admin table
    console.log('Checking admin account...');
    const [admins] = await promisePool.query('SELECT id, username, email FROM admin');
    if (admins.length > 0) {
      console.log('✓ Admin account found:');
      console.log('  Username:', admins[0].username);
      console.log('  Email:', admins[0].email);
      console.log('  ID:', admins[0].id);
    } else {
      console.log('✗ No admin account found!');
    }
    console.log('\n');

    // Check profile table
    console.log('Checking profile data...');
    const [profiles] = await promisePool.query('SELECT id, full_name, title FROM profile');
    if (profiles.length > 0) {
      console.log('✓ Profile found:');
      console.log('  Name:', profiles[0].full_name);
      console.log('  Title:', profiles[0].title);
    } else {
      console.log('✗ No profile found!');
    }
    console.log('\n');

    console.log('========================================');
    console.log('  ALL CONNECTIONS WORKING! ✓');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.log('\n✗ ERROR: Connection failed!\n');
    console.log('Error Message:', error.message);
    console.log('Error Code:', error.code);
    console.log('\n');
    
    console.log('POSSIBLE SOLUTIONS:');
    if (error.code === 'ECONNREFUSED') {
      console.log('- MySQL is not running in XAMPP');
      console.log('- Start MySQL in XAMPP Control Panel');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('- Database "portfolio_db" does not exist');
      console.log('- Import database/portfolio_db.sql in phpMyAdmin');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('- Wrong database credentials');
      console.log('- Check backend/.env file');
    } else {
      console.log('- Check error message above');
      console.log('- Verify MySQL is running');
      console.log('- Verify database exists');
    }
    console.log('\n');
    
    process.exit(1);
  }
}

testConnection();
