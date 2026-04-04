const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const campaignRoutes = require("./routes/campaigns");
const aiRoutes = require("./routes/ai");
const userRoutes = require("./routes/users");
// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
// TODO: Update CORS_ORIGIN in .env to match your frontend URL
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// Stricter rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute
  message: {
    success: false,
    message: "AI rate limit exceeded. Please try again later.",
  },
});
app.use("/api/ai", aiLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle specific error types
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
    });
  }

  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   AdAgency Pro Backend Server                              ║
║                                                            ║
║   Server running on port ${PORT}                            ║
║   Environment: ${(process.env.NODE_ENV || "development").padEnd(20)}              ║
║                                                            ║
║   API Endpoints:                                           ║
║   • Health:    http://localhost:${PORT}/health                      ║
║   • Auth:      http://localhost:${PORT}/api/auth                    ║
║   • Campaigns: http://localhost:${PORT}/api/campaigns               ║
║   • AI:        http://localhost:${PORT}/api/ai                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
