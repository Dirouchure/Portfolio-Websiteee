const mysql = require('mysql2/promise');
require('dotenv').config();

async function deleteOtherProjects() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('Connected to database...\n');
    
    // First, show all current projects
    const [allProjects] = await connection.execute('SELECT id, title FROM projects ORDER BY id');
    console.log('Current projects in database:');
    allProjects.forEach(p => {
      console.log(`  ID: ${p.id} - ${p.title}`);
    });
    console.log(`\nTotal: ${allProjects.length} projects\n`);
    
    // Delete all projects EXCEPT "Online Examination System"
    const [result] = await connection.execute(
      `DELETE FROM projects WHERE title != 'Online Examination System' AND title NOT LIKE '%online%examination%'`
    );
    
    console.log(`✓ Deleted ${result.affectedRows} projects\n`);
    
    // Show remaining projects
    const [remaining] = await connection.execute('SELECT id, title, live_url, project_url FROM projects');
    console.log('Remaining projects:');
    if (remaining.length === 0) {
      console.log('  No projects found!');
    } else {
      remaining.forEach(p => {
        console.log(`  ID: ${p.id} - ${p.title}`);
        console.log(`    Live URL: ${p.live_url || 'None'}`);
        console.log(`    Project URL: ${p.project_url || 'None'}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

deleteOtherProjects();
