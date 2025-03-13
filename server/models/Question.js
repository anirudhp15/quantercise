const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: { type: String, required: true }, // Marked as required
  difficultyScore: { type: Number, default: 0 }, // Default to 0 for new questions
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  }, // Enum to ensure valid difficulty values
  description: { type: String, required: true }, // Marked as required
  solution: { type: String, required: true }, // Marked as required
  hints: { type: [String], default: [] }, // Array of strings for hints
  category: { type: String, required: true }, // Category should be required
  tags: { type: [String], default: [] }, // Array of strings for tags
  isPro: { type: Boolean, default: false }, // Default to false

  progressionId: { type: String, required: true }, // Group questions into progressions
  progressionOrder: { type: Number, default: 0 }, // Position in the progression
  progressionTitle: { type: String }, // Optional descriptive title for the progression

  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  timeLimit: { type: Number, default: 3600 }, // Time limit in seconds
});

module.exports = mongoose.model("Question", questionSchema);
