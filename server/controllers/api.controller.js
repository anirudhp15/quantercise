const config = require("../config/server");

/**
 * API controller for handling general API requests
 */
const apiController = {
  /**
   * Return API information at the root endpoint
   */
  getApiInfo: (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to the Quantercise API",
      description: config.api.description,
      version: config.api.version,
      uptime: process.uptime(),
      environment: config.env,
      timestamp: new Date().toISOString(),
    });
  },
};

module.exports = apiController;
