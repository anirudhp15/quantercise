require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-ilo1smhJbfXlKQ2MpMScq3lR", // Optional: Add your organization ID if applicable
});

// -------------------------
// 1) STREAMING ENDPOINT
// -------------------------
router.post("/solution-stream", async (req, res) => {
  const { problemDescription, userSolution, isPro } = req.body;

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Determine the model to use based on user plan
  const model = isPro ? "gpt-4o-mini" : "gpt-3.5-turbo";

  try {
    // Construct system prompt
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
      
      When your response includes mathematical expressions or equations:
      - Use LaTeX syntax with single $ delimiters for inline expressions (e.g. $x^2 + y^2$)
      - Use double $$ delimiters for block equations (e.g. $$\\sum_{i=1}^{n} i$$)
      - Ensure proper escaping of LaTeX special characters
    `;

    const userMessage = `
      Problem: ${problemDescription}
      Solution: ${userSolution}
    `;

    // Create the streaming ChatCompletion
    const stream = await openai.chat.completions.create(
      {
        model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }
      // In @4.x, no need for { responseType: "stream" } – that's for axios v3.x
    );

    let fullContent = "";
    let categoryExtracted = false;

    // Process chunks as they arrive
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullContent += content;

      // Write this chunk out to the client immediately
      res.write(`data: ${content}\n\n`);
      console.log(content);

      if (fullContent.length % 10 <= 2 && fullContent.length > 0) {
        res.write(
          `event: snapshot\ndata: ${JSON.stringify({
            content: fullContent,
          })}\n\n`
        );
      }

      // Attempt to extract category if we haven't already
      if (!categoryExtracted) {
        const categoryMatch = fullContent.match(
          /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/
        );
        if (categoryMatch) {
          categoryExtracted = true;
          const category = categoryMatch[1].toLowerCase();
          // Send category event to frontend
          res.write(`event: category\ndata: ${category}\n\n`);
          // Remove category tag from fullContent
          fullContent = fullContent.replace(categoryMatch[0], "").trim();
        }
      }
    }

    res.write(
      `event: snapshot\ndata: ${JSON.stringify({
        content: fullContent,
        final: true,
      })}\n\n`
    );

    // When the stream finishes, signal completion
    // (We can also do a SSE "event: done" if you like.)
    res.write(`event: done\ndata: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    if (error.response) {
      console.error("OpenAI Response Error:", error.response.data);
    }

    // SSE error event
    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: "Failed to generate feedback.",
      })}\n\n`
    );
    res.end();
  }
});

// -------------------------
// 2) NON-STREAMING ENDPOINT
// -------------------------
router.post("/solution", async (req, res) => {
  const { problemDescription, userSolution, isPro } = req.body;
  const model = isPro ? "gpt-4o-mini" : "gpt-3.5-turbo";

  try {
    const systemMessage = `
      You are an experienced quantitative analyst evaluating solutions...
      (etc.)
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

    // Attempt to parse as JSON
    try {
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch {
      // If it's not valid JSON, do fallback
      let category = "undefined";
      let feedback = responseText;

      const categoryMatch = responseText.match(
        /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/i
      );

      if (categoryMatch) {
        category = categoryMatch[1].toLowerCase();
        feedback = responseText.replace(categoryMatch[0], "").trim();
      }

      res.json({ category, feedback });
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

// New endpoint for follow-up explanations and questions
router.post("/explain-further", async (req, res) => {
  const {
    message,
    messageType = "explanation",
    conversationHistory,
    userPlan,
  } = req.body;

  // Determine if the user has reached their explanation limit (only for explanation requests)
  const isPro = userPlan === "pro";
  const isSharpe = userPlan === "sharpe";
  const maxExplanations = isPro || isSharpe ? Infinity : 3;

  // Count previous explanations (excluding the initial feedback and user messages)
  const previousExplanations =
    conversationHistory && Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (msg) => msg.role === "assistant" && msg.type === "explanation"
        ).length
      : 0;

  // Only check limits for explanation requests, not questions
  if (
    messageType === "explanation" &&
    previousExplanations >= maxExplanations &&
    !isPro &&
    !isSharpe
  ) {
    return res.status(403).json({
      error: "Explanation limit reached",
      message: "Upgrade to Sharpe or Pro for unlimited explanations.",
    });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Determine the model based on user plan
  const model = isPro ? "gpt-4o-mini" : "gpt-3.5-turbo";

  try {
    // Choose the appropriate system prompt based on the message type
    let systemPrompt;

    if (messageType === "question") {
      systemPrompt = `You are an experienced quantitative analyst providing educational responses to questions.
      You're engaging in a conversation about a quantitative problem.
      
      Answer the student's question with:
      1. Clear, concise explanations
      2. Relevant examples if helpful
      3. Proper mathematical notation using LaTeX
      
      If the question is unrelated to quantitative concepts or the problem at hand:
      - Politely redirect the student to ask relevant questions
      - Do not answer questions that are completely off-topic, inappropriate, or seeking solutions to unrelated problems
      
      When your response includes mathematical expressions or equations:
      - Use LaTeX syntax with single $ delimiters for inline expressions, e.g., $x^2 + y^2 = z^2$
      - Use double $$ delimiters for block equations, e.g., $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
      - Ensure proper escaping of LaTeX special characters`;
    } else {
      systemPrompt = `You are an experienced quantitative analyst providing educational explanations.
      You're continuing a conversation about a quantitative problem.
      
      Review the previous explanations and provide a more detailed explanation that:
      1. Addresses any misconceptions in the student's approach
      2. Explains the correct methodology step-by-step
      3. Shows the working clearly with appropriate LaTeX formatting
      
      When your response includes mathematical expressions or equations:
      - Use LaTeX syntax with single $ delimiters for inline expressions, e.g., $x^2 + y^2 = z^2$
      - Use double $$ delimiters for block equations, e.g., $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
      - Ensure proper escaping of LaTeX special characters
      
      Make your explanation educational, clear, and build on any previous explanations.`;
    }

    // Construct the conversation for the API
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

    // For questions, we don't need to re-add the problem description
    if (messageType !== "question") {
      messages.push({
        role: "user",
        content: `Problem: ${message}`,
      });
    }

    // Add the conversation history
    conversationHistory.forEach((message) => {
      messages.push({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content,
      });
    });

    // Create a streaming completion
    const stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      stream: true,
    });

    // Track the full accumulated content
    let fullContent = "";

    // Process the stream using the recommended approach
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (content) {
        // Accumulate the full content
        fullContent += content;

        // Send each chunk directly to the client
        res.write(`data: ${content}\n\n`);

        // Send periodic snapshots for proper formatting
        if (fullContent.length % 50 <= 5 && fullContent.length > 0) {
          res.write(
            `event: snapshot\ndata: ${JSON.stringify({
              content: fullContent,
            })}\n\n`
          );
        }
      }
    }

    // Send a final snapshot with the complete content
    res.write(
      `event: snapshot\ndata: ${JSON.stringify({
        content: fullContent,
        final: true,
      })}\n\n`
    );

    // Send the done event
    res.write(`event: done\ndata: done\n\n`);
    res.end();
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);

    if (error.response) {
      console.error("OpenAI Response Error:", error.response.data);
    }

    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: "Failed to generate explanation.",
      })}\n\n`
    );
    res.end();
  }
});

module.exports = router;
