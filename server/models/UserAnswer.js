const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  attemptNumber: {
    type: Number,
    default: 1, // increment this in your controller logic
  },
  userAnswer: {
    type: String,
    default: "", // store user's open-ended answer here
  },
  gptFeedback: {
    type: String,
    default: "", // store GPT's textual feedback or partial JSON
  },
  /**
   * If GPT can give a numeric confidence or correctness measure,
   * you can store it here as well, to keep it structured.
   */
  gptFeedbackStructured: {
    type: Object,
    default: {},
  },
  /**
   * If you want to capture the time the user spent for this specific attempt
   * (especially if you track time per attempt in your front-end).
   */
  timeSpent: {
    type: Number,
    default: 0, // in seconds
  },
  /**
   * Whether the user got it correct on this particular attempt
   * (may differ from the final outcome in their overall progress).
   */
  wasCorrect: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
