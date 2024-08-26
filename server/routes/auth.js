const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Helper function to find or create a user
const findOrCreateUser = async ({
  email,
  googleId = null, // Provide default value
  firebaseUid = null, // Provide default value
  displayName,
  profilePicture,
  isPro = false,
}) => {
  let user;

  console.log("Finding or creating user...");

  if (googleId) {
    console.log(`Looking for user with googleId: ${googleId}`);
    user = await User.findOne({ googleId });
  } else if (firebaseUid) {
    console.log(`Looking for user with firebaseUid: ${firebaseUid}`);
    user = await User.findOne({ firebaseUid });
  } else {
    console.log(`Looking for user with email: ${email}`);
    user = await User.findOne({ email });
  }

  if (!user) {
    console.log("User not found, creating a new user.");
    user = new User({
      email,
      googleId,
      firebaseUid,
      displayName,
      profilePicture,
      signInCount: 1,
      isPro,
      lastLogin: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  } else {
    console.log("User found, updating user details.");
    user.signInCount += 1;
    user.lastLogin = Date.now();
    user.updatedAt = Date.now();

    if (googleId && !user.googleId) user.googleId = googleId;
    if (firebaseUid && !user.firebaseUid) user.firebaseUid = firebaseUid;
    if (displayName && !user.displayName) user.displayName = displayName;
    if (profilePicture && !user.profilePicture)
      user.profilePicture = profilePicture;
  }

  await user.save();
  console.log("User saved:", user);
  return user;
};

// Google sign-in
router.post("/google-login", async (req, res) => {
  console.log("Received request to /google-login with data:", req.body);

  try {
    const { uid, email, displayName, profilePicture } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing uid or email" });
    }

    // Use the uid as googleId and handle the user creation or update
    const user = await findOrCreateUser({
      email,
      googleId: uid, // Treat the uid from Google as googleId in your database
      displayName,
      profilePicture,
    });

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
    console.log("User login recorded successfully for user:", user);
  } catch (error) {
    console.error("Error updating Google login in MongoDB", error);
    res.status(500).json({ error: error.message });
  }
});

// Firebase login
router.post("/firebase-login", async (req, res) => {
  console.log("Received request to /firebase-login with data:", req.body);

  try {
    const { uid, email, displayName, profilePicture } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing uid or email" });
    }

    const user = await findOrCreateUser({
      email,
      firebaseUid: uid,
      displayName,
      profilePicture,
    });
    const token = generateToken(user._id);
    res.status(200).json({ token, user });
    console.log("User login recorded successfully for user:", user);
  } catch (error) {
    console.error("Error updating user login in MongoDB:", error);
    res.status(500).json({ error: error.message });
  }
});

// User registration (traditional email/password registration)
router.post("/register", async (req, res) => {
  const { email, password, session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ error: "Invalid session or payment not completed" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user and set isPro to true
    const newUser = new User({
      email,
      password, // You should hash the password before saving
      isPro: true,
    });

    await newUser.save();

    // Log the user in (implement session or token-based login)
    req.session.userId = newUser._id;

    // Redirect to home page
    res.redirect("/home");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
});

// User login (traditional email/password login)
router.post("/login", async (req, res) => {
  try {
    const { uid, email, displayName, profilePicture } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing uid or email" });
    }

    const user = await findOrCreateUser({
      email,
      firebaseUid: uid,
      displayName,
      profilePicture,
    });
    const token = generateToken(user._id);
    res.status(200).json({ token, user });
    console.log("User login recorded successfully for user:", user);
  } catch (error) {
    console.error("Error updating user login in MongoDB:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
