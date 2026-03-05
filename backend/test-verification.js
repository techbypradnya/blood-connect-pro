/**
 * TEST SCRIPT: Email Verification Endpoint
 * Tests the GET /api/auth/verify-email/:token endpoint
 */

const axios = require('axios');

async function testVerification() {
  try {
    console.log('\n========== TESTING EMAIL VERIFICATION ==========\n');

    // First, let's get a token from the database or use a test token
    // For this test, we'll use a dummy token that should fail
    const testToken = "dummy_token_that_should_fail";

    console.log('🔍 Testing verification with invalid token...');
    console.log('Token:', testToken);

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${testToken}`);
      console.log('❌ Unexpected success with invalid token:', response.data);
    } catch (error) {
      console.log('✅ Expected error for invalid token:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }

    console.log('\n📝 To test with a real token:');
    console.log('1. Check Mailtrap inbox at https://mailtrap.io');
    console.log('2. Find the verification email');
    console.log('3. Copy the verification URL from the email');
    console.log('4. Extract the token from the URL');
    console.log('5. Test with: GET /api/auth/verify-email/{real_token}');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testVerification();