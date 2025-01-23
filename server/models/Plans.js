const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Plan name (e.g., Free, Pro, Premium)
  price: { type: Number, required: true }, // Plan price in USD
  priceId: { type: String, required: true }, // Stripe price ID
  features: [{ type: String }], // List of features
});

const Plans = mongoose.model("Plans", PlanSchema);
module.exports = Plans;
