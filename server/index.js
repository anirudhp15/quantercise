require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const questionsRoutes = require("./routes/questions");
const applicationsRoute = require("./routes/applications");
const stripeRoutes = require("./routes/stripe"); // Import the new stripe routes
const User = require("./models/User");

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://quantercise.com",
  "https://quantercise-api.vercel.app",
  "https://anirudhp15.github.io/quantercise",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // Automatically includes body-parser for JSON

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Check if the users collection exists and print the documents
    const collections = await mongoose.connection.db.collections();
    const collectionNames = collections.map((col) => col.collectionName);

    if (collectionNames.includes("users")) {
      const users = await mongoose.connection.db
        .collection("users")
        .find({})
        .toArray();
      console.log(
        "Users collection found. Documents in users collection:",
        users
      );
    } else {
      console.log("Users collection does not exist.");
    }
  })
  .catch((err) => console.error("Connection error:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/applications", applicationsRoute);
app.use("/api/stripe", stripeRoutes); // Use the new stripe routes

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
