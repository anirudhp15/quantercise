require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const path = require("path");
const { all } = require("axios");

const app = express();

app.get("/api", (req, res) => {
  res.send("Hello from Express!");
});

const allowedOrigins = {
  origin: "http://localhost:3000",
};

app.use(cors(allowedOrigins));

app.use(express.static(path.join(__dirname, "../build"))); // Use __dirname with path.join
app.use(express.json());
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

app.get("/api", (req, res) => {
  res.send("Hello from Express!");
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

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "quantercise@gmail.com", // The recipient email address
    subject: "New Email Subscriber",
    text: `Email: ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({
        success: true,
        message: "Thanks, we'll let you know when we're live.",
      });
    }
  });
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
