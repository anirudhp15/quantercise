/**
 * Middleware to add response formatting helpers to res object
 */
const responseFormatter = (req, res, next) => {
  /**
   * Send a success response
   * @param {*} data - Response data
   * @param {string} message - Success message
   */
  res.sendSuccess = (data, message = "Success") => {
    res.status(200).json({
      status: "success",
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  };

  /**
   * Send an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} errors - Additional error details
   */
  res.sendError = (message, statusCode = 400, errors = null) => {
    const response = {
      status: "error",
      message,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    };

    if (errors) {
      response.errors = errors;
    }

    res.status(statusCode).json(response);
  };

  next();
};

module.exports = responseFormatter;
