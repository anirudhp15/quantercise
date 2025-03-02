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
router.post("/solution-stream", async (req, res) => {
  const { problemDescription, userSolution, isPro } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Determine the model to use based on user plan
  // Use models that support streaming
  const model = isPro ? "gpt-4-turbo-preview" : "gpt-3.5-turbo";

  try {
    // Construct system message for categorization
    const systemMessage = `
      You are an experienced quantitative analyst evaluating solutions to quantitative problems.
      First, determine if the solution is:
      - strongly wrong (completely incorrect approach and answer)
      - weakly wrong (partially correct approach but wrong answer)
      - undefined (cannot be evaluated or makes no sense)
      - weakly right (correct approach with minor errors)
      - strongly right (completely correct approach and answer)
      
      Then provide helpful, concise feedback explaining why the solution is correct or incorrect.
      Begin your response with one of these category labels in brackets, for example: [strongly right]
      Then provide your feedback explanation.
    `;

    const userMessage = `
      Problem: ${problemDescription}
      Solution: ${userSolution}
    `;

    // Create a streaming completion
    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    let fullContent = "";

    // Process the stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;

        // Send each chunk to the client
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Determine category from the response
    let category = "undefined";
    const categoryMatch = fullContent.match(
      /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/i
    );

    if (categoryMatch) {
      category = categoryMatch[1].toLowerCase();
      // Clean up the response by removing the category tag
      fullContent = fullContent.replace(categoryMatch[0], "").trim();
    }

    // Send the category as a special event
    res.write(
      `event: category\ndata: ${JSON.stringify({
        category: category,
      })}\n\n`
    );

    // End the stream
    res.write(`event: done\ndata: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);

    if (error.response) {
      console.error("OpenAI Response Error:", error.response.data);
    }

    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: "Failed to generate feedback.",
      })}\n\n`
    );
    res.end();
  }
});

// Standard non-streaming endpoint for backward compatibility
router.post("/solution", async (req, res) => {
  const { problemDescription, userSolution, isPro } = req.body;

  // Determine the model to use based on user plan
  const model = isPro ? "gpt-4-turbo-preview" : "gpt-3.5-turbo";

  try {
    // Construct system message for categorization
    const systemMessage = `
      You are an experienced quantitative analyst evaluating solutions to quantitative problems.
      First, determine if the solution is:
      - strongly wrong (completely incorrect approach and answer)
      - weakly wrong (partially correct approach but wrong answer)
      - undefined (cannot be evaluated or makes no sense)
      - weakly right (correct approach with minor errors)
      - strongly right (completely correct approach and answer)
      
      Then provide helpful, concise feedback explaining why the solution is correct or incorrect.
      Format your response as a JSON object with two fields:
      {
        "category": "one of: strongly wrong, weakly wrong, undefined, weakly right, strongly right",
        "feedback": "your detailed feedback here"
      }
    `;

    const userMessage = `
      Problem: ${problemDescription}
      Solution: ${userSolution}
    `;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const responseText = response.choices[0]?.message?.content || "";

    // Try to parse as JSON first
    try {
      const jsonResponse = JSON.parse(responseText);
      res.json(jsonResponse);
    } catch (parseError) {
      // If not valid JSON, extract category and return structured response
      let category = "undefined";
      let feedback = responseText;

      const categoryMatch = responseText.match(
        /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/i
      );

      if (categoryMatch) {
        category = categoryMatch[1].toLowerCase();
        feedback = responseText.replace(categoryMatch[0], "").trim();
      }

      res.json({
        category: category,
        feedback: feedback,
      });
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

module.exports = router;
