const Joi = require("joi");

/**
 * Middleware factory for request validation
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};

module.exports = validate;
