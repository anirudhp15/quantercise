const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../models/User");

// Route to create a checkout session
router.post("/create-checkout-session", async (req, res) => {
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
      success_url: `${process.env.BACKEND_DOMAIN}/verify-checkout-session?session_id=${CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/landing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to verify a checkout session
router.get("/verify-checkout-session", async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Assume the session contains metadata with user ID or email
      const userEmail = session.customer_email;

      const user = await User.findOne({ email: userEmail });

      if (!user) {
        // Redirect to registration page
        res.redirect(`${process.env.DOMAIN}/register?session_id=${session_id}`);
      } else {
        // Update the user's account to isPro: true
        user.isPro = true;
        await user.save();

        // Redirect to homepage
        res.redirect(`${process.env.DOMAIN}/home`);
      }
    } else {
      res.redirect(`${process.env.DOMAIN}/landing`);
    }
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
