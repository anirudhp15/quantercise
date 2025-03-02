require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const questionsRoutes = require("./routes/questions");
const applicationsRoute = require("./routes/applications");
const stripeRoutes = require("./routes/payments/stripe");
const progressRoutes = require("./routes/progress");
const feedbackRoutes = require("./routes/feedback");
const paymentRoutes = require("./routes/payments/payment");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // Dynamically allow the requesting origin
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://quantercise.com",
  "https://quantercise-api.vercel.app",
  "https://anirudhp15.github.io/quantercise",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
// app.use(express.static("public"));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.collections();
    const collectionNames = collections.map((col) => col.collectionName);

    if (collectionNames.includes("users")) {
      const users = await mongoose.connection.db
        .collection("users")
        .find({})
        .toArray();
      console.log(
        "Users collection found. Number of Registered Users:",
        users.length
      );
      console.log("Users collection:", users);
    } else {
      console.log("Users collection does not exist.");
    }
  })
  .catch((err) => console.error("Connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/applications", applicationsRoute);
app.use("/api/stripe", stripeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Quantercise API",
    description:
      "Quantercise is your platform for mastering quant finance skills and tracking progress.",
    version: "1.0.0", // Update this dynamically from package.json if needed
    uptime: process.uptime(), // Include server uptime
    documentation: "https://quantercise.com/docs",
    contact: {
      email: "support@quantercise.com",
      website: "https://quantercise.com",
    },
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
