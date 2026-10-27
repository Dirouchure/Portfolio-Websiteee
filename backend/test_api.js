const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5001/api';
  
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  TESTING API ENDPOINTS                                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  
  // Test health endpoint
  try {
    console.log('1. Testing /api/health...');
    const health = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Health:', health.data);
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.message);
  }
  
  // Test profile endpoint
  try {
    console.log('\n2. Testing /api/profile...');
    const profile = await axios.get(`${baseURL}/profile`);
    console.log('✅ Profile retrieved successfully');
    console.log('   Name:', profile.data.full_name);
    console.log('   Title:', profile.data.title);
    console.log('   Email:', profile.data.email);
    console.log('   Image:', profile.data.profile_image);
  } catch (error) {
    console.log('❌ Profile endpoint failed:', error.response?.data || error.message);
  }
  
  // Test login endpoint
  try {
    console.log('\n3. Testing /api/auth/login...');
    const login = await axios.post(`${baseURL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Login successful!');
    console.log('   Token:', login.data.token ? 'Generated ✅' : 'Missing ❌');
    console.log('   Username:', login.data.username);
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  process.exit(0);
}

testAPI();
