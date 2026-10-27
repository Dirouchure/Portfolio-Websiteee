const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateStudentProfile() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  });

  try {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  UPDATING PROFILE - HARAMAYA UNIVERSITY STUDENT      ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    // Update profile
    await connection.execute(
      `UPDATE profile SET 
        full_name = ?,
        title = ?,
        bio = ?,
        objective = ?,
        email = ?,
        phone = ?,
        location = ?
      WHERE id = 3`,
      [
        'Diro Uchure',
        'Software Engineering Student & Full Stack Developer',
        'Software Engineering student at Haramaya University with a passion for building modern, scalable web applications. Experienced in full-stack development with React, Node.js, and MySQL. Committed to writing clean code and creating impactful digital solutions.',
        'Seeking internship and professional opportunities to apply my software engineering skills in building innovative web applications and growing as a Full Stack Developer.',
        'dirouchure@gmail.com',
        '+251940672637',
        'Haramaya University, Ethiopia'
      ]
    );

    console.log('✓ Profile updated successfully\n');

    // Check and update education
    const [existingEdu] = await connection.execute('SELECT * FROM education');
    
    if (existingEdu.length === 0) {
      // Insert new education
      await connection.execute(
        `INSERT INTO education (school_name, degree, department, start_year, end_year, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'Haramaya University',
          'Bachelor of Science (B.Sc.)',
          'Software Engineering',
          2019,
          2024,
          'Pursuing Software Engineering with focus on web technologies, algorithms, data structures, database systems, and software development methodologies. Building practical projects and gaining hands-on experience in full-stack development.'
        ]
      );
      console.log('✓ Education record added');
    } else {
      // Update existing education
      await connection.execute(
        `UPDATE education SET 
          school_name = ?,
          degree = ?,
          department = ?,
          start_year = ?,
          end_year = ?,
          description = ?
        WHERE id = ?`,
        [
          'Haramaya University',
          'Bachelor of Science (B.Sc.)',
          'Software Engineering',
          2019,
          2024,
          'Pursuing Software Engineering with focus on web technologies, algorithms, data structures, database systems, and software development methodologies. Building practical projects and gaining hands-on experience in full-stack development.',
          existingEdu[0].id
        ]
      );
      console.log('✓ Education record updated');
    }

    // Display updated information
    const [profile] = await connection.execute('SELECT * FROM profile WHERE id = 3');
    const [education] = await connection.execute('SELECT * FROM education LIMIT 1');
    
    if (profile.length > 0 && education.length > 0) {
      console.log('\n═══════════════════════════════════════════════════════');
      console.log('UPDATED PROFILE:');
      console.log('═══════════════════════════════════════════════════════');
      console.log('Name:', profile[0].full_name);
      console.log('Title:', profile[0].title);
      console.log('Location:', profile[0].location);
      console.log('Email:', profile[0].email);
      console.log('Phone:', profile[0].phone);
      console.log('\nEDUCATION:');
      console.log('University:', education[0].school_name);
      console.log('Degree:', education[0].degree);
      console.log('Department:', education[0].department);
      console.log('Period:', `${education[0].start_year} - ${education[0].end_year}`);
      console.log('═══════════════════════════════════════════════════════\n');
    }
    
    console.log('✅ All updates completed successfully!');
    console.log('\n💡 Refresh your browser to see the changes!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateStudentProfile();
