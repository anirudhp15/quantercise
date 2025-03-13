const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const DemoConversation = require("../models/DemoConversation");
const UserQuestionProgress = require("../models/UserQuestionProgress");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const auth = require("../middleware/auth");
const User = require("../models/User");

// Middleware to check if ID is valid
const validateObjectId = (req, res, next) => {
  const id = req.params.id || req.body.conversationId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

// GET: Retrieve all conversations for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      userId,
      userDeleted: false,
    }).sort({ "metadata.lastMessageAt": -1 });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Retrieve all conversations for a specific user and question
router.get("/user/:userId/question/:questionId", async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid user ID or question ID format" });
    }

    const conversations = await Conversation.find({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
      userDeleted: false,
    }).sort({ "metadata.lastMessageAt": -1 });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Retrieve a specific conversation by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.userDeleted) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Create a new conversation
router.post("/", async (req, res) => {
  try {
    const { userId, questionId, initialMessage, metadata } = req.body;

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "User ID and Question ID are required" });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid user ID or question ID format" });
    }

    const newConversation = new Conversation({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
      messages: initialMessage ? [initialMessage] : [],
      metadata: metadata || {},
      sessionId: new ObjectId().toString(),
    });

    await newConversation.save();
    res.status(201).json({
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// PUT: Add a message to an existing conversation
router.put("/:id/messages", validateObjectId, async (req, res) => {
  try {
    const { message } = req.body;
    const conversationId = req.params.id;

    if (!message || !message.role || !message.content) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Ensure the message has a timestamp
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || new Date(),
    };

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.userDeleted) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Add message to conversation
    conversation.messages.push(messageWithTimestamp);

    // Update metadata
    conversation.metadata.lastMessageAt = new Date();
    conversation.metadata.totalMessages = conversation.messages.length;

    await conversation.save();

    res.status(200).json({
      message: "Message added successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT: Update conversation metadata
router.put("/:id/metadata", validateObjectId, async (req, res) => {
  try {
    const { metadata } = req.body;
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.userDeleted) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Update metadata
    conversation.metadata = { ...conversation.metadata, ...metadata };
    await conversation.save();

    res.status(200).json({
      message: "Metadata updated successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error updating metadata:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE: Mark a conversation as deleted by the user (soft delete)
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Soft delete (mark as deleted by user)
    conversation.userDeleted = true;
    await conversation.save();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Clear conversation history and create a new one (updated to work with UserQuestionProgress)
router.post("/clear-history/:userId/:questionId", async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid user ID or question ID format" });
    }

    // Find the UserQuestionProgress document
    const progress = await UserQuestionProgress.findOne({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
    });

    if (!progress) {
      return res
        .status(404)
        .json({ error: "No progress found for this question" });
    }

    // Mark the current active conversation as inactive (if it exists)
    if (progress.activeConversationId) {
      await Conversation.updateOne(
        { _id: progress.activeConversationId },
        { $set: { isActive: false } }
      );
    }

    // Create a new conversation session for this user and question
    const newConversation = new Conversation({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
      attemptNumber: progress.attemptCount + 1,
      userQuestionProgressId: progress._id,
      messages: [],
      metadata: {
        questionTitle: progress.questionTitle,
        questionDifficulty: progress.questionDifficulty,
        questionCategory: progress.questionCategory,
      },
    });

    await newConversation.save();

    // Update the progress with the new active conversation
    progress.activeConversationId = newConversation._id;
    await progress.save();

    res.status(200).json({
      message: "Conversation history cleared",
      conversation: newConversation,
      progress,
    });
  } catch (error) {
    console.error("Error clearing conversation history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Link an existing conversation to UserQuestionProgress
router.post(
  "/link-to-progress/:conversationId/:progressId",
  validateObjectId,
  async (req, res) => {
    try {
      const { conversationId, progressId } = req.params;

      // Find the conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Find the progress
      const progress = await UserQuestionProgress.findById(progressId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      // Make sure they match
      if (
        conversation.userId.toString() !== progress.userId.toString() ||
        conversation.questionId.toString() !== progress.questionId.toString()
      ) {
        return res.status(400).json({
          error:
            "Conversation and progress document must belong to the same user and question",
        });
      }

      // Update the progress with this conversation
      progress.activeConversationId = conversation._id;
      progress.lastActiveAt = new Date();
      await progress.save();

      res.status(200).json({
        message: "Conversation linked to progress",
        conversation,
        progress,
      });
    } catch (error) {
      console.error("Error linking conversation:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

// GET: Analytics - Get conversation statistics for a user
router.get("/analytics/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Conversation.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $group: {
          _id: "$questionId",
          totalConversations: { $sum: 1 },
          totalMessages: { $sum: "$metadata.totalMessages" },
          lastInteraction: { $max: "$metadata.lastMessageAt" },
        },
      },
      { $sort: { lastInteraction: -1 } },
    ]);

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------- DEMO CONVERSATION ENDPOINTS (for anonymous users) -------

// POST: Create a new demo conversation
router.post("/demo", async (req, res) => {
  try {
    const { sessionId, problemId, initialMessage, metadata = {} } = req.body;

    // Basic validation
    if (!sessionId || !problemId || !initialMessage) {
      return res.status(400).json({
        error:
          "Required fields missing: sessionId, problemId, or initialMessage",
      });
    }

    // Optional: Enrich client info metadata
    const clientInfo = {
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip || req.headers["x-forwarded-for"] || "",
      referrer: req.headers.referer || "",
      device: req.headers["user-agent"]
        ? req.headers["user-agent"].includes("Mobile")
          ? "mobile"
          : "desktop"
        : "unknown",
      timestamp: new Date(),
    };

    // Create new demo conversation
    const newDemoConversation = new DemoConversation({
      sessionId,
      problemId: new ObjectId(problemId),
      messages: [
        {
          role: initialMessage.role,
          content: initialMessage.content,
          messageType: initialMessage.messageType || "answer",
          timestamp: new Date(),
        },
      ],
      metadata: {
        ...metadata,
        clientInfo,
        problemTitle: metadata.problemTitle || "",
        problemDifficulty: metadata.problemDifficulty || "",
        problemCategory: metadata.problemCategory || "",
      },
    });

    await newDemoConversation.save();

    res.status(201).json({
      success: true,
      demoConversationId: newDemoConversation._id,
      message: "Demo conversation created successfully",
    });
  } catch (error) {
    console.error("Error creating demo conversation:", error);
    res.status(500).json({ error: "Server error creating demo conversation" });
  }
});

// POST: Add a message to an existing demo conversation
router.post("/demo/:id/messages", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.role || !message.content) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    const demoConversation = await DemoConversation.findById(id);
    if (!demoConversation) {
      return res.status(404).json({ error: "Demo conversation not found" });
    }

    // Add the new message
    const newMessage = {
      role: message.role,
      content: message.content,
      messageType: message.messageType || "other",
      timestamp: new Date(),
    };

    demoConversation.messages.push(newMessage);
    await demoConversation.save();

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      demoConversation,
    });
  } catch (error) {
    console.error("Error adding message to demo conversation:", error);
    res.status(500).json({ error: "Server error adding message" });
  }
});

// GET: Retrieve a specific demo conversation by ID
router.get("/demo/:id", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const demoConversation = await DemoConversation.findById(id);

    if (!demoConversation) {
      return res.status(404).json({ error: "Demo conversation not found" });
    }

    res.status(200).json({ demoConversation });
  } catch (error) {
    console.error("Error fetching demo conversation:", error);
    res.status(500).json({ error: "Server error fetching demo conversation" });
  }
});

// GET: Retrieve all demo conversations for a specific session
router.get("/demo/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const demoConversations = await DemoConversation.find({
      sessionId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ demoConversations });
  } catch (error) {
    console.error("Error fetching demo conversations:", error);
    res.status(500).json({ error: "Server error fetching demo conversations" });
  }
});

// GET: Retrieve demo conversations for a specific problem
router.get("/demo/problem/:problemId", validateObjectId, async (req, res) => {
  try {
    const { problemId } = req.params;

    const demoConversations = await DemoConversation.find({
      problemId: new ObjectId(problemId),
    }).sort({ createdAt: -1 });

    res.status(200).json({ demoConversations });
  } catch (error) {
    console.error("Error fetching demo conversations by problem:", error);
    res.status(500).json({ error: "Server error fetching demo conversations" });
  }
});

/**
 * @route GET /api/conversations/recent/:userId
 * @desc Get recent conversations for a user
 * @access Private
 */
router.get("/recent/:userId", auth, async (req, res) => {
  try {
    const firebaseUid = req.params.userId;
    console.log("Fetching recent conversations for Firebase UID:", firebaseUid);
    const limit = parseInt(req.query.limit) || 3;

    // First, find the user in the database by their Firebase UID
    const user = await User.findOne({ firebaseUid });
    console.log("Found user:", user ? "yes" : "no");

    if (!user) {
      console.log("User not found for Firebase UID:", firebaseUid);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Fetching conversations for MongoDB user ID:", user._id);
    // Get most recently worked on questions
    const recentConversations = await Conversation.aggregate([
      { $match: { userId: user._id } },
      {
        $sort: { updatedAt: -1 }, // Sort by most recently updated first
      },
      {
        $group: {
          _id: "$questionId",
          lastUpdated: { $max: "$updatedAt" }, // Get most recent update time per question
          conversation: { $first: "$$ROOT" },
        },
      },
      {
        $sort: { lastUpdated: -1 }, // Sort groups by most recent update
      },
      {
        $limit: limit,
      },
      {
        $replaceRoot: { newRoot: "$conversation" },
      },
    ]);

    await Conversation.populate(recentConversations, {
      path: "questionId",
      select: "title difficulty",
    });

    console.log("Found conversations:", recentConversations.length);
    // Format the response with only needed information
    const formattedConversations = recentConversations.map((conv) => ({
      _id: conv._id,
      questionId: conv.questionId?._id,
      questionTitle: conv.questionId?.title || "Untitled Question",
      difficulty: conv.questionId?.difficulty,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    res.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching recent conversations:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
