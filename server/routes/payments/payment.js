const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Plans = require("../../models/Plans");
const { createStripeCheckoutSession } = require("../../utils/authUtils");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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
        // Paid plan: create Stripe checkout session
        checkoutUrl = await createStripeCheckoutSession(plan.priceId, userId);
      }

      // Update user with selected paid plan
      user.currentPlan = plan._id;
      user.isPro = plan.name.toLowerCase().includes("pro");
      user.registrationStep = "complete";
    } else {
      // Free plan: clear currentPlan and set isPro to false
      user.currentPlan = null;
      user.isPro = null;
      user.registrationStep = "complete";
    }

    await user.save();

    // Return the Stripe checkout URL if applicable
    res
      .status(200)
      .json({ message: "Plan selected successfully", checkoutUrl });
  } catch (error) {
    console.error("Error selecting plan:", error);
    res.status(500).json({ message: "Failed to select plan", error });
  }
});

router.get("/current", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  res.status(200).json(user);
});

module.exports = router;
