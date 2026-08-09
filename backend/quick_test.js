const bcrypt = require('bcryptjs');

console.log('\n=== QUICK LOGIN TEST ===\n');

// Test the exact password hash from database
const passwordFromDatabase = '$2a$10$SNy/R8cXFTSqADV9uIx01OXwg1VuN54xp7JOAa9Ntrar9O6J0UVAW';
const testPassword = 'admin123';

console.log('Testing password: admin123');
console.log('Against hash: ' + passwordFromDatabase.substring(0, 30) + '...\n');

bcrypt.compare(testPassword, passwordFromDatabase, (err, result) => {
  if (err) {
    console.log('ERROR:', err);
  } else if (result) {
    console.log('✓ SUCCESS! Password "admin123" is CORRECT!');
    console.log('\nLogin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
  } else {
    console.log('✗ FAILED! Password does not match!');
    console.log('\nThe password hash in database is wrong.');
    console.log('Run this SQL in phpMyAdmin:\n');
    console.log("DELETE FROM admin;");
    console.log("INSERT INTO admin (username, email, password)");
    console.log("VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');");
  }
  console.log('\n');
  process.exit(0);
});
