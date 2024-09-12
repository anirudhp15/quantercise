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

module.exports = router;
