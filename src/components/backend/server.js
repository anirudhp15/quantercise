// /backend/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

const quantPracticeQuestions = require("./data/questions");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/api/problems", (req, res) => {
  res.json(quantPracticeQuestions);
});

app.post("/api/bookmarks", (req, res) => {
  const { problemId } = req.body;
  // Add logic to handle bookmarks
  res.json({ message: "Bookmark saved!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
