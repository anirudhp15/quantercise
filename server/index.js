require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const path = require("path");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://quantercise.com",
  "https://anirudhp15.github.io/quantercise",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

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
      success_url: `${process.env.YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/quantercise/landing`,
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
// const PORT = process.env.PORT || 4242;
// app.listen(PORT, () => console.log(`Running on port ${PORT}`));
