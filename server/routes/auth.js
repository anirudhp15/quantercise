const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  sendResetEmail,
  findOrMergeUser,
} = require("../utils/authUtils");
const User = require("../models/User");

const router = express.Router();

// Forgot password endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = generateToken(user._id, "15m");
      await sendResetEmail(email, resetToken);
    }
    res
      .status(200)
      .json({ message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset password endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error);
    const errorMessage =
      error.name === "TokenExpiredError"
        ? "Reset token has expired"
        : "Internal server error";
    res.status(500).json({ error: errorMessage });
  }
});

// Google and Firebase login
router.post(["/google-login", "/firebase-login"], async (req, res) => {
  try {
    const { uid, email, displayName, profilePicture } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing uid or email" });
    }

    const user = await findOrMergeUser({
      email,
      googleId: req.path.includes("google") ? uid : null,
      firebaseUid: req.path.includes("firebase") ? uid : null,
      displayName,
      profilePicture,
    });

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
});

// User registration
router.post("/register", async (req, res) => {
  const {
    email,
    password,
    displayName,
    firebaseUid,
    googleId,
    session_id,
    profilePicture,
    isPro,
  } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Optional: Validate payment status if session_id is provided
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build the user object dynamically
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: displayName || email.split("@")[0],
      profilePicture: profilePicture || "",
      isPro: !!isPro, // Default to non-pro
      currentPlan: null,
    };

    // Include googleId or firebaseUid only if they are provided
    if (googleId) newUser.googleId = googleId;
    if (firebaseUid) newUser.firebaseUid = firebaseUid;

    // Create and save the user
    user = new User(newUser);
    await user.save();

    // Generate JWT for the user
    const token = generateToken(user._id);

    res
      .status(201)
      .json({ message: "User registered successfully", token, user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { uid, email, displayName, profilePicture } = req.body;

  try {
    const user = await findOrMergeUser({
      email,
      googleId: uid,
      displayName,
      profilePicture,
    });

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
