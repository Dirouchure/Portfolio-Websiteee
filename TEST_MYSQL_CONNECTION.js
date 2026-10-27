const mysql = require('./backend/node_modules/mysql2');

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  🔍 TESTING MYSQL CONNECTION                                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio_db'
});

console.log('Connecting to MySQL...\n');

connection.connect((err) => {
  if (err) {
    console.log('❌ CONNECTION FAILED!\n');
    console.log('Error:', err.message);
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('COMMON SOLUTIONS:\n');
    console.log('1. Start XAMPP MySQL');
    console.log('2. Check if MySQL is running on port 3306');
    console.log('3. Check if database "portfolio_db" exists');
    console.log('4. Check if password is correct (currently empty)\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    process.exit(1);
  }

  console.log('✅ CONNECTED TO MYSQL!\n');
  console.log('Checking database...\n');

  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.log('❌ DATABASE ERROR:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('✅ DATABASE TABLES:\n');
    results.forEach(row => {
      console.log('   -', Object.values(row)[0]);
    });

    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('✅ MYSQL CONNECTION IS WORKING!\n');
    console.log('You can now start the backend server.\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    connection.end();
    process.exit(0);
  });
});
