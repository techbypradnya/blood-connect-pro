/**
 * TEST SCRIPT: Registration Endpoint
 * Tests the email verification flow
 */

const axios = require('axios');

async function testRegistration() {
  try {
    console.log('\n========== TESTING REGISTRATION ==========\n');

    const testData = {
      fullName: "Test User 2",
      email: "test2@example.com",
      phone: "+919876543211",
      password: "TestPass123",
      role: "donor",
      bloodGroup: "O+",
      city: "Mumbai",
      state: "Maharashtra"
    };

    console.log('📝 Sending registration request...');
    console.log('Data:', testData);

    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Registration successful!');
    console.log('Response:', response.data);

    if (response.data.success) {
      console.log('\n📧 Check your Mailtrap inbox for the verification email!');
      console.log('   Login at: https://mailtrap.io');
    }

  } catch (error) {
    console.error('\n❌ Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();