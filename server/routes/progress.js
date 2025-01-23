const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get user's progress
router.get("/:userId/progress", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("progress.questionId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ progress: user.progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update progress for a question
router.post("/:userId/update-progress", async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionId, completed, correct, timeSpent } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the progress entry for the question or create one
    let progress = user.progress.find(
      (p) => p.questionId.toString() === questionId
    );

    if (progress) {
      progress.completed = completed || progress.completed;
      progress.correct = correct !== undefined ? correct : progress.correct;
      progress.timeSpent += timeSpent || 0;
      progress.attempts += 1;
      progress.lastAttempted = Date.now();
    } else {
      user.progress.push({
        questionId,
        completed,
        correct,
        timeSpent,
        attempts: 1,
        lastAttempted: Date.now(),
      });
    }

    await user.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
