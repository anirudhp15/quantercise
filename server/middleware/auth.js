const admin = require("firebase-admin");
const User = require("../models/User");

/**
 * Authentication middleware
 * Verifies the Firebase ID token in the request header and attaches the user to the request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Add user from Firebase to request
      req.user = decodedToken;

      // Optionally fetch the full user from your database
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (user) {
        req.dbUser = user;
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Token is not valid" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
