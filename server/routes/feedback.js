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
  // Get the required parameters from the request body
  const { problemDescription, userSolution, isPro, isDemo = false } = req.body;

  // Basic validation
  if (!problemDescription || !userSolution) {
    return res.status(400).json({
      error: "Missing required parameters: problemDescription or userSolution",
    });
  }

  // Skip authentication check for demo conversations from the landing page
  if (!isDemo) {
    // For regular conversations, ensure user is authenticated
    // ... existing authentication check code ...
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Determine the model to use based on user plan (if isPro is true, use o3-mini, otherwise use gpt-4o-mini for isPro null and false)
  const model = isPro === true ? "o3-mini" : "gpt-4o-mini";

  console.log("model", model);

  try {
    // Construct system prompt
    const systemMessage = `
      You are a friendly, conversational quantitative analyst giving feedback on math solutions.
      
      Guidelines for your responses:
      1. Don't restate the problem - the user knows what they submitted
      2. Focus directly on their work with a conversational tone
      3. Address the user as "you" not "the student"
      4. No bolded section headings or labeled sections - just natural text flow
      5. Start with an assessment of their work, then provide specific feedback
      6. End with the category assessment in brackets [strongly wrong/weakly wrong/undefined/weakly right/strongly right]
      
      Example tone:
      "You've got the right approach with using the capital asset pricing model. Your calculations are correct until the final step, where you missed accounting for the risk-free rate. Try recalculating with rf = 2%. [weakly wrong]"
      
      Important LaTeX formatting requirements:
      - For inline math, use single dollar signs: $x^2 + y^2$
      - For block equations, use double dollar signs: $$FRA = P × (R_c - R_s) × \\frac{days}{360 × 100}$$
      - Ensure all formulas are complete - don't truncate expressions
      - For financial formulas like FRA calculations, write out the full formula with all variables
    `;

    const userMessage = `
      Problem: ${problemDescription}
      Solution: ${userSolution}
    `;

    // Create the streaming ChatCompletion
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    let fullContent = "";
    let categoryExtracted = false;

    // Process the streaming response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (content) {
        // Accumulate the full content
        fullContent += content;

        // Write this chunk out to the client immediately
        res.write(`data: ${content}\n\n`, () => {
          // Force flush after each chunk
          if (res.flush) res.flush();
        });

        // Send periodic snapshots for proper formatting
        // Reduce frequency of snapshots to improve performance
        if (fullContent.length % 20 === 0 && fullContent.length > 0) {
          res.write(
            `event: snapshot\ndata: ${JSON.stringify({
              content: fullContent,
            })}\n\n`,
            () => {
              // Force flush after snapshot
              if (res.flush) res.flush();
            }
          );
        }
      }

      // Attempt to extract category if we haven't already
      if (!categoryExtracted) {
        // Improved regex that handles the category in various positions
        // including at the end of the text (which is the new format)
        const categoryMatch = fullContent.match(
          /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/i
        );
        if (categoryMatch) {
          categoryExtracted = true;
          const category = categoryMatch[1].toLowerCase();
          // Send category event to frontend
          res.write(`event: category\ndata: ${category}\n\n`, () => {
            // Force flush after category event
            if (res.flush) res.flush();
          });

          // Do NOT remove the category tag from the content anymore
          // This allows it to be highlighted in the UI naturally
          fullContent = fullContent.replace(categoryMatch[0], "").trim();
        }
      }
    }

    // Send a final snapshot with the complete content
    res.write(
      `event: snapshot\ndata: ${JSON.stringify({
        content: fullContent,
        final: true,
      })}\n\n`,
      () => {
        // Force flush final snapshot
        if (res.flush) res.flush();
      }
    );

    // Send the done event
    res.write(`event: done\ndata: [DONE]\n\n`, () => {
      // Force flush done event
      if (res.flush) res.flush();
    });
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
  const model = isPro ? "gpt-4o" : "gpt-4o-mini";

  try {
    const systemMessage = `
      You are a friendly, conversational quantitative analyst giving feedback on math solutions.
      
      Guidelines for your responses:
      1. Don't restate the problem - the user knows what they submitted
      2. Focus directly on their work with a conversational tone
      3. Address the user as "you" not "the student"
      4. No bolded section headings or labeled sections - just natural text flow
      5. Start with an assessment of their work, then provide specific feedback
      6. End with the category assessment in brackets [strongly wrong/weakly wrong/undefined/weakly right/strongly right]
      
      Example tone:
      "You've got the right approach with using the capital asset pricing model. Your calculations are correct until the final step, where you missed accounting for the risk-free rate. Try recalculating with rf = 2%. [weakly wrong]"
      
      Important LaTeX formatting requirements:
      - For inline math, use single dollar signs: $x^2 + y^2$
      - For block equations, use double dollar signs: $$FRA = P × (R_c - R_s) × \\frac{days}{360 × 100}$$
      - Ensure all formulas are complete - don't truncate expressions
      - For financial formulas like FRA calculations, write out the full formula with all variables
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
  const model = isPro ? "gpt-4o" : "gpt-4o-mini";

  try {
    // Choose the appropriate system prompt based on the message type
    let systemPrompt;

    if (messageType === "question") {
      systemPrompt = `You are a friendly, conversational quantitative analyst.
      
      Guidelines for answering questions:
      1. Answer directly without restating the question
      2. Address the user as "you" in a natural, conversational tone
      3. Don't use any section headings or labeled segments - flow naturally like ChatGPT
      4. Make your explanation clear and concise
      
      Example tone: 
      "The Black-Scholes model uses several key assumptions. First, it assumes markets are efficient with no transaction costs. Second, it assumes stock prices follow a lognormal distribution. You're right that volatility is a crucial parameter - it represents the standard deviation of the stock's returns."
      
      Important LaTeX formatting requirements:
      - For inline math, use single dollar signs: $x^2 + y^2$
      - For block equations, use double dollar signs: $$FRA = P × (R_c - R_s) × \\frac{days}{360 × 100}$$
      - Ensure all formulas are complete - don't truncate expressions
      - For financial formulas like FRA calculations, write out the full formula with all variables
      `;
    } else {
      systemPrompt = `You are a friendly, conversational quantitative analyst.
      
      Guidelines for explaining concepts:
      1. Don't restate the problem - the user knows what they asked
      2. Address the user directly as "you" in a natural, conversational tone
      3. Don't use any section headings or labeled segments - flow naturally like ChatGPT
      4. Start with a direct explanation, then step through any calculations naturally
      5. Emphasize key results and insights where relevant
      
      Example tone:
      "To calculate the forward rate agreement payoff, you need to apply the formula that accounts for the difference between the contract rate and settlement rate. Let me walk you through it step by step. First, we calculate the difference between rates..."
      
      Important LaTeX formatting requirements:
      - For inline math, use single dollar signs: $x^2 + y^2$
      - For block equations, use double dollar signs: $$FRA = P × (R_c - R_s) × \\frac{days}{360 × 100}$$
      - Ensure all formulas are complete - don't truncate expressions
      - For financial formulas like FRA calculations, write out the full formula with all variables
      `;
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
