# Email Verification System Implementation

## Overview

A complete email verification system has been implemented for the Blood Connect Pro backend using nodemailer and Mailtrap. Users must verify their email address before they can log in to the application.

## Features Implemented

### 1. **User Model Updates**
   - Added `isVerified` field (default: false)
   - Added `verificationToken` field (stores hashed token)
   - Added `verificationTokenExpire` field (24-hour expiration)
   - Added `getEmailVerificationToken()` method to generate secure tokens

### 2. **Email Service** (`src/services/emailService.js`)
   - Reusable nodemailer transporter using Mailtrap SMTP
   - `sendVerificationEmail()` - Sends beautiful HTML verification emails
   - `sendPasswordResetEmail()` - Updated to use Mailtrap
   - `sendEmail()` - Generic email function for custom emails
   - All emails are professionally formatted with HTML templates

### 3. **Authentication Controller Updates**

   **Register Endpoint** (`POST /api/auth/register`)
   - Generates verification token during registration
   - Sends verification email to user
   - User receives email with verification link
   - Returns message asking user to check email

   **Verify Email Endpoint** (`GET /api/auth/verify-email?token=<token>`)
   - Validates the verification token
   - Checks token expiration (24 hours)
   - Sets `isVerified = true` when successful
   - Removes verification token
   - User can now proceed to login

   **Login Endpoint** (`POST /api/auth/login`)
   - Added email verification check
   - Returns 403 error if email not verified
   - Provides user-friendly message directing to email verification

   **Forgot Password** (`POST /api/auth/forgot-password`)
   - Updated to use new emailService
   - Sends password reset email via Mailtrap

### 4. **Routes**
   - `GET /api/auth/verify-email?token=<token>` - Verify email from link click

## Database Schema

```javascript
{
  // Email verification fields
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpire: Date,
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Create .env File
Copy `.env.example` to `.env` and configure Mailtrap credentials:

```env
# Mailtrap SMTP Configuration
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_username_from_mailtrap
MAILTRAP_PASS=your_password_from_mailtrap

# Email Configuration
FROM_EMAIL=noreply@bloodconnectpro.com
FROM_NAME=Blood Connect Pro

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 3. Get Mailtrap Credentials
1. Visit https://mailtrap.io
2. Sign up for a free account
3. Create a new inbox (or use default)
4. Go to "Integrations" tab
5. Select "Nodemailer"
6. Copy the credentials to `.env`

## API Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123",
  "role": "donor",
  "bloodGroup": "O+",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

**Response (Success)**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

### Verify Email
User receives email with link: `http://localhost:5000/api/auth/verify-email?token=<token>`

Or manually:
```http
GET /api/auth/verify-email?token=eyJhbGciOi...
```

**Response (Success)**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now log in."
}
```

**Response (Invalid/Expired Token)**
```json
{
  "success": false,
  "message": "Invalid or expired verification token. Please register again."
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (Email Not Verified)**
```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your inbox for the verification link."
}
```

**Response (Success - After Email Verification)**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

## Error Handling

### Registration Errors
- **Email Already Registered** - 400: "Email already registered"
- **Validation Errors** - 422: Field-specific validation errors
- **Email Send Failed** - 500: "Failed to send verification email. Please try again."

### Verification Errors
- **Missing Token** - 400: "Verification token is required"
- **Invalid Token** - 400: "Invalid or expired verification token. Please register again."
- **Expired Token** - 400: "Invalid or expired verification token. Please register again."

### Login Errors
- **Email Not Verified** - 403: "Please verify your email before logging in..."
- **Invalid Credentials** - 401: "Invalid credentials"

## Security Features

1. **Secure Token Generation** - Uses crypto.randomBytes(32) for secure tokens
2. **Token Hashing** - Tokens are SHA256 hashed before storage in database
3. **Token Expiration** - Tokens expire after 24 hours
4. **Email Domain Validation** - Email format validation in all endpoints
5. **Password Security** - Passwords hashed with bcryptjs (salt rounds: 12)
6. **Rate Limiting** - Global rate limiter on all API routes
7. **CORS Protection** - CORS middleware enabled
8. **Helmet Security** - Security headers enabled

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── User.js ✅ (Updated with email verification fields)
│   ├── controllers/
│   │   └── authController.js ✅ (Updated with verifyEmail, register, login)
│   ├── routes/
│   │   └── authRoutes.js ✅ (Added verify-email route)
│   ├── services/
│   │   └── emailService.js ✅ (New - Email sending service)
│   └── middlewares/
│       └── auth.js (protect middleware unchanged)
├── .env.example ✅ (New - Environment variables guide)
└── package.json (Updated with nodemailer)
```

## Testing

### Using Postman

1. **Test Registration**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "fullName": "Test User",
       "email": "testuser@example.com",
       "phone": "+919876543210",
       "password": "TestPass123",
       "role": "donor",
       "bloodGroup": "O+",
       "city": "Mumbai",
       "state": "Maharashtra"
     }
     ```

2. **Check Mailtrap Inbox**
   - Log in to mailtrap.io
   - Check the inbox for the verification email
   - Copy the verification link from the email

3. **Test Email Verification**
   - Method: GET
   - URL: Paste the verification link from email
   - Example: `http://localhost:5000/api/auth/verify-email?token=<token>`

4. **Test Login**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "testuser@example.com",
       "password": "TestPass123"
     }
     ```

## Production Checklist

- [ ] Add Mailtrap credentials to production .env
- [ ] Update BACKEND_URL to production URL
- [ ] Update FRONTEND_URL to production URL
- [ ] Test email verification flow end-to-end
- [ ] Monitor email delivery logs in Mailtrap
- [ ] Consider email templating engine for complex emails (optional)
- [ ] Set up email rate limiting for password reset
- [ ] Add email resend functionality (optional)
- [ ] Implement admin email notification system (optional)

## Future Enhancements

1. **Email Resend** - Allow users to resend verification email
2. **SMS Verification** - Add SMS option via Twilio
3. **Social Login** - Add Google/GitHub OAuth (auto-verify emails)
4. **Email Templates** - Use Handlebars or EJS for complex templates
5. **Admin Dashboard** - View verification statistics
6. **Bulk Email** - Send announcements to verified users

## Troubleshooting

### Emails Not Sending
- [ ] Check Mailtrap credentials in .env
- [ ] Verify SMTP_HOST and SMTP_PORT values
- [ ] Check backend logs for error messages
- [ ] Try sending test email directly from Mailtrap dashboard

### Verification Link Not Working
- [ ] Ensure BACKEND_URL is correctly set in .env
- [ ] Token should not be expired (24 hours)
- [ ] Check database for verificationToken field
- [ ] Verify token is being hashed correctly

### Users Can't Log In
- [ ] Check if isVerified field is true in database
- [ ] Verify email was actually verified using /verify-email endpoint
- [ ] Check password is correct (case-sensitive)
- [ ] Look for error messages in backend logs

## Code Quality

All code follows:
- ✅ Clean MVC architecture
- ✅ Error handling with try-catch
- ✅ Security best practices
- ✅ Input validation with express-validator
- ✅ Async/await patterns
- ✅ Proper HTTP status codes
- ✅ Meaningful error messages
- ✅ Comments for clarity

## Dependencies

- **nodemailer** - Email sending library
- **crypto** - Built-in Node.js for token generation
- **express-validator** - Already installed (input validation)
- **mongoose** - Already installed (database)
- **bcryptjs** - Already installed (password hashing)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Mailtrap documentation: https://mailtrap.io/
3. Check nodemailer docs: https://nodemailer.com/
4. Review backend logs for error details
