const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

// READ: Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      $or: [{ firebaseUid: id }, { googleId: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Update user information
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, profilePicture, email } = req.body;

    const user = await User.findOne({
      $or: [{ firebaseUid: id }, { googleId: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (displayName) user.displayName = displayName;
    if (profilePicture) user.profilePicture = profilePicture;
    user.updatedAt = Date.now();

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Get the MongoDB ID based on firebaseUid or googleId
router.get("/mongoId/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Try finding the user by firebaseUid or googleId
    const user = await User.findOne({
      $or: [{ firebaseUid: id }, { googleId: id }],
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({ mongoId: user._id });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server error");
  }
});

// UPDATE: Increment user's sign-in count based on their firebaseUid or googleId
router.put("/:uid/signin", async (req, res) => {
  try {
    const { uid } = req.params;

    // Find the user by mongoId and increment the signInCount
    const user = await User.findOneAndUpdate(
      { $or: [{ firebaseUid: uid }, { googleId: uid }] },
      { $inc: { signInCount: 1 } }, // Increment the signInCount by 1
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Sign-in count incremented successfully", user });
  } catch (error) {
    console.error("Error incrementing sign-in count:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Update user's profile color based on their UID
router.put("/:uid/update-color", async (req, res) => {
  try {
    const { uid } = req.params;
    const { profileColor } = req.body;

    // Validate the color format (example for hex)
    const isValidColor = /^#[0-9A-F]{6}$/i.test(profileColor);
    if (!isValidColor) {
      return res.status(400).json({ message: "Invalid color format" });
    }

    // Find user by firebaseUid or googleId
    const user = await User.findOne({
      $or: [{ firebaseUid: uid }, { googleId: uid }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the profile color
    user.profileColor = profileColor;
    await user.save();

    res.json({ message: "Profile color updated successfully", user });
  } catch (error) {
    console.error("Error updating profile color:", error);
    res.status(500).json({ error: error.message });
  }
});

// Backend route to update the registration step
router.put("/:mongoId/registration-step", async (req, res) => {
  const { mongoId } = req.params;
  const { registrationStep } = req.body;

  if (!["auth", "mongo", "plan", "complete"].includes(registrationStep)) {
    return res.status(400).json({ error: "Invalid registration step." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      mongoId,
      { registrationStep },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Registration step updated.", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update registration step." });
  }
});

// Backend route to update the user's current plan linking it to Plan model
router.put("/:mongoId/current-plan", async (req, res) => {
  const { mongoId } = req.params;
  const { currentPlan } = req.body;

  try {
    const user = await User.findById(mongoId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.currentPlan = currentPlan;
    await user.save();

    res.status(200).json({ message: "Current plan updated.", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update current plan." });
  }
});

// CANCEL: Cancel user's membership
router.post("/:mongoId/cancel-membership", async (req, res) => {
  const { mongoId } = req.params;

  try {
    // Find the user by their Firebase UID or Google ID
    const user = await User.findById(mongoId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has an active Stripe subscription
    if (!user.subscriptionId) {
      return res
        .status(400)
        .json({ message: "No active subscription found for this user." });
    }

    // Cancel the subscription in Stripe with a fair approach
    const canceledSubscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        cancel_at_period_end: true, // Allows the user to retain benefits until the end of the billing cycle
      }
    );

    // Update user fields to reflect cancellation but maintain active benefits until the period ends
    user.currentPlan = null; // Reset to free plan
    user.isPro = null; // Set to free status
    user.updatedAt = Date.now(); // Update the last modified timestamp

    // Retain subscriptionId until the end of the billing cycle
    await user.save();

    res.status(200).json({
      message:
        "Membership cancellation scheduled. You will retain benefits until the end of your billing period.",
      canceledSubscription,
    });
  } catch (error) {
    console.error("Error canceling membership:", error);
    res.status(500).json({ error: "Failed to cancel membership." });
  }
});

module.exports = router;
