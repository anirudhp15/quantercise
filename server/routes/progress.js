const express = require("express");
const router = express.Router();
const UserQuestionProgress = require("../models/UserQuestionProgress");
const Question = require("../models/Question");
const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const params = ["userId", "questionId", "progressId"];

  for (const param of params) {
    if (
      req.params[param] &&
      !mongoose.Types.ObjectId.isValid(req.params[param])
    ) {
      return res.status(400).json({
        error: `Invalid ${param} format`,
      });
    }
  }
  next();
};

/**
 * GET: Retrieve all progress records for a user
 * Returns all questions a user has started or completed
 */
router.get("/user/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await UserQuestionProgress.find({ userId })
      .select("-attempts") // Exclude detailed attempt data for performance
      .sort({ lastActiveAt: -1 });

    res.status(200).json({ progress });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * GET: Retrieve problems completed for a user
 * Returns the number of problems a user has completed
 */
router.get(
  "/user/:userId/problems-completed",
  validateObjectId,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const startedCount = await UserQuestionProgress.countDocuments({
        userId,
        started: true,
      });
      const completedCount = await UserQuestionProgress.countDocuments({
        userId,
        completed: true,
      });

      res.status(200).json({ startedCount, completedCount });
    } catch (error) {
      console.error("Error fetching problems completed:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

/**
 * GET: Retrieve progress for a specific user-question pair
 * Returns detailed progress including attempt history
 */
router.get(
  "/user/:userId/question/:questionId",
  validateObjectId,
  async (req, res) => {
    try {
      const { userId, questionId } = req.params;

      // Find progress document
      let progress = await UserQuestionProgress.findOne({
        userId: new ObjectId(userId),
        questionId: new ObjectId(questionId),
      });

      // If no progress exists, fetch question info to return minimal data
      if (!progress) {
        const question = await Question.findById(questionId);
        if (!question) {
          return res.status(404).json({ error: "Question not found" });
        }

        // Create a new progress record
        progress = new UserQuestionProgress({
          userId: new ObjectId(userId),
          questionId: new ObjectId(questionId),
          questionTitle: question.title,
          questionDifficulty: question.difficulty,
          questionCategory: question.category,
          started: false,
          attempts: [],
        });

        await progress.save();
      }

      // If there's an active conversation, populate it
      if (progress.activeConversationId) {
        await progress.populate("activeConversationId");
      }

      res.status(200).json({ progress });
    } catch (error) {
      console.error("Error fetching question progress:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

/**
 * GET: Retrieve the streak count for a user
 * Returns the number of consecutive days a user has completed problems
 */
router.get("/user/:userId/streak", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all completed problems for the user
    const completedProblems = await UserQuestionProgress.find({
      userId,
      completed: true,
    });

    // Get the last active date
    const lastActive = await UserQuestionProgress.findOne({
      userId,
      lastActiveAt: { $exists: true },
    }).sort({ lastActiveAt: -1 });

    // Get the streak count
    let streakCount = 0;
    let currentStreak = 0;

    for (const problem of completedProblems) {
      if (
        problem.completedAt.toDateString() ===
        lastActive.lastActiveAt.toDateString()
      ) {
        currentStreak++;
      } else {
        streakCount = Math.max(streakCount, currentStreak);
        currentStreak = 1;
      }
    }

    streakCount = Math.max(streakCount, currentStreak);

    res.status(200).json({ streakCount, lastActive: lastActive.lastActiveAt });
  } catch (error) {
    console.error("Error fetching streak count:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * POST: Start or resume working on a question
 * Creates a new progress record if none exists, or updates the existing one
 */
router.post("/start", async (req, res) => {
  try {
    const { userId, questionId } = req.body;

    console.log("START REQUEST:", {
      userId,
      questionId,
      validUserIdFormat: mongoose.Types.ObjectId.isValid(userId),
      validQuestionIdFormat: mongoose.Types.ObjectId.isValid(questionId),
    });

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "Both userId and questionId are required" });
    }

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Fetch question data
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    console.log("Question found:", {
      title: question.title,
      difficulty: question.difficulty,
    });

    // Find or create progress
    let progress = await UserQuestionProgress.findOne({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
    });

    console.log("Progress lookup result:", {
      found: !!progress,
      progressId: progress ? progress._id : null,
    });

    if (!progress) {
      // Create new progress
      progress = new UserQuestionProgress({
        userId: new ObjectId(userId),
        questionId: new ObjectId(questionId),
        questionTitle: question.title,
        questionDifficulty: question.difficulty,
        questionCategory: question.category,
        started: true,
        startedAt: new Date(),
        lastActiveAt: new Date(),
      });

      console.log("Created new progress document");
    } else {
      // Update existing progress
      progress.lastActiveAt = new Date();
      if (!progress.started) {
        progress.started = true;
        progress.startedAt = new Date();
      }

      console.log("Updated existing progress", {
        progressId: progress._id,
        hasActiveConversation: !!progress.activeConversationId,
      });
    }

    // Create new conversation for this attempt if needed
    if (!progress.activeConversationId) {
      console.log("Creating new conversation for progress", {
        progressId: progress._id,
      });

      try {
        const conversation = new Conversation({
          userId: new ObjectId(userId),
          questionId: new ObjectId(questionId),
          attemptNumber: progress.attemptCount + 1,
          userQuestionProgressId: progress._id, // Add this required field
          messages: [],
          metadata: {
            questionTitle: question.title,
            questionDifficulty: question.difficulty,
            questionCategory: question.category,
          },
        });

        await conversation.save();
        progress.activeConversationId = conversation._id;

        console.log("Conversation created successfully", {
          conversationId: conversation._id,
        });
      } catch (convError) {
        console.error("Error creating conversation:", convError);
        throw convError; // Re-throw to be caught by outer try/catch
      }
    }

    await progress.save();
    console.log("Progress saved successfully");

    // Populate the activeConversationId before returning
    await progress.populate("activeConversationId");

    res.status(200).json({
      progress,
      message: "Question started successfully",
    });
  } catch (error) {
    console.error("Error starting question:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * POST: Submit an attempt for a question
 * Updates the progress with the new attempt details
 */
router.post("/submit-attempt", async (req, res) => {
  try {
    const {
      userId,
      questionId,
      code,
      language,
      timeSpent,
      correct,
      feedbackCategory,
    } = req.body;

    console.log("Received attempt submission:", {
      userId,
      questionId,
      codeLength: code ? code.length : 0,
      language,
      timeSpent,
      correct,
      feedbackCategoryHeading: feedbackCategory?.heading || "None",
      validUserIdFormat: mongoose.Types.ObjectId.isValid(userId),
      validQuestionIdFormat: mongoose.Types.ObjectId.isValid(questionId),
    });

    if (!userId || !questionId || !code) {
      return res.status(400).json({
        error: "userId, questionId, and code are required",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the progress
    let progress = await UserQuestionProgress.findOne({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
    });

    console.log("Progress lookup result:", {
      found: !!progress,
      progressId: progress ? progress._id : null,
    });

    // If no progress exists, create one
    if (!progress) {
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      progress = new UserQuestionProgress({
        userId: new ObjectId(userId),
        questionId: new ObjectId(questionId),
        questionTitle: question.title,
        questionDifficulty: question.difficulty,
        questionCategory: question.category,
        started: true,
        startedAt: new Date(),
        lastActiveAt: new Date(),
      });

      console.log("Created new progress document");
    }

    // Get active conversation or create one
    let conversationId = progress.activeConversationId;
    console.log("Active conversation check:", {
      hasActiveConversation: !!conversationId,
      conversationId: conversationId || "None",
    });

    if (!conversationId) {
      try {
        console.log("Creating new conversation for attempt");
        const newConversation = new Conversation({
          userId: new ObjectId(userId),
          questionId: new ObjectId(questionId),
          attemptNumber: progress.attemptCount + 1,
          userQuestionProgressId: progress._id, // Add this required field
          messages: [],
          metadata: {
            questionTitle: progress.questionTitle,
            questionDifficulty: progress.questionDifficulty,
            questionCategory: progress.questionCategory,
          },
        });

        await newConversation.save();
        conversationId = newConversation._id;
        progress.activeConversationId = conversationId;

        console.log("New conversation created:", {
          conversationId,
        });
      } catch (convError) {
        console.error("Error creating conversation:", convError);
        throw convError;
      }
    }

    // Add user's submission to conversation
    try {
      await Conversation.updateOne(
        { _id: conversationId },
        {
          $push: {
            messages: {
              role: "user",
              content: code,
              messageType: "answer",
              timestamp: new Date(),
            },
          },
        }
      );
      console.log("Added message to conversation");
    } catch (msgError) {
      console.error("Error adding message to conversation:", msgError);
    }

    // Create new attempt
    const newAttempt = {
      attemptNumber: progress.attemptCount + 1,
      submittedAt: new Date(),
      userAnswer: code,
      language: language || "javascript",
      correct: correct || false,
      feedbackCategory: feedbackCategory || {
        heading: "PENDING",
        color: "text-gray-500",
      },
      timeSpent: timeSpent || 0,
      conversationId,
    };

    console.log("Created new attempt object:", {
      attemptNumber: newAttempt.attemptNumber,
      hasConversationId: !!newAttempt.conversationId,
    });

    // Update progress
    progress.attempts.push(newAttempt);
    progress.attemptCount += 1;
    progress.totalTimeSpent += timeSpent || 0;
    progress.lastActiveAt = new Date();

    console.log("Updating progress:", {
      newAttemptCount: progress.attemptCount,
      attemptsArrayLength: progress.attempts.length,
    });

    // Handle successful completion
    if (correct && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      console.log("Marked progress as completed");
    }

    await progress.save();
    console.log("Progress saved successfully");

    res.status(200).json({
      message: "Attempt submitted successfully",
      attempt: newAttempt,
      progress,
    });
  } catch (error) {
    console.error("Error submitting attempt:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * PUT: Update the feedback details for an attempt
 * Used when the AI evaluation is complete
 */
router.put(
  "/update-attempt/:progressId/:attemptIndex",
  validateObjectId,
  async (req, res) => {
    try {
      const { progressId, attemptIndex } = req.params;
      const { correct, feedbackCategory, aiConfidenceScore, aiScoringReason } =
        req.body;

      const progress = await UserQuestionProgress.findById(progressId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      const attemptIdx = parseInt(attemptIndex);
      if (
        isNaN(attemptIdx) ||
        attemptIdx < 0 ||
        attemptIdx >= progress.attempts.length
      ) {
        return res.status(400).json({ error: "Invalid attempt index" });
      }

      // Update the attempt
      if (correct !== undefined)
        progress.attempts[attemptIdx].correct = correct;
      if (feedbackCategory)
        progress.attempts[attemptIdx].feedbackCategory = feedbackCategory;

      // Update progress AI scores
      if (aiConfidenceScore !== undefined)
        progress.attempts[attemptIdx].aiConfidenceScore = aiConfidenceScore;
      if (aiScoringReason)
        progress.attempts[attemptIdx].aiScoringReason = aiScoringReason;

      // If this attempt is correct and progress isn't marked complete yet
      if (correct && !progress.completed) {
        progress.completed = true;
        progress.completedAt = new Date();
      }

      // If this score is better than best score, update it
      if (
        aiConfidenceScore !== undefined &&
        aiConfidenceScore > progress.bestScore
      ) {
        progress.bestScore = aiConfidenceScore;
      }

      await progress.save();

      res.status(200).json({
        message: "Attempt feedback updated",
        attempt: progress.attempts[attemptIdx],
        progress,
      });
    } catch (error) {
      console.error("Error updating attempt feedback:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

/**
 * GET: Retrieve a specific attempt with its conversation
 * Used to view details of a past attempt
 */
router.get(
  "/attempt/:progressId/:attemptIndex",
  validateObjectId,
  async (req, res) => {
    try {
      const { progressId, attemptIndex } = req.params;

      const progress = await UserQuestionProgress.findById(progressId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      const attemptIdx = parseInt(attemptIndex);
      if (
        isNaN(attemptIdx) ||
        attemptIdx < 0 ||
        attemptIdx >= progress.attempts.length
      ) {
        return res.status(400).json({ error: "Invalid attempt index" });
      }

      const attempt = progress.attempts[attemptIdx];

      // Get conversation for this attempt
      const conversation = await Conversation.findById(attempt.conversationId);

      res.status(200).json({
        attempt,
        conversation,
      });
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

/**
 * PUT: Update user notes for a question
 */
router.put("/notes/:progressId", validateObjectId, async (req, res) => {
  try {
    const { progressId } = req.params;
    const { notes } = req.body;

    if (notes === undefined) {
      return res.status(400).json({ error: "Notes field is required" });
    }

    const progress = await UserQuestionProgress.findByIdAndUpdate(
      progressId,
      {
        $set: {
          notes,
          lastActiveAt: new Date(),
        },
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    res.status(200).json({
      message: "Notes updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * PUT: Update general progress fields
 */
router.put("/update/:progressId", validateObjectId, async (req, res) => {
  try {
    const { progressId } = req.params;
    const updates = req.body;

    // Fields that can be updated directly
    const allowedFields = [
      "notes",
      "bookmarked",
      "started",
      "completed",
      "completedAt",
      "lastActiveAt",
    ];

    // Filter to only allowed fields
    const filteredUpdates = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // Always update last active timestamp
    filteredUpdates.lastActiveAt = new Date();

    const progress = await UserQuestionProgress.findByIdAndUpdate(
      progressId,
      { $set: filteredUpdates },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    res.status(200).json({
      message: "Progress updated",
      progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * PUT: Toggle bookmark status
 */
router.put("/bookmark/:progressId", validateObjectId, async (req, res) => {
  try {
    const { progressId } = req.params;
    const { bookmarked } = req.body;

    if (bookmarked === undefined) {
      return res.status(400).json({ error: "Bookmarked field is required" });
    }

    const progress = await UserQuestionProgress.findByIdAndUpdate(
      progressId,
      {
        $set: {
          bookmarked,
          lastActiveAt: new Date(),
        },
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    res.status(200).json({
      message: bookmarked ? "Question bookmarked" : "Bookmark removed",
      progress,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * GET: Dashboard statistics for a user's progress
 */
router.get("/stats/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;

    const progressItems = await UserQuestionProgress.find({ userId });

    // Calculate statistics
    const stats = {
      totalQuestions: progressItems.length,
      completed: progressItems.filter((p) => p.completed).length,
      started: progressItems.filter((p) => p.started && !p.completed).length,
      bookmarked: progressItems.filter((p) => p.bookmarked).length,
      totalAttempts: progressItems.reduce((sum, p) => sum + p.attemptCount, 0),
      totalTimeSpent: progressItems.reduce(
        (sum, p) => sum + p.totalTimeSpent,
        0
      ),

      // By difficulty
      byDifficulty: {
        Easy: progressItems.filter((p) => p.questionDifficulty === "Easy")
          .length,
        Medium: progressItems.filter((p) => p.questionDifficulty === "Medium")
          .length,
        Hard: progressItems.filter((p) => p.questionDifficulty === "Hard")
          .length,
      },

      // By category
      byCategory: {},
    };

    // Build category stats
    progressItems.forEach((p) => {
      const category = p.questionCategory;
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = {
          total: 0,
          completed: 0,
        };
      }

      stats.byCategory[category].total++;
      if (p.completed) {
        stats.byCategory[category].completed++;
      }
    });

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Error calculating stats:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * Get the progress for all questions with minimal data
 * Used for listing/overview displays
 */
router.get("/all-questions/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;

    // First get all questions
    const questions = await Question.find({}, "title difficulty category");

    // Then get user progress for these questions
    const userProgress = await UserQuestionProgress.find(
      { userId },
      "questionId started completed bookmarked attemptCount"
    );

    // Create a map of progress by question ID for quick lookup
    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.questionId.toString()] = {
        started: p.started,
        completed: p.completed,
        bookmarked: p.bookmarked,
        attemptCount: p.attemptCount,
        progressId: p._id,
      };
    });

    // Combine data
    const questionsWithProgress = questions.map((q) => {
      const progress = progressMap[q._id.toString()] || {
        started: false,
        completed: false,
        bookmarked: false,
        attemptCount: 0,
        progressId: null,
      };

      return {
        questionId: q._id,
        title: q.title,
        difficulty: q.difficulty,
        category: q.category,
        ...progress,
      };
    });

    res.status(200).json({ questions: questionsWithProgress });
  } catch (error) {
    console.error("Error fetching questions with progress:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * GET: Debug endpoint - Check attempt structure for a specific progress
 * This is useful for debugging only - remove in production
 */
router.get("/debug/:progressId", validateObjectId, async (req, res) => {
  try {
    const { progressId } = req.params;

    const progress = await UserQuestionProgress.findById(progressId);
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    // Log the full progress structure
    console.log("Progress found:", {
      _id: progress._id,
      userId: progress.userId,
      questionId: progress.questionId,
      attemptCount: progress.attemptCount,
      attempts: progress.attempts.map((a) => ({
        attemptNumber: a.attemptNumber,
        submittedAt: a.submittedAt,
        userAnswerLength: a.userAnswer ? a.userAnswer.length : 0,
        conversationId: a.conversationId,
      })),
    });

    res.status(200).json({
      message: "Debug info logged to console",
      progress,
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * GET: Debug endpoint to check progress data
 */
router.get("/debug/:userId/:questionId", validateObjectId, async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    // Find progress
    const progress = await UserQuestionProgress.findOne({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
    });

    if (!progress) {
      return res.status(404).json({
        message: "No progress found for this user and question",
        debug: {
          userId,
          questionId,
          validUserId: mongoose.Types.ObjectId.isValid(userId),
          validQuestionId: mongoose.Types.ObjectId.isValid(questionId),
        },
      });
    }

    // Get the question data
    const question = await Question.findById(questionId);

    // Get related conversations
    const conversations = await Conversation.find({
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
    });

    res.status(200).json({
      progress,
      question: question || "Question not found",
      conversations: conversations.map((c) => ({
        id: c._id,
        messageCount: c.messages.length,
        createdAt: c.createdAt,
      })),
      debug: {
        progressId: progress._id,
        hasActiveConversation: !!progress.activeConversationId,
        attemptCount: progress.attemptCount,
        attemptsLength: progress.attempts.length,
      },
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
