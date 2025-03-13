require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

const FRONTEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise.com"
    : "http://localhost:3000";

// JWT token generation
const generateToken = (userId, expiresIn = "1h") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

// Email sending function
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${BACKEND_DOMAIN}/reset-password?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

// Find or merge user helper function
const findOrMergeUser = async ({
  email,
  googleId = null,
  firebaseUid = null,
  displayName,
  profilePicture,
  isPro = false,
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    // Create a new user if no user exists with this email
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
    // Merge Google/Firebase credentials into existing user account if not already present
    if (googleId && !user.googleId) user.googleId = googleId;
    if (firebaseUid && !user.firebaseUid) user.firebaseUid = firebaseUid;

    user.signInCount += 1;
    user.lastLogin = Date.now();
    user.updatedAt = Date.now();
  }

  await user.save();
  return user;
};

async function createStripeCheckoutSession(priceId, userId) {
  // Generate a unique idempotency key using userId and timestamp
  const idempotencyKey = `checkout_${
    userId || "anonymous"
  }_${priceId}_${Date.now()}`;

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: { userId },
      success_url: `${FRONTEND_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_DOMAIN}/plan-selection`,
    },
    {
      idempotencyKey, // Add idempotency key to prevent duplicate charges
    }
  );

  return session.url;
}

module.exports = {
  generateToken,
  sendResetEmail,
  findOrMergeUser,
  createStripeCheckoutSession,
};
