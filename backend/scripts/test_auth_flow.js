// Simple test script for Auth Module
// Run: node scripts/test_auth_flow.js

async function testLogin() {
    console.log('🔄 Testing Mock Login...');

    try {
        const response = await fetch('http://localhost:3000/api/auth/login-mock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'seller_demo@ugdes.vn',
                role: 'SELLER'
            })
        });

        const data = await response.json();

        console.log('---------------------------------------------------');
        if (response.ok) {
            console.log('✅ TEST PASSED');
            console.log('👤 User:', data.user.email);
            console.log('🎭 Role:', data.user.role);
            console.log('🆔 KYC Status:', data.user.kyc_status); // Expect: VERIFIED_VNEID
            console.log('🔑 Token:', data.token.substring(0, 20) + '...');
        } else {
            console.log('❌ TEST FAILED');
            console.log('Error:', data);
        }
        console.log('---------------------------------------------------');

    } catch (error) {
        console.log('❌ CONNECTION FAILED');
        console.log('Is the server running on port 3000?');
        console.log('Error:', error.message);
    }
}

testLogin();
