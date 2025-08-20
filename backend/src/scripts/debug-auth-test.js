// Debug test to identify the exact issue

async function debugTest() {
  const fetch = globalThis.fetch || require('node-fetch');
  
  console.log('🔍 Debug Test for Authentication\n');

  try {
    // 1. Login and get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser123@example.com',
        password: 'TestUser@123!'
      })
    });

    const loginData = await loginRes.json();
    console.log('1. Login Response:', {
      success: loginData.success,
      hasAccessToken: !!(loginData.accessToken || loginData.data?.accessToken),
      tokenType: loginData.data?.tokenType || loginData.tokenType
    });

    if (!loginData.success) {
      console.error('❌ Login failed, cannot test protected route');
      return;
    }

    const accessToken = loginData.accessToken || loginData.data?.accessToken;
    console.log('2. Token received:', accessToken ? 'YES' : 'NO');
    console.log('3. Token length:', accessToken ? accessToken.length : 0);

    // 2. Test protected route with detailed error info
    const profileRes = await fetch('http://localhost:5000/api/auth/user', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const profileData = await profileRes.json();
    console.log('4. Protected Route Response:', {
      status: profileRes.status,
      success: profileData.success,
      message: profileData.message,
      code: profileData.code,
      hasUser: !!(profileData.data?.user)
    });

    if (profileData.success) {
      console.log('✅ Protected route working!');
      console.log('User data:', {
        id: profileData.data.user.id,
        username: profileData.data.user.username,
        email: profileData.data.user.email
      });
    } else {
      console.log('❌ Protected route failed');
      console.log('Full error response:', profileData);
    }

  } catch (error) {
    console.error('Debug test error:', error.message);
  }
}

debugTest();
