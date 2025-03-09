/**
 * Server configuration variables
 */
const config = {
  port: process.env.PORT || 4242,
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // CORS origins configuration
  allowedOrigins:
    process.env.NODE_ENV === "production"
      ? [
          "https://quantercise.com",
          "https://www.quantercise.com",
          "https://quantercise-api.vercel.app",
        ]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://quantercise.com",
          "https://quantercise-api.vercel.app",
          "https://anirudhp15.github.io/quantercise",
        ],

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.NODE_ENV === "production" ? 100 : 1000,
  },

  // API info
  api: {
    version: "1.0.0",
    description:
      "Quantercise is your platform for mastering quant finance skills and tracking progress.",
  },
};

module.exports = config;
