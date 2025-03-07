const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST - Add new application to user
router.post("/add-application", async (req, res) => {
  const { email, application } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add initial status to history
    application.statusHistory = [
      {
        status: application.status,
        date: application.dateOfSubmission || new Date(),
        notes: "Initial application status",
      },
    ];

    user.applications.push(application);
    await user.save();
    res
      .status(200)
      .json({ message: "Application saved", applications: user.applications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET - Get user applications
router.get("/user-applications/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ applications: user.applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Edit existing application
router.post("/edit-application", async (req, res) => {
  const { email, applicationId, updatedFields } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application to edit
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // If status is being updated, add to history
    if (
      updatedFields.status &&
      updatedFields.status !== user.applications[appIndex].status
    ) {
      if (!user.applications[appIndex].statusHistory) {
        user.applications[appIndex].statusHistory = [];
      }
      user.applications[appIndex].statusHistory.push({
        status: updatedFields.status,
        date: new Date(),
        notes:
          updatedFields.statusNotes ||
          `Status updated to ${updatedFields.status}`,
      });
    }

    // Update only the fields that were changed
    for (const [key, value] of Object.entries(updatedFields)) {
      if (key !== "statusNotes") {
        // Don't update the temporary statusNotes field
        user.applications[appIndex][key] = value;
      }
    }

    await user.save();
    res.status(200).json({
      message: "Application updated",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Delete application
router.post("/delete-application", async (req, res) => {
  const { email, applicationId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.applications = user.applications.filter(
      (app) => app._id.toString() !== applicationId
    );

    await user.save();
    res.status(200).json({
      message: "Application deleted",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// INTERVIEW RELATED ROUTES

// POST - Add new interview to application
router.post("/add-interview", async (req, res) => {
  const { email, applicationId, interview } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application to add interview to
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Initialize interviews array if it doesn't exist
    if (!user.applications[appIndex].interviews) {
      user.applications[appIndex].interviews = [];
    }

    // Add the interview
    user.applications[appIndex].interviews.push(interview);

    // Update application status to "Interviewing" if it's not already there
    if (user.applications[appIndex].status !== "Interviewing") {
      const prevStatus = user.applications[appIndex].status;
      user.applications[appIndex].status = "Interviewing";

      // Add to status history
      user.applications[appIndex].statusHistory.push({
        status: "Interviewing",
        date: new Date(),
        notes: `Status automatically updated to Interviewing due to interview scheduled (from ${prevStatus})`,
      });
    }

    await user.save();
    res.status(200).json({
      message: "Interview added",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Update interview
router.post("/update-interview", async (req, res) => {
  const { email, applicationId, interviewId, updatedInterview } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the interview
    const interviewIndex = user.applications[appIndex].interviews.findIndex(
      (interview) => interview._id.toString() === interviewId
    );
    if (interviewIndex === -1) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Update the interview fields
    for (const [key, value] of Object.entries(updatedInterview)) {
      user.applications[appIndex].interviews[interviewIndex][key] = value;
    }

    await user.save();
    res.status(200).json({
      message: "Interview updated",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Delete interview
router.post("/delete-interview", async (req, res) => {
  const { email, applicationId, interviewId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Remove the interview
    user.applications[appIndex].interviews = user.applications[
      appIndex
    ].interviews.filter(
      (interview) => interview._id.toString() !== interviewId
    );

    // If no interviews are left, and status is "Interviewing", update status to "Applied"
    if (
      user.applications[appIndex].interviews.length === 0 &&
      user.applications[appIndex].status === "Interviewing"
    ) {
      user.applications[appIndex].status = "Applied";

      // Add to status history
      user.applications[appIndex].statusHistory.push({
        status: "Applied",
        date: new Date(),
        notes:
          "Status automatically reverted to Applied as no interviews are scheduled",
      });
    }

    await user.save();
    res.status(200).json({
      message: "Interview deleted",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET - Get all upcoming interviews
router.get("/upcoming-interviews/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Collect all interviews from all applications
    const currentDate = new Date();
    const upcomingInterviews = [];

    user.applications.forEach((application) => {
      if (application.interviews && application.interviews.length > 0) {
        application.interviews.forEach((interview) => {
          if (
            new Date(interview.date) >= currentDate &&
            interview.status !== "Cancelled"
          ) {
            upcomingInterviews.push({
              applicationId: application._id,
              company: application.company,
              position: application.position,
              field: application.field,
              interview: interview,
            });
          }
        });
      }
    });

    // Sort by date (closest first)
    upcomingInterviews.sort(
      (a, b) => new Date(a.interview.date) - new Date(b.interview.date)
    );

    res.status(200).json({ upcomingInterviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Add interview question
router.post("/add-interview-question", async (req, res) => {
  const { email, applicationId, interviewId, question } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the interview
    const interviewIndex = user.applications[appIndex].interviews.findIndex(
      (interview) => interview._id.toString() === interviewId
    );
    if (interviewIndex === -1) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Add question
    user.applications[appIndex].interviews[interviewIndex].questions.push(
      question
    );

    await user.save();
    res.status(200).json({
      message: "Interview question added",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST - Update interview status (completed, cancelled, etc.)
router.post("/update-interview-status", async (req, res) => {
  const { email, applicationId, interviewId, status, feedback } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the application
    const appIndex = user.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the interview
    const interviewIndex = user.applications[appIndex].interviews.findIndex(
      (interview) => interview._id.toString() === interviewId
    );
    if (interviewIndex === -1) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Update status
    user.applications[appIndex].interviews[interviewIndex].status = status;

    // Add feedback if provided
    if (feedback) {
      user.applications[appIndex].interviews[interviewIndex].feedback =
        feedback;
    }

    await user.save();
    res.status(200).json({
      message: "Interview status updated",
      applications: user.applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
