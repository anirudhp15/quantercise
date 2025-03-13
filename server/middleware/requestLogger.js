const { v4: uuidv4 } = require("uuid");

/**
 * Middleware to add request ID and log request details
 */
const requestLogger = (req, res, next) => {
  // Add unique request ID
  req.id = uuidv4();

  // Record start time
  const start = Date.now();

  // Log request completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    };

    // Add user ID if authenticated
    if (req.user) {
      log.userId = req.user._id;
    }

    console.log(JSON.stringify(log));
  });

  next();
};

module.exports = requestLogger;
