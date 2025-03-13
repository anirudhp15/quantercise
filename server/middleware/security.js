const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("../config/server");

/**
 * Security middleware collection
 */
const securityMiddleware = {
  /**
   * Configure CORS settings
   */
  cors: cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (config.allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),

  /**
   * Set security headers with helmet
   */
  helmet: helmet({
    contentSecurityPolicy: false, // Adjust based on your needs
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),

  /**
   * API rate limiting
   */
  rateLimiter: rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  }),

  /**
   * 404 handler for undefined routes
   */
  notFound: (req, res) => {
    res.status(404).json({
      status: "error",
      message: `Route ${req.originalUrl} not found`,
    });
  },

  /**
   * Global error handler middleware
   */
  errorHandler: (err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "error",
      message: config.isProduction ? "Internal server error" : err.message,
      ...(config.isProduction ? {} : { stack: err.stack }),
    });
  },
};

module.exports = securityMiddleware;
