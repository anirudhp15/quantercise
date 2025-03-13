const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Track an attempt's details
const attemptSchema = new Schema({
  attemptNumber: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  userAnswer: { type: String, required: true }, // changed from "code" to "userAnswer" for clarity
  aiConfidenceScore: { type: Number, min: 0, max: 100 },
  aiScoringReason: String,
  timeSpent: Number,
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
});

const userQuestionProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    // Cached question data for quicker access
    questionTitle: { type: String },
    questionDifficulty: { type: String },
    questionCategory: { type: String },

    // Progress tracking
    started: { type: Boolean, default: false },
    startedAt: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },

    // Performance metrics
    totalTimeSpent: { type: Number, default: 0 },
    attemptCount: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0, min: 0, max: 100 },

    // Detailed attempt history
    attempts: { type: [attemptSchema], default: [] },

    // AI feedback
    aiConfidenceScore: { type: Number, default: 0, min: 0, max: 100 },
    aiScoringReason: { type: String, default: "" },

    // User session data
    lastActiveAt: { type: Date },
    bookmarked: { type: Boolean, default: false },
    notes: { type: String, default: "" },

    // Current active conversation
    activeConversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique user-question pairs
userQuestionProgressSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "UserQuestionProgress",
  userQuestionProgressSchema
);
