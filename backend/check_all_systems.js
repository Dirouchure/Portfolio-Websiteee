const fs = require('fs');
const path = require('path');
const db = require('./config/db');

console.log('\n╔════════════════════════════════════════════╗');
console.log('║  PORTFOLIO WEBSITE - COMPLETE CHECK        ║');
console.log('╚════════════════════════════════════════════╝\n');

let allGood = true;
let issuesFound = [];

async function checkEverything() {
  
  // ========================================
  // 1. CHECK BACKEND FILES
  // ========================================
  console.log('📁 CHECKING BACKEND FILES...\n');
  
  const backendFiles = [
    'server.js',
    'config/db.js',
    '.env',
    'middleware/auth.js',
    'middleware/upload.js',
    'routes/auth.js',
    'routes/profile.js',
    'routes/projects.js',
    'routes/skills.js',
    'routes/education.js',
    'routes/experience.js',
    'routes/certificates.js',
    'routes/contact.js',
    'routes/video_reel.js',
    'routes/services.js',
    'package.json'
  ];

  backendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  ✗ ${file} - MISSING!`);
      allGood = false;
      issuesFound.push(`Backend file missing: ${file}`);
    }
  });

  // ========================================
  // 2. CHECK FRONTEND FILES
  // ========================================
  console.log('\n📁 CHECKING FRONTEND FILES...\n');
  
  const frontendFiles = [
    '../frontend/src/App.js',
    '../frontend/src/index.js',
    '../frontend/src/config/api.js',
    '../frontend/src/components/Navbar.js',
    '../frontend/src/components/Footer.js',
    '../frontend/src/pages/Home.js',
    '../frontend/src/pages/About.js',
    '../frontend/src/pages/Skills.js',
    '../frontend/src/pages/Projects.js',
    '../frontend/src/pages/Education.js',
    '../frontend/src/pages/Experience.js',
    '../frontend/src/pages/Certificates.js',
    '../frontend/src/pages/Contact.js',
    '../frontend/src/pages/VideoReel.js',
    '../frontend/src/pages/Services.js',
    '../frontend/src/pages/admin/Login.js',
    '../frontend/src/pages/admin/Dashboard.js',
    '../frontend/src/pages/admin/ManageProjects.js',
    '../frontend/src/pages/admin/ManageSkills.js',
    '../frontend/src/pages/admin/ManageEducation.js',
    '../frontend/src/pages/admin/ManageExperience.js',
    '../frontend/src/pages/admin/ManageCertificates.js',
    '../frontend/src/pages/admin/ManageProfile.js',
    '../frontend/src/pages/admin/ManageVideoReel.js',
    '../frontend/src/pages/admin/ManageServices.js',
    '../frontend/package.json'
  ];

  let frontendOK = 0;
  let frontendMissing = 0;

  frontendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      frontendOK++;
    } else {
      frontendMissing++;
      if (frontendMissing <= 3) {
        console.log(`  ✗ ${file} - MISSING!`);
      }
    }
  });

  console.log(`  ✓ ${frontendOK} files found`);
  if (frontendMissing > 0) {
    console.log(`  ✗ ${frontendMissing} files missing`);
    allGood = false;
    issuesFound.push(`${frontendMissing} frontend files missing`);
  }

  // ========================================
  // 3. CHECK DATABASE FILES
  // ========================================
  console.log('\n📁 CHECKING DATABASE FILES...\n');
  
  const dbFiles = [
    '../database/portfolio_db.sql',
    '../database/enhance_projects.sql',
    '../database/add_new_features.sql'
  ];

  dbFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ ${path.basename(file)}`);
    } else {
      console.log(`  ✗ ${path.basename(file)} - MISSING!`);
    }
  });

  // ========================================
  // 4. CHECK DATABASE CONNECTION
  // ========================================
  console.log('\n🔌 CHECKING DATABASE CONNECTION...\n');
  
  try {
    const [result] = await db.query('SELECT 1 as test');
    console.log('  ✓ Database connected successfully');
  } catch (error) {
    console.log('  ✗ Database connection FAILED!');
    console.log(`  Error: ${error.message}`);
    allGood = false;
    issuesFound.push('Database not connected');
  }

  // ========================================
  // 5. CHECK DATABASE TABLES
  // ========================================
  console.log('\n📊 CHECKING DATABASE TABLES...\n');
  
  const requiredTables = [
    'admin',
    'profile',
    'skills',
    'projects',
    'education',
    'experience',
    'certificates',
    'contact_messages',
    'video_reel',
    'services'
  ];

  try {
    const [tables] = await db.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`  ✓ ${table}`);
      } else {
        console.log(`  ✗ ${table} - MISSING!`);
        allGood = false;
        issuesFound.push(`Table missing: ${table}`);
      }
    });
  } catch (error) {
    console.log('  ✗ Cannot check tables');
    allGood = false;
  }

  // ========================================
  // 6. CHECK ADMIN USER
  // ========================================
  console.log('\n👤 CHECKING ADMIN USER...\n');
  
  try {
    const [users] = await db.query('SELECT * FROM admin');
    if (users.length === 0) {
      console.log('  ✗ No admin user found!');
      allGood = false;
      issuesFound.push('Admin user missing');
    } else {
      console.log(`  ✓ Found ${users.length} admin user(s)`);
      users.forEach(user => {
        console.log(`     Username: ${user.username}`);
        console.log(`     Email: ${user.email}`);
      });
    }
  } catch (error) {
    console.log('  ✗ Cannot check admin user');
    allGood = false;
  }

  // ========================================
  // 7. CHECK PROJECTS TABLE STRUCTURE
  // ========================================
  console.log('\n🔧 CHECKING PROJECTS TABLE (ENHANCED FEATURES)...\n');
  
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM projects');
    const columnNames = columns.map(c => c.Field);
    
    const enhancedFields = ['status', 'client_name', 'duration', 'team_size', 'highlights', 'tags', 'is_featured', 'views'];
    const hasEnhanced = enhancedFields.filter(field => columnNames.includes(field));
    
    if (hasEnhanced.length === enhancedFields.length) {
      console.log('  ✓ Projects table has all enhanced features');
    } else {
      console.log(`  ⚠ Projects table enhanced: ${hasEnhanced.length}/${enhancedFields.length} fields`);
      console.log('  → Run: database/enhance_projects.sql to add all features');
    }
  } catch (error) {
    console.log('  ✗ Cannot check projects table');
  }

  // ========================================
  // 8. CHECK ENV FILE
  // ========================================
  console.log('\n⚙️  CHECKING .ENV CONFIGURATION...\n');
  
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`  ✓ ${varName} configured`);
      } else {
        console.log(`  ✗ ${varName} - MISSING!`);
        allGood = false;
      }
    });
  } else {
    console.log('  ✗ .env file not found!');
    allGood = false;
    issuesFound.push('.env file missing');
  }

  // ========================================
  // 9. CHECK UPLOADS FOLDER
  // ========================================
  console.log('\n📂 CHECKING UPLOADS FOLDER...\n');
  
  const uploadsPath = path.join(__dirname, 'uploads');
  if (fs.existsSync(uploadsPath)) {
    console.log('  ✓ Uploads folder exists');
    const files = fs.readdirSync(uploadsPath);
    console.log(`  ✓ Contains ${files.length} file(s)`);
  } else {
    console.log('  ✗ Uploads folder missing!');
    allGood = false;
    issuesFound.push('Uploads folder missing');
  }

  // ========================================
  // 10. CHECK NODE_MODULES
  // ========================================
  console.log('\n📦 CHECKING DEPENDENCIES...\n');
  
  const backendModules = path.join(__dirname, 'node_modules');
  const frontendModules = path.join(__dirname, '../frontend/node_modules');
  
  if (fs.existsSync(backendModules)) {
    console.log('  ✓ Backend node_modules installed');
  } else {
    console.log('  ✗ Backend node_modules missing! Run: npm install');
    allGood = false;
    issuesFound.push('Backend dependencies not installed');
  }
  
  if (fs.existsSync(frontendModules)) {
    console.log('  ✓ Frontend node_modules installed');
  } else {
    console.log('  ✗ Frontend node_modules missing! Run: npm install');
    allGood = false;
    issuesFound.push('Frontend dependencies not installed');
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  if (allGood) {
    console.log('║        ✓✓✓ ALL SYSTEMS OK! ✓✓✓            ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n🎉 Your portfolio is 100% ready!\n');
    console.log('TO START:');
    console.log('1. Backend: cd backend && node server.js');
    console.log('2. Frontend: cd frontend && npm start');
    console.log('3. Login: http://localhost:3000/admin/login');
    console.log('   Username: admin');
    console.log('   Password: admin123');
  } else {
    console.log('║       ⚠️  ISSUES FOUND  ⚠️                 ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n❌ Found ' + issuesFound.length + ' issue(s):\n');
    issuesFound.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
    console.log('\n📝 FIXES NEEDED:');
    
    if (issuesFound.includes('Database not connected')) {
      console.log('\n→ Start XAMPP and enable MySQL');
    }
    if (issuesFound.includes('Admin user missing')) {
      console.log('\n→ Run this SQL in phpMyAdmin:');
      console.log("   DELETE FROM admin;");
      console.log("   INSERT INTO admin (username, email, password)");
      console.log("   VALUES ('admin', 'admin@portfolio.com', '$2a$10$vHeN4Co2KIpngdPhpcOUD.AcXbvqLnXBaxDXgXSGn5KaQxJZ49abi');");
    }
    if (issuesFound.some(i => i.includes('Table missing'))) {
      console.log('\n→ Import database/portfolio_db.sql in phpMyAdmin');
      console.log('→ Then import database/add_new_features.sql');
    }
    if (issuesFound.some(i => i.includes('dependencies'))) {
      console.log('\n→ Run: npm install in backend folder');
      console.log('→ Run: npm install in frontend folder');
    }
  }

  console.log('\n');
  process.exit(allGood ? 0 : 1);
}

checkEverything();
