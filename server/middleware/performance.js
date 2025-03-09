const compression = require("compression");
const morgan = require("morgan");
const config = require("../config/server");

/**
 * Performance middleware collection
 */
const performanceMiddleware = {
  /**
   * Compress all responses
   */
  compression: compression(),

  /**
   * Request logging
   */
  logger: morgan(config.isProduction ? "combined" : "dev"),

  /**
   * Body parser configuration
   */
  bodyParser: {
    json: {
      limit: "10mb",
    },
    urlencoded: {
      extended: true,
      limit: "10mb",
    },
  },
};

module.exports = performanceMiddleware;
