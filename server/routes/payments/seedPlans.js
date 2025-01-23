const mongoose = require("mongoose");
const Plans = require("../../models/Plans"); // Adjust the path as per your directory structure
require("dotenv").config(); // Ensure access to environment variables

const seedPlans = async () => {
  // Establish a connection to the MongoDB database
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database.");

    // Define the plans to seed
    const plans = [
      {
        name: "Sharpe",
        price: 4.99,
        priceId: "price_1PfQac2LYK3gCcnX2jnYp8du",
        features: [
          "Access to all 150+ industry-used questions",
          "Assistive hints for each question",
          "Basic progress tracking",
          "Detailed solution walkthroughs",
        ],
      },
      {
        name: "Sharpe Yearly",
        price: 49.99,
        priceId: "price_1PrL4B2LYK3gCcnXwaBSR3uB",
        features: [
          "Access to all 150+ industry-used questions",
          "Assistive hints for each question",
          "Basic progress tracking",
          "Detailed solution walkthroughs",
          "Save 17% compared to monthly plans",
          "Yearly access with one-time payment",
        ],
      },
      {
        name: "Pro",
        price: 9.99,
        priceId: "price_1PyaJH2LYK3gCcnXQyg47GM7",
        features: [
          "Access to all 150+ industry-used questions",
          "Assistive hints for each question",
          "Advanced progress analytics",
          "Detailed solution walkthroughs",
          "Applications tracking dashboard",
          "Follow-up questions for each problem",
          "Priority support",
        ],
      },
      {
        name: "Pro Yearly",
        price: 99.99,
        priceId: "price_1PyaL42LYK3gCcnX2coQGFMH",
        features: [
          "Access to all 150+ industry-used questions",
          "Assistive hints for each question",
          "Advanced progress analytics",
          "Detailed solution walkthroughs",
          "Applications tracking dashboard",
          "Follow-up questions for each problem",
          "Priority support",
          "Save 17% compared to monthly plans",
          "Yearly access with one-time payment",
        ],
      },
    ];

    // Clear existing plans
    await Plans.deleteMany();
    console.log("Cleared existing plans.");

    // Insert new plans
    await Plans.insertMany(plans);
    console.log("Plans seeded successfully!");

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding plans:", error);
    mongoose.connection.close();
  }
};

// Run the seeder script
seedPlans();
