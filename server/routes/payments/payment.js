const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Plans = require("../../models/Plans");

// Fetch available plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plans.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans", error });
  }
});

// Subscribe user to a plan
router.post("/plans/subscribe", async (req, res) => {
  const { userId, planId } = req.body;

  try {
    const plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.findByIdAndUpdate(userId, {
      currentPlan: plan._id,
      isPro: plan.name.toLowerCase() !== "free", // Automatically set isPro
    });

    res.status(200).json({ message: "Subscription successful", plan });
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe to plan", error });
  }
});

module.exports = router;
