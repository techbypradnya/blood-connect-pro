# 🩸 Blood Connect Pro — Backend API

## Tech Stack
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JWT** Authentication
- **bcryptjs** for password hashing
- **Helmet**, **CORS**, **Rate Limiting** for security
- **express-validator** for input validation

## Folder Structure
```
backend/
├── server.js                  # Entry point
├── .env.example               # Environment variables template
├── package.json
├── Blood-Connect-Pro.postman_collection.json
└── src/
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── donorController.js
    │   ├── requestController.js
    │   └── userController.js
    ├── middlewares/
    │   ├── auth.js            # JWT protect & role authorize
    │   ├── errorHandler.js    # Centralized error handler
    │   ├── rateLimiter.js
    │   └── validate.js        # express-validator middleware
    ├── models/
    │   ├── BloodRequest.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── donorRoutes.js
    │   ├── requestRoutes.js
    │   └── userRoutes.js
    └── utils/
        └── generateToken.js
```

## Setup & Run

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start MongoDB (if local)
mongod

# 5. Run the server
npm run dev     # development (with nodemon)
npm start       # production
```

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/donors` | Public | List available donors |
| GET | `/api/donors/search` | Public | Search donors by blood group/city/state |
| PUT | `/api/donors/availability` | Private | Toggle donor availability |
| POST | `/api/requests` | Private | Create blood request |
| GET | `/api/requests` | Public | List all requests |
| PUT | `/api/requests/:id` | Private | Update/accept request |
| DELETE | `/api/requests/:id` | Private | Delete request |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Private | Get user details |
| PUT | `/api/users/:id` | Private | Update user profile |
| DELETE | `/api/users/:id` | Private | Delete user |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/health` | Public | Health check |

## Postman Collection

Import `Blood-Connect-Pro.postman_collection.json` into Postman. After login, the token is auto-saved to collection variables.

## Future Enhancements
- Real-time notifications (Socket.io)
- SMS integration (Twilio)
- Email verification (Nodemailer)
- Blood donation history tracking
- Password reset flow
