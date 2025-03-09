const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

const interviewSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "Phone Screen",
      "Technical",
      "Behavioral",
      "Take-home Assignment",
      "Onsite",
      "Final Round",
      "Other",
    ],
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  location: {
    type: String,
    default: "Remote",
  },
  meetingLink: {
    type: String,
  },
  interviewers: [
    {
      name: String,
      role: String,
      email: String,
      linkedin: String,
    },
  ],
  preparation: {
    type: String,
    default: "", // Notes for preparation
  },
  questions: [
    {
      question: String,
      notes: String,
    },
  ],
  feedback: {
    type: String,
    default: "", // Post-interview reflection
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled", "No-show"],
    default: "Scheduled",
  },
  reminderSet: {
    type: Boolean,
    default: true,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  followUpNeeded: {
    type: Boolean,
    default: true,
  },
  followUpSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, required: true },
  dateOfSubmission: { type: Date, required: true },
  deadlineDate: { type: Date },
  notes: { type: String },
  field: { type: String, required: true },
  coverLetter: { type: String, default: "No Cover Letter" },
  location: { type: String },
  workMode: {
    type: String,
    enum: ["In-person", "Hybrid", "Remote"],
    default: "In-person",
  },
  statusHistory: [statusHistorySchema], // Add status history array
  interviews: [interviewSchema], // Add interviews array
});

// Define the Problem Progress sub-schema
const problemProgressSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  correct: {
    type: Boolean,
    default: null, // null until the user answers the question
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0, // Time spent in seconds
  },
  lastAttempted: {
    type: Date,
    default: Date.now,
  },
});

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  googleId: { type: String },
  firebaseUid: { type: String },
  displayName: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "../../assets/images/default_profile.jpg",
  },
  registrationStep: {
    type: String,
    enum: ["auth", "mongo", "plan", "complete"], // Include all possible steps in the onboarding flow
    default: "plan", // Default to "auth" when a new user is created
    required: true, // Ensure it is always present
  },
  signInCount: {
    type: Number,
    default: 0,
  },
  isPro: {
    type: Boolean,
    default: null, // Default to null for free or no subscription
  },
  currentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan", // Reference to the Plan model
    default: null, // Default to null for free or no subscription
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  profileColor: { type: String, default: "#6B7280" }, // Default gray color
  progress: [problemProgressSchema], // Embed the Problem Progress sub-schema as an array
  applications: [applicationSchema], // Embed the Application sub-schema as an array
  stripeCustomerId: {
    type: String,
    index: true,
  },
  subscriptionId: {
    type: String,
    index: true,
  },
  subscriptionStatus: {
    type: String,
    enum: [
      "active",
      "past_due",
      "canceled",
      "incomplete",
      "incomplete_expired",
      "trialing",
      "unpaid",
      "paused",
      "cancelled",
      "canceling",
    ],
    default: "active",
  },
  cancellationDetails: {
    canceledAt: {
      type: Date,
    },
    effectiveAt: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
  },
  subscriptionCurrentPeriodEnd: {
    type: Date,
  },
  paymentFailureCount: {
    type: Number,
    default: 0,
  },
  lastPaymentFailureDate: {
    type: Date,
  },
  paymentMethodLast4: {
    type: String,
  },
  paymentMethodBrand: {
    type: String,
  },
  emailNotifications: {
    paymentFailed: {
      type: Boolean,
      default: true,
    },
    subscriptionRenewed: {
      type: Boolean,
      default: true,
    },
    subscriptionCancelled: {
      type: Boolean,
      default: true,
    },
  },
});

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

// Add a pre-save hook to update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
