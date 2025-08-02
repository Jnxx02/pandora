// Test script untuk mengecek API endpoints
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test statistik endpoint
    console.log('2. Testing /api/statistik...');
    const statistikResponse = await fetch('http://localhost:3001/api/statistik');
    const statistikData = await statistikResponse.json();
    console.log('✅ Statistik data:', statistikData.length, 'items');
    console.log('');

    // Test prasarana endpoint
    console.log('3. Testing /api/prasarana...');
    const prasaranaResponse = await fetch('http://localhost:3001/api/prasarana');
    const prasaranaData = await prasaranaResponse.json();
    console.log('✅ Prasarana data:', prasaranaData.length, 'items');
    console.log('Sample data:', prasaranaData[0]);
    console.log('');

    console.log('🎉 All API endpoints are working!');
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('Make sure backend server is running on port 3001');
  }
}

testAPI(); 