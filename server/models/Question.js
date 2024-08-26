const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  id: Number,
  title: String,
  difficultyScore: Number,
  difficulty: String,
  userDifficultyRatings: [Number],
  description: String,
  solution: String,
  hints: [String],
  completed: Boolean,
  correct: Boolean,
  attempts: Number,
  timeSpent: Number,
  category: String,
  tags: [String],
  userFeedback: [String],
  averageTimeToSolve: Number,
  interactiveSteps: [String],
  isPro: Boolean,
});

module.exports = mongoose.model("Question", questionSchema);
