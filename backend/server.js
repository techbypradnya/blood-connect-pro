const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middlewares/errorHandler");
const rateLimiter = require("./src/middlewares/rateLimiter");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(rateLimiter);

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/donors", require("./src/routes/donorRoutes"));
app.use("/api/requests", require("./src/routes/requestRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
