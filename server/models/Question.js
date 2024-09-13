const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  id: Number,
  title: { type: String, required: true }, // Marked as required
  difficultyScore: { type: Number, default: 0 }, // Default to 0 for new questions
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  }, // Enum to ensure valid difficulty values
  userDifficultyRatings: { type: [Number], default: [] }, // Array of numbers for ratings
  description: { type: String, required: true }, // Marked as required
  solution: { type: String, required: true }, // Marked as required
  hints: { type: [String], default: [] }, // Array of strings for hints
  completed: { type: Boolean, default: false }, // Default to false for new questions
  correct: { type: Boolean, default: false }, // Default to false for new questions
  attempts: { type: Number, default: 0 }, // Track attempts, default to 0
  timeSpent: { type: Number, default: 0 }, // Time spent in seconds, default to 0
  category: { type: String, required: true }, // Category should be required
  tags: { type: [String], default: [] }, // Array of strings for tags
  userFeedback: { type: [String], default: [] }, // Array for feedback
  averageTimeToSolve: { type: Number, default: 0 }, // Default to 0 for new questions
  interactiveSteps: { type: [String], default: [] }, // Array of strings for interactive steps
  isPro: { type: Boolean, default: false }, // Default to false
});

module.exports = mongoose.model("Question", questionSchema);
