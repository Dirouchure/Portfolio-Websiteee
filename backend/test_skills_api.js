const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5001/api';

function makeRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject({ statusCode: res.statusCode, data: json });
          } else {
            resolve({ statusCode: res.statusCode, data: json });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testSkillsAPI() {
  try {
    console.log('=== Testing Skills API ===\n');

    // Step 1: Login to get token
    console.log('1. Logging in as admin...');
    const loginResponse = await makeRequest('POST', '/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Login successful! Token received.\n');

    // Step 2: Try to add a skill
    console.log('2. Adding a test skill...');
    const skillData = {
      skill_name: 'Test API Skill',
      category: 'Testing',
      proficiency: 75
    };

    const addResponse = await makeRequest('POST', '/skills', skillData, token);

    console.log('✓ Skill added successfully!');
    console.log('Response:', addResponse.data);
    console.log('');

    // Step 3: Fetch all skills
    console.log('3. Fetching all skills...');
    const getResponse = await makeRequest('GET', '/skills');
    console.log(`✓ Found ${getResponse.data.length} skills`);
    
    // Find our test skill
    const testSkill = getResponse.data.find(s => s.skill_name === 'Test API Skill');
    if (testSkill) {
      console.log('✓ Test skill found in database:', testSkill);
      console.log('');

      // Step 4: Delete the test skill
      console.log('4. Deleting test skill...');
      await makeRequest('DELETE', `/skills/${testSkill.id}`, null, token);
      console.log('✓ Test skill deleted successfully');
    }

    console.log('\n=== All tests passed! Skills API is working! ===');

  } catch (error) {
    console.error('\n✗ Error occurred:');
    if (error.statusCode) {
      console.error('Status:', error.statusCode);
      console.error('Response:', JSON.stringify(error.data, null, 2));
    } else {
      console.error('Error:', error.message || error);
    }
    console.error('\nIs the backend running on http://localhost:5001?');
  }
}

testSkillsAPI();
