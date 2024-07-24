require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Verify environment variables
if (!process.env.SERVICE_ACCOUNT_PATH) {
  console.error("Missing SERVICE_ACCOUNT_PATH in .env file");
  process.exit(1);
}

if (!process.env.STRIPE_API_KEY) {
  console.error("Missing STRIPE_API_KEY in .env file");
  process.exit(1);
}

if (!process.env.YOUR_DOMAIN) {
  console.error("Missing YOUR_DOMAIN in .env file");
  process.exit(1);
}

// Update the path to your service account key file
const serviceAccountPath = path.join(
  __dirname,
  process.env.SERVICE_ACCOUNT_PATH
);

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("Error loading service account file:", error);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

// Email notification endpoint
app.post("/notify", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  try {
    const emailDoc = db.collection("emails").doc(email);
    const emailSnapshot = await emailDoc.get();

    if (emailSnapshot.exists) {
      await emailDoc.update({
        counter: admin.firestore.FieldValue.increment(1),
      });
      return res.status(200).json({
        success: true,
        message: "We already got you! We'll let you know when we're live.",
      });
    } else {
      await emailDoc.set({ email, counter: 1 });
      return res.status(200).json({
        success: true,
        message: "Thanks, we'll let you know when we're live.",
      });
    }
  } catch (error) {
    console.error("Error storing email:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Stripe checkout session creation
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1PfQac2LYK3gCcnX2jnYp8du",
          quantity: 1,
        },
        {
          price: "price_1PfmdZ2LYK3gCcnX8NT8jDok",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/quantercise/landing`,
      automatic_tax: { enabled: true },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe checkout session verification
app.post("/verify-checkout-session", async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const userDoc = db.collection("users").doc(userId);
      await userDoc.update({ isPro: true });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
