// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MailerLite = require("@mailerlite/mailerlite-nodejs").default;
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // Development origin
  "http://localhost:4242", // Development origin
  "https://quantercise.com", // Production origin
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;
const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

const mailerlite = new MailerLite({
  api_key: MAILERLITE_API_KEY,
});

// Email notification endpoint
app.post("/notify", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    console.error("Invalid email address:", email);
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  try {
    const subscriberData = {
      email: email,
      groups: [MAILERLITE_GROUP_ID],
      status: "active",
    };

    const response = await mailerlite.subscribers.createOrUpdate(
      subscriberData
    );
    console.log(response.data);

    if (response.data) {
      return res.status(200).json({
        success: true,
        message: "Thanks, we'll let you know when we're live.",
      });
    } else {
      throw new Error("Failed to add email to MailerLite");
    }
  } catch (error) {
    console.error(
      "Error storing email:",
      error.response ? error.response.data : error.message
    );
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
      // Update user to pro in your database
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
