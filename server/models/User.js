const mongoose = require("mongoose");

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
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
  },
  displayName: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "../../assets/images/default_profile.jpg",
  },
  signInCount: {
    type: Number,
    default: 0,
  },
  isPro: {
    type: Boolean,
    default: false,
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
  progress: [problemProgressSchema], // Embed the Problem Progress sub-schema as an array
  applications: [applicationSchema], // Embed the Application sub-schema as an array
});

// Add a pre-save hook to update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
