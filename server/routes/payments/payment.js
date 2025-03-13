const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Plans = require("../../models/Plans");
const { createStripeCheckoutSession } = require("../../utils/authUtils");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const mongoose = require("mongoose");

// Fetch available plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plans.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans", error });
  }
});

// Fetch specific plan by ID
router.get("/plans/:planId", async (req, res) => {
  const { planId } = req.params;

  try {
    const plan = await Plans.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ message: "Failed to fetch plan", error });
  }
});

// Subscribe user to a plan
router.post("/plans/subscribe", async (req, res) => {
  const { userId, planId } = req.body;

  try {
    // If planId is "free-plan-price-id", subscribe to the free plan
    if (planId === "free-plan-id") {
      await User.findByIdAndUpdate(userId, {
        currentPlan: null,
        isPro: null,
        registrationStep: "complete",
      });
      return res.status(200).json({ message: "Subscribed to free plan" });
    }

    // Otherwise, find the specified paid plan
    const plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.findByIdAndUpdate(userId, {
      currentPlan: plan._id,
      isPro: plan.name.toLowerCase().includes("pro"),
      registrationStep: "complete",
    });

    res.status(200).json({ message: "Subscription successful", plan });
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe to plan", error });
  }
});

router.post("/plans/select", async (req, res) => {
  const { userId, planId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let checkoutUrl = null;

    if (planId !== "free-plan-id") {
      const plan = await Plans.findById(planId);
      if (!plan) return res.status(404).json({ message: "Plan not found" });

      if (plan.price > 0) {
        try {
          // Ensure plan.priceId exists before creating checkout session
          if (!plan.priceId) {
            return res.status(400).json({
              message: "Invalid plan configuration: missing priceId",
            });
          }

          // Paid plan: create Stripe checkout session
          checkoutUrl = await createStripeCheckoutSession(plan.priceId, userId);

          // Don't update user plan here - wait for webhook confirmation
          // Plan updates will be handled in the webhook handler
        } catch (stripeError) {
          console.error("Stripe checkout session error:", stripeError);
          return res.status(500).json({
            message: "Failed to create checkout session",
            error: stripeError.message,
          });
        }
      } else {
        // Free paid plan (price is 0)
        user.currentPlan = plan._id;
        user.isPro = plan.name.toLowerCase().includes("pro");
        user.registrationStep = "complete";
        await user.save();
      }
    } else {
      // Free plan: clear currentPlan and set isPro to false
      user.currentPlan = null;
      user.isPro = null;
      user.registrationStep = "complete";
      await user.save();
    }

    // Return the Stripe checkout URL if applicable
    res
      .status(200)
      .json({ message: "Plan selected successfully", checkoutUrl });
  } catch (error) {
    console.error("Error selecting plan:", error);
    res
      .status(500)
      .json({ message: "Failed to select plan", error: error.message });
  }
});

router.get("/current", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  res.status(200).json(user);
});

// CANCEL: Cancel user's subscription in Stripe
router.post("/cancel-membership", async (req, res) => {
  const { userId, email } = req.body;

  try {
    // Check if we have at least one identifier
    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        error: "User ID or email is required.",
      });
    }

    // Create a query condition for finding the user
    const query = { $or: [] };

    // Add all possible ways to find the user
    if (userId) {
      // Only include _id if it's a valid MongoDB ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
      if (isValidObjectId) {
        query.$or.push({ _id: userId });
      }

      // Always include Firebase UID and Google ID
      query.$or.push({ firebaseUid: userId });
      query.$or.push({ googleId: userId });
    }

    // Add email to the query if provided
    if (email) {
      query.$or.push({ email: email });
    }

    console.log("Searching for user with query:", JSON.stringify(query));

    // Find the user in the database
    const user = await User.findOne(query);

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

// Backward compatibility: Redirect old /cancel requests to /cancel-membership functionality
router.post("/cancel", async (req, res) => {
  try {
    // Extract user ID from authenticated user if available
    const userId =
      req.user?.uid ||
      req.user?._id ||
      req.body.userId ||
      (req.body.currentUser && req.body.currentUser.uid);
    const email =
      req.body.email || (req.body.currentUser && req.body.currentUser.email);

    // Check if we have at least one identifier
    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        error: "User ID or email is required. Please log in and try again.",
      });
    }

    // Create a query condition for finding the user
    const query = { $or: [] };

    // Add all possible ways to find the user
    if (userId) {
      // Only include _id if it's a valid MongoDB ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
      if (isValidObjectId) {
        query.$or.push({ _id: userId });
      }

      // Always include Firebase UID and Google ID
      query.$or.push({ firebaseUid: userId });
      query.$or.push({ googleId: userId });
    }

    // Add email to the query if provided
    if (email) {
      query.$or.push({ email: email });
    }

    console.log("Searching for user with query:", JSON.stringify(query));

    // Find the user in the database
    const user = await User.findOne(query);

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
    const cancelIdempotencyKey = `cancel_subscription_backward_${user._id.toString()}_${Date.now()}`;

    // Cancel the subscription at the end of the billing period
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
    user.subscriptionStatus = "canceling";

    // Store the cancellation date for reference
    user.cancellationDetails = {
      canceledAt: new Date(),
      effectiveAt: new Date(canceledSubscription.current_period_end * 1000),
    };

    await user.save();

    // Log the cancellation event
    try {
      const SubscriptionLog = require("../../models/SubscriptionLog");
      await new SubscriptionLog({
        userId: user._id,
        eventType: "subscription_cancellation_scheduled",
        subscriptionId: user.subscriptionId,
        timestamp: new Date(),
        metadata: {
          effectiveDate: new Date(
            canceledSubscription.current_period_end * 1000
          ),
        },
      }).save();
    } catch (logError) {
      console.error("Error logging subscription cancellation:", logError);
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
