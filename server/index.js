require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const questionsRoutes = require("./routes/questions");
const applicationsRoute = require("./routes/applications");
const User = require("./models/User");

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://quantercise.com",
  "https://quantercise-api.vercel.app",
  "https://anirudhp15.github.io/quantercise",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // Automatically includes body-parser for JSON

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Check if the users collection exists and print the documents
    const collections = await mongoose.connection.db.collections();
    const collectionNames = collections.map((col) => col.collectionName);

    if (collectionNames.includes("users")) {
      const users = await mongoose.connection.db
        .collection("users")
        .find({})
        .toArray();
      console.log(
        "Users collection found. Documents in users collection:",
        users
      );
    } else {
      console.log("Users collection does not exist.");
    }
  })
  .catch((err) => console.error("Connection error:", err));

// Use routes
app.use("/api/auth", authRoutes); // Handles /firebase-login and /google-login
app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/applications", applicationsRoute);
// Stripe checkout session creation
app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.YOUR_DOMAIN}/verify-checkout-session?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/landing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe checkout session verification
app.get("/verify-checkout-session", async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Assume the session contains metadata with user ID or email
      const userEmail = session.customer_email;

      const user = await User.findOne({ email: userEmail });

      if (!user) {
        // Redirect to registration page
        res.redirect(`/register?session_id=${session_id}`);
      } else {
        // Update the user's account to isPro: true
        user.isPro = true;
        await user.save();

        // Redirect to homepage
        res.redirect("/home");
      }
    } else {
      res.redirect("/landing");
    }
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
