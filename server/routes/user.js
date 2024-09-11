const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

// CREATE: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName, profilePicture } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      email,
      password,
      displayName,
      profilePicture,
      signInCount: 0,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
});

// READ: Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id);
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id);
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

// UPDATE: Update progress for one or more questions
router.post("/update-progress", async (req, res) => {
  try {
    const { userId, progressUpdates } = req.body;

    // Validate the input
    if (!userId || !progressUpdates || !Array.isArray(progressUpdates)) {
      return res
        .status(400)
        .json({ message: "Missing required fields or invalid data" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Loop through progress updates and apply them
    for (const update of progressUpdates) {
      const { questionId, progress } = update;

      let questionProgress = user.progress.find(
        (p) => p.questionId.toString() === questionId
      );

      if (questionProgress) {
        // Update existing progress
        questionProgress.completed =
          progress.completed ?? questionProgress.completed;
        questionProgress.correct = progress.correct ?? questionProgress.correct;
        questionProgress.attempts =
          progress.attempts ?? questionProgress.attempts;
        questionProgress.timeSpent =
          (questionProgress.timeSpent || 0) + (progress.timeSpent || 0);
        questionProgress.lastAttempted = Date.now();
      } else {
        // If the question hasn't been worked on, initialize the fields
        const initialProgress = {
          questionId,
          completed: progress.completed || false,
          correct: progress.correct || null,
          attempts: progress.attempts || 0,
          timeSpent: progress.timeSpent || 0,
          lastAttempted: Date.now(),
        };
        // Add new progress entry
        user.progress.push(initialProgress);
      }
    }

    // Save the updated user document
    await user.save();
    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// READ: Get user progress for all questions or specific questions
router.get("/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionIds } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find the user by ID and select the progress field
    const user = await User.findById(userId).select("progress");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter progress if specific questionIds are provided
    let progress = user.progress;
    if (questionIds) {
      const questionIdsArray = Array.isArray(questionIds)
        ? questionIds
        : [questionIds];
      progress = progress.filter((p) =>
        questionIdsArray.includes(p.questionId.toString())
      );
    }

    res.json({ progress });
  } catch (error) {
    console.error("Error fetching user progress:", error);
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

// UPDATE: Update Pro status
router.post("/update-pro-status", async (req, res) => {
  try {
    const { userId, isPro } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPro = isPro;
    await user.save();

    res.status(200).json({ message: "Pro status updated successfully", user });
  } catch (error) {
    console.error("Error updating Pro status:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Increment user's sign-in count based on their mongoId
router.put("/:id/signin", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the mongoId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find the user by mongoId and increment the signInCount
    const user = await User.findByIdAndUpdate(
      id,
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

module.exports = router;
