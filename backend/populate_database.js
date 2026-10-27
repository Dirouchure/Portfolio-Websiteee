const db = require('./config/db');

async function populateDatabase() {
  console.log('🚀 Starting database population...\n');

  try {
    // 1. Add Skills
    console.log('📊 Adding skills...');
    const skills = [
      ['React.js', 'Frontend', 90],
      ['JavaScript', 'Frontend', 92],
      ['HTML5', 'Frontend', 95],
      ['CSS3', 'Frontend', 90],
      ['Node.js', 'Backend', 85],
      ['Express.js', 'Backend', 88],
      ['MySQL', 'Database', 82],
      ['Git', 'Tools & DevOps', 88],
      ['GitHub', 'Tools & DevOps', 90],
      ['TailwindCSS', 'Frontend', 85],
      ['Docker', 'Tools & DevOps', 70],
      ['REST API', 'Backend', 87],
      ['JWT Authentication', 'Backend', 80],
    ];

    for (const [skill_name, category, proficiency] of skills) {
      await db.query(
        'INSERT IGNORE INTO skills (skill_name, category, proficiency) VALUES (?, ?, ?)',
        [skill_name, category, proficiency]
      );
    }
    console.log('✅ Skills added!\n');

    // 2. Add Experience
    console.log('💼 Adding experience...');
    const experiences = [
      [
        'Freelance Projects',
        'Full Stack Developer',
        '2022-01-01',
        null,
        1,
        'Developed and deployed multiple full-stack web applications for clients. Built RESTful APIs with Node.js/Express, designed MySQL databases, and created responsive React frontends. Managed complete development lifecycle from requirements gathering to production deployment.',
        'React.js, Node.js, Express.js, MySQL, REST API, Git'
      ],
      [
        'Haramaya University',
        'Software Engineering Student',
        '2019-09-01',
        '2024-06-01',
        0,
        'Pursuing B.Sc. in Software Engineering with focus on web development, database design, algorithms, and software architecture. Completed multiple academic projects including online examination system, e-commerce platform, and portfolio websites.',
        'Software Engineering, Web Development, Database Design, Algorithms'
      ]
    ];

    for (const exp of experiences) {
      await db.query(
        'INSERT IGNORE INTO experience (company_name, position, start_date, end_date, is_current, responsibilities, technologies) VALUES (?, ?, ?, ?, ?, ?, ?)',
        exp
      );
    }
    console.log('✅ Experience added!\n');

    // 3. Add Certificates
    console.log('🎓 Adding certificates...');
    const certificates = [
      ['Full Stack Web Development', 'Online Course Platform', '2023-06-15'],
      ['JavaScript Algorithms and Data Structures', 'freeCodeCamp', '2023-03-20'],
      ['React - The Complete Guide', 'Udemy', '2023-08-10'],
      ['Node.js, Express, MongoDB & More', 'Udemy', '2023-05-25'],
      ['MySQL Database Administration', 'Coursera', '2022-11-30'],
    ];

    for (const [title, organization, issue_date] of certificates) {
      await db.query(
        'INSERT IGNORE INTO certificates (title, organization, issue_date) VALUES (?, ?, ?)',
        [title, organization, issue_date]
      );
    }
    console.log('✅ Certificates added!\n');

    // 4. Add Services
    console.log('🛠️ Adding services...');
    const services = [
      [
        'Full Stack Web Development',
        'End-to-end web application development with modern technologies. From database design to responsive frontend, I build scalable and maintainable solutions.',
        'fa-code'
      ],
      [
        'REST API Development',
        'Design and implementation of secure RESTful APIs with authentication, validation, and documentation. Built for performance and scalability.',
        'fa-server'
      ],
      [
        'Database Design',
        'Professional MySQL database design with normalized schemas, optimized queries, and robust data integrity. Focus on performance and maintainability.',
        'fa-database'
      ],
      [
        'Frontend Development',
        'Modern, responsive React applications with clean UI/UX. Component-based architecture, state management, and performance optimization.',
        'fa-laptop-code'
      ]
    ];

    for (const [service_name, description, icon] of services) {
      await db.query(
        'INSERT IGNORE INTO services (service_name, description, icon) VALUES (?, ?, ?)',
        [service_name, description, icon]
      );
    }
    console.log('✅ Services added!\n');

    // 5. Check counts
    console.log('📈 Database Statistics:');
    const [skillCount] = await db.query('SELECT COUNT(*) as count FROM skills');
    const [expCount] = await db.query('SELECT COUNT(*) as count FROM experience');
    const [certCount] = await db.query('SELECT COUNT(*) as count FROM certificates');
    const [servCount] = await db.query('SELECT COUNT(*) as count FROM services');

    console.log(`   Skills: ${skillCount[0].count}`);
    console.log(`   Experience: ${expCount[0].count}`);
    console.log(`   Certificates: ${certCount[0].count}`);
    console.log(`   Services: ${servCount[0].count}`);

    console.log('\n✅ Database population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    process.exit(1);
  }
}

populateDatabase();
