const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'portfolio_db';

  console.log(`Connecting to MySQL server at ${host} as ${user}...`);
  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true,
    });

    const sqlPath = path.join(__dirname, '..', 'database', 'portfolio_db.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found at: ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log(`Applying complete schema and seed data to database '${database}'...`);
    await connection.query(sql);

    console.log('✅ Database setup completed successfully!');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exit(1);
  }
}

initDB();
