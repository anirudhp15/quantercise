const mongoose = require("mongoose");

// Schema for individual messages in a conversation
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messageType: {
    type: String,
    enum: ["answer", "question", "explanation", "feedback", "other"],
    default: "other",
  },
});

// Schema for conversation sessions
const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Add index for quicker lookup by user
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
    index: true, // Add index for quicker lookup by question
  },
  // Add to the conversationSchema
  attemptNumber: {
    type: Number,
    required: true,
  },
  userQuestionProgressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserQuestionProgress",
    required: true,
    index: true,
  },
  messages: [messageSchema],
  // Metadata for easier searching and analysis
  metadata: {
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    questionTitle: String, // Store this for easier frontend display
    questionDifficulty: String,
    questionCategory: String,
    feedback: {
      rating: Number,
      comment: String,
    },
    tags: [String], // Additional tags for analysis
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // For user privacy controls
  userDeleted: {
    type: Boolean,
    default: false,
  },
  // For analytical grouping of conversation sessions
  sessionId: {
    type: String,
    index: true,
  },
});

// Update timestamps on save
conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Update metadata
  if (this.messages) {
    this.metadata.totalMessages = this.messages.length;
    if (this.messages.length > 0) {
      this.metadata.lastMessageAt =
        this.messages[this.messages.length - 1].timestamp;
    }
  }

  next();
});

// Add compound index for faster lookup by user+question
conversationSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
