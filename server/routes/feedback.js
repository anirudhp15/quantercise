require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-ilo1smhJbfXlKQ2MpMScq3lR", // Optional: Add your organization ID if applicable
});

// Endpoint to get feedback for a solution
router.post("/solution", async (req, res) => {
  const { problemDescription, userSolution, isPaid } = req.body;

  // Determine the model to use based on user plan
  const model = isPaid ? "gpt-4o-mini" : "gpt-3.5-turbo";

  // Construct the prompt
  const prompt = `
  You are an experienced quantitative analyst. Provide feedback on the following solution:
  - Start your response with one of these categories: "strongly wrong", "weakly wrong", "undefined", "weakly right", "strongly right".
  - Be concise and focus only on technical insights.
  - If the solution is correct, confirm briefly with reasoning.
  - If the solution is incorrect, explain errors concisely and provide the correct intuition.
  - If the question doesn't make sense or is uncategorized, simply reply with "This solution makes no sense." and no further explanation.

  Problem: ${problemDescription}
  Solution: ${userSolution}
  `;

  try {
    // Call the OpenAI API for feedback
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI Response:", response);
    // Extract feedback and category from the response
    const fullFeedback =
      response.choices[0]?.message?.content || "No feedback provided.";
    res.json({ feedback: fullFeedback });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);

    // Handle specific OpenAI errors if needed
    if (error.response) {
      console.error("OpenAI Response Error:", error.response.data);
    }

    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

module.exports = router;
