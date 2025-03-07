const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionLogSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    enum: [
      "subscription_created",
      "subscription_updated",
      "subscription_cancelled",
      "subscription_canceling",
      "subscription_lifecycle_test",
      "payment_succeeded",
      "payment_failed",
      "payment_recovery_succeeded",
      "payment_recovery_failed",
      "customer_created",
      "customer_updated",
      "invoice_created",
      "invoice_paid",
      "invoice_failed",
    ],
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plans",
  },
  subscriptionId: {
    type: String,
  },
  sessionId: {
    type: String,
  },
  invoiceId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
  },
  errorMessage: {
    type: String,
  },
  recoveryAttempt: {
    type: Number,
  },
  metadata: {
    type: Object,
    default: {},
  },
});

// Add index for better query performance
SubscriptionLogSchema.index({ timestamp: -1 });
SubscriptionLogSchema.index({ eventType: 1, timestamp: -1 });

module.exports = mongoose.model("SubscriptionLog", SubscriptionLogSchema);
