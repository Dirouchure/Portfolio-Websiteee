const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const host = (!process.env.DB_HOST || process.env.DB_HOST === "localhost")
  ? "127.0.0.1"
  : process.env.DB_HOST;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "portfolio_db";
const port = parseInt(process.env.DB_PORT, 10) || 3306;

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function autoSetupDatabase() {
  try {
    const serverConn = await mysql
      .createConnection({
        host,
        port,
        user,
        password,
        multipleStatements: true,
      })
      .promise();

    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await serverConn.query(`USE \`${database}\``);

    const [tables] = await serverConn.query("SHOW TABLES LIKE 'admin'");
    if (tables.length === 0) {
      console.log(`⚡ Initializing database '${database}' from portfolio_db.sql...`);
      const sqlPath = path.join(__dirname, "..", "..", "database", "portfolio_db.sql");
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, "utf8");
        await serverConn.query(sql);
        console.log(`✅ Database '${database}' successfully initialized with tables and sample data!`);
      }
    } else {
      console.log(`✅ Database connected successfully! (${database})`);
    }

    await serverConn.end();
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      console.error(`❌ Cannot connect to MySQL at ${host}:${port}. Please make sure MySQL is started in XAMPP!`);
    } else {
      console.error(`⚠️ Database setup notice: ${err.message}`);
    }
  }
}

autoSetupDatabase();

module.exports = pool.promise();