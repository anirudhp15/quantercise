const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const User = require("../../models/User");
const Plan = require("../../models/Plans");

// Route to create a checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { priceId, userId } = req.body; // Receive the userId and priceId

  try {
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
        metadata: {
          userId, // Attach userId for easier handling in the webhook or verification
        },
        success_url: `${process.env.FRONTEND_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`, // Use environment variable
        cancel_url: `${process.env.FRONTEND_DOMAIN}/plan-selection`, // Use environment variable
      },
      {
        idempotencyKey, // Add idempotency key to prevent duplicate charges
      }
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-checkout-session", async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status === "paid") {
      const subscriptionRecurringDetails =
        session.line_items.data[0].price.recurring;

      // Find the user in the database
      const user = await User.findOne({
        $or: [{ firebaseUid: userId }, { googleId: userId }],
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      }

      // Retrieve the priceId from the session
      const priceId = session.line_items.data[0].price.id;

      // Find the corresponding plan in the database
      const plan = await Plan.findOne({ priceId });
      if (!plan) {
        return res
          .status(400)
          .json({ success: false, error: "Plan not found in database." });
      }

      // Calculate next billing date
      let nextBillingDate = null;
      if (subscriptionRecurringDetails) {
        // Fallback: Calculate next billing date manually
        const interval = subscriptionRecurringDetails.interval; // 'month', 'year', etc.
        const intervalCount = subscriptionRecurringDetails.interval_count; // e.g., 1, 12

        const now = new Date();
        if (interval === "month") {
          now.setMonth(now.getMonth() + intervalCount); // Add months
        } else if (interval === "year") {
          now.setFullYear(now.getFullYear() + intervalCount); // Add years
        }
        // format to be more user-friendly, e.g., "January 1, 2022"
        nextBillingDate = now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Update user's subscription details
      user.isPro = true;
      user.currentPlan = plan._id; // Use the ObjectId from the Plan document
      await user.save();

      // Prepare subscription details for the frontend
      const subscriptionDetails = {
        planName: plan.name,
        nextBillingDate,
        features: plan.features, // Retrieve features from the Plan document
      };

      res.json({ success: true, subscriptionDetails });
    } else {
      res.status(400).json({ success: false, error: "Payment not completed." });
    }
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CANCEL: Cancel user's subscription in Stripe
router.post("/cancel-membership", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required.",
      });
    }

    // Find the user in the database
    const user = await User.findOne({
      $or: [{ _id: userId }, { firebaseUid: userId }, { googleId: userId }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    // Check if the user has an active subscription
    if (!user.subscriptionId) {
      return res.status(400).json({
        success: false,
        error: "No active subscription found.",
      });
    }

    // Generate idempotency key for cancellation
    const cancelIdempotencyKey = `cancel_subscription_${user._id.toString()}_${Date.now()}`;

    // Cancel the subscription at the end of the billing period
    // This allows the user to retain access until the end of their paid time
    const canceledSubscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        cancel_at_period_end: true,
      },
      {
        idempotencyKey: cancelIdempotencyKey,
      }
    );

    // Update the user's database record
    // Set status to canceling but don't remove plan access yet
    user.subscriptionStatus = "canceling";

    // Store the cancellation date for reference
    user.cancellationDetails = {
      canceledAt: new Date(),
      effectiveAt: new Date(canceledSubscription.current_period_end * 1000),
    };

    await user.save();

    // Log the cancellation event
    const subscriptionLog = {
      userId: user._id,
      eventType: "subscription_cancellation_scheduled",
      subscriptionId: user.subscriptionId,
      timestamp: new Date(),
      metadata: {
        effectiveDate: new Date(canceledSubscription.current_period_end * 1000),
      },
    };

    try {
      const SubscriptionLog = require("../../models/SubscriptionLog");
      await new SubscriptionLog(subscriptionLog).save();
    } catch (logError) {
      console.error("Error logging subscription cancellation:", logError);
      // Continue even if logging fails
    }

    res.status(200).json({
      success: true,
      message: "Membership cancellation scheduled successfully.",
      effectiveDate: new Date(canceledSubscription.current_period_end * 1000),
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to cancel subscription.",
    });
  }
});

module.exports = router;
