const fetch = require('node-fetch');

async function testBackend() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('Testing backend connection...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    
    // Test guest login
    console.log('\n2. Testing guest login...');
    const guestResponse = await fetch(`${baseUrl}/api/auth/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (guestResponse.ok) {
      const guestData = await guestResponse.json();
      console.log('Guest login successful:', guestData);
    } else {
      const errorData = await guestResponse.json();
      console.log('Guest login failed:', errorData);
    }
    
  } catch (error) {
    console.error('Backend test failed:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Make sure the backend server is running (cd backend && npm start)');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify the server is running on port 5000');
  }
}

testBackend(); 