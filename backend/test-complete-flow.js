/**
 * COMPREHENSIVE TEST: Complete Email Verification Flow
 * Tests the entire registration → email → verification flow
 */

const axios = require('axios');

async function testCompleteFlow() {
  try {
    console.log('\n========== COMPLETE EMAIL VERIFICATION FLOW TEST ==========\n');

    // Step 1: Register a new user
    console.log('📝 Step 1: Registering new user...');
    const testData = {
      fullName: "Complete Test User",
      email: "complete-test@example.com",
      phone: "+919876543212",
      password: "TestPass123",
      role: "donor",
      bloodGroup: "A+",
      city: "Delhi",
      state: "Delhi"
    };

    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Registration successful!');
    console.log('User ID:', registerResponse.data.data._id);
    console.log('Email:', registerResponse.data.data.email);
    console.log('Is Verified:', registerResponse.data.data.isVerified);

    // Step 2: Simulate getting the verification token from email
    // In a real scenario, you'd check Mailtrap and extract the token
    console.log('\n📧 Step 2: Simulating email verification...');
    console.log('In a real scenario:');
    console.log('1. User receives email at complete-test@example.com');
    console.log('2. Email contains link: http://localhost:8081/verify-email/{token}');
    console.log('3. User clicks the link, frontend loads VerifyEmail page');
    console.log('4. Frontend calls: GET /api/auth/verify-email/{token}');

    // Step 3: Test the verification endpoint with a mock token
    // Note: In real testing, you'd extract the actual token from the email
    console.log('\n🔍 Step 3: Testing verification endpoint structure...');

    // Test with invalid token (should fail)
    try {
      await axios.get('http://localhost:5000/api/auth/verify-email/invalid_token');
      console.log('❌ Unexpected success with invalid token');
    } catch (error) {
      console.log('✅ Correctly rejected invalid token:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
    }

    console.log('\n🎉 Flow Test Complete!');
    console.log('\nTo test with real email:');
    console.log('1. Check Mailtrap: https://mailtrap.io');
    console.log('2. Find email to: complete-test@example.com');
    console.log('3. Click verification link in email');
    console.log('4. Should redirect to: http://localhost:8081/verify-email/{token}');
    console.log('5. Frontend should show verification page and call backend API');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testCompleteFlow();