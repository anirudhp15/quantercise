// Import necessary modules
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Fetch All Questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch a Single Question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a New Question
router.post("/", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an Existing Question
router.put("/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Question
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch unique tags for each category
router.get("/tags", async (req, res) => {
  try {
    const categories = [
      "Critical Mathematical Foundations",
      "Programming and Algorithmic Thinking",
      "Financial Concepts and Modeling",
      "Brain Teasers and Logical Puzzles",
    ];

    // Initialize an object to store the tags for each category
    const tagsByCategory = {};

    for (const category of categories) {
      // Fetch unique tags for each category
      const tags = await Question.distinct("tags", { category: category });
      tagsByCategory[category] = tags;
    }

    res.json(tagsByCategory);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;
