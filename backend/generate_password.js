const bcrypt = require('bcryptjs');

// Generate hash for password: admin123
bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('\n=== PASSWORD HASH GENERATED ===\n');
    console.log('Password: admin123');
    console.log('Hash:', hash);
    console.log('\n=== SQL TO RUN IN PHPMYADMIN ===\n');
    console.log('DELETE FROM admin;');
    console.log(`INSERT INTO admin (username, email, password) VALUES ('admin', 'admin@portfolio.com', '${hash}');`);
    console.log('\n================================\n');
  }
});
