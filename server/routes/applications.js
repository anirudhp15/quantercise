const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST - Add new application to user
router.post("/add-application", async (req, res) => {
  const { email, application } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.applications.push(application);
    await user.save();
    res
      .status(200)
      .json({ message: "Application saved", applications: user.applications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET - Get user applications
router.get("/user-applications/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ applications: user.applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Edit existing application
router.post("/edit-application", async (req, res) => {
  const { email, applicationId, updatedFields } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application to edit
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update only the fields that were changed
    for (const [key, value] of Object.entries(updatedFields)) {
      user.applications[appIndex][key] = value;
    }

    await user.save();
    res.status(200).json({
      message: "Application updated",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Delete application
router.post("/delete-application", async (req, res) => {
  const { email, applicationId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.applications = user.applications.filter(
      (app) => app._id.toString() !== applicationId
    );

    await user.save();
    res.status(200).json({
      message: "Application deleted",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
