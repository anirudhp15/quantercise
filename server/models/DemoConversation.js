const mongoose = require("mongoose");

// Schema for individual messages in a demo conversation
const demoMessageSchema = new mongoose.Schema({
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

// Schema for demo conversation sessions (for anonymous users)
const demoConversationSchema = new mongoose.Schema({
  // Anonymous session identifier (could be a browser fingerprint or session ID)
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  // Reference to the problem being discussed
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
    index: true,
  },
  messages: [demoMessageSchema],
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
    problemTitle: String,
    problemDifficulty: String,
    problemCategory: String,
    clientInfo: {
      userAgent: String,
      ip: String, // Store in hashed form for privacy
      referrer: String,
      device: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
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
});

// Update timestamps on save
demoConversationSchema.pre("save", function (next) {
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

// Add compound index for faster lookup
demoConversationSchema.index({ sessionId: 1, problemId: 1 });

module.exports = mongoose.model("DemoConversation", demoConversationSchema);
