import { useState, useEffect, useRef } from "react";
import { useConversationHistory } from "../useConversationHistory/useConversationHistory";
import { useDemoConversationHistory } from "../useConversationHistory/useDemoConversationHistory";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

export const useFeedback = (
  isDemo = false,
  problemId = null,
  problemMetadata = {}
) => {
  const chatContainerRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState({
    heading: "NO FEEDBACK",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
    icon: "⚪️",
    description: "Submit your answer to receive feedback",
  });
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [explanationCount, setExplanationCount] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Always call both hooks unconditionally (React Hook rules)
  const regularConversation = useConversationHistory();
  const demoConversation = useDemoConversationHistory(
    problemId,
    problemMetadata
  );

  // Then conditionally choose which one to use based on isDemo flag
  const { addMessage, conversationId } = isDemo
    ? demoConversation
    : regularConversation;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const categorizeFeedback = (category) => {
    if (!category) {
      return {
        heading: "NO FEEDBACK",
        color: "text-gray-400",
        bgColor: "bg-gray-800",
        icon: "⚪️",
        description: "Submit your answer to receive feedback",
      };
    }

    switch (category.toLowerCase()) {
      case "strongly wrong":
        return {
          heading: "STRONGLY WRONG",
          color: "text-red-500",
          bgColor: "bg-red-950/80",
          icon: "❌",
          description: "Your solution has significant errors",
        };
      case "weakly wrong":
        return {
          heading: "WEAKLY WRONG",
          color: "text-yellow-500",
          bgColor: "bg-yellow-950/80",
          icon: "⚠️",
          description: "Your solution has minor errors",
        };
      case "undefined":
        return {
          heading: "UNABLE TO EVALUATE",
          color: "text-gray-400",
          bgColor: "bg-gray-800",
          icon: "❓",
          description: "Your solution couldn't be properly evaluated",
        };
      case "weakly right":
        return {
          heading: "PARTIALLY CORRECT",
          color: "text-yellow-300",
          bgColor: "bg-yellow-950/80",
          icon: "🟡",
          description: "Your solution is mostly correct",
        };
      case "strongly right":
        return {
          heading: "CORRECT",
          color: "text-green-400",
          bgColor: "bg-green-950/80",
          icon: "✅",
          description: "Your solution is completely correct",
        };
      default:
        return {
          heading: "WRONG ANSWER",
          color: "text-red-500",
          bgColor: "bg-red-950/80",
          icon: "❌",
          description: "Your solution contains significant errors",
        };
    }
  };

  const fetchFeedback = async (problemDescription, userSolution, isPro) => {
    // Prevent multiple submissions while processing
    if (loading || isStreaming) {
      console.log("Ignoring duplicate feedback request - already processing");
      return;
    }

    setLoading(true);
    setFeedback(""); // Reset feedback
    setIsComplete(false);
    setIsStreaming(true); // Set streaming mode immediately
    setFeedbackCategory(categorizeFeedback(null)); // Reset to default

    // Reset local conversation history when a new solution is submitted
    setConversationHistory([]);
    setExplanationCount(0);

    try {
      // Add user message to local conversation history immediately
      const userMessage = {
        role: "user",
        type: "answer",
        content: userSolution,
      };

      setConversationHistory([userMessage]);

      // Save the user message to the appropriate database based on isDemo
      const messageAdded = await addMessage({
        role: "user",
        content: userSolution,
        messageType: "answer",
      });

      // If message couldn't be added (e.g., couldn't create conversation), don't proceed
      if (isDemo && !messageAdded) {
        throw new Error("Could not initialize conversation. Please try again.");
      }

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/feedback/solution-stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemDescription,
            userSolution,
            isPro,
            isDemo,
          }),
        }
      );

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again in a moment.");
        } else if (response.status === 500) {
          throw new Error("Server error. Our team has been notified.");
        } else if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication error. Please log in again.");
        }
        throw new Error(`Server error: ${response.status}`);
      }

      // Use the EventSource API for more efficient SSE handling
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedFeedback = "";
      let lastContent = ""; // Track the last content for incremental updates

      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          // Handle regular data events - MUST come first for real-time typing effect
          if (line.startsWith("data:")) {
            try {
              const content = line.substring(5).trim();
              // Immediately update the displayed text with each new chunk for a streaming effect
              accumulatedFeedback += content;
              setFeedback(accumulatedFeedback);

              // Auto-scroll if enabled
              if (chatContainerRef.current && !isUserScrolling) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
              }

              continue;
            } catch (e) {
              console.error("Error parsing data content:", e);
            }
          }

          // Check if it's a snapshot event (for complete content rendering)
          if (line.startsWith("event: snapshot")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const snapshotData = JSON.parse(dataLine.substring(6).trim());
                // Use the snapshot for rendering to ensure proper formatting
                accumulatedFeedback = snapshotData.content;
                setFeedback(accumulatedFeedback);

                // Auto-scroll if enabled
                if (chatContainerRef.current && !isUserScrolling) {
                  chatContainerRef.current.scrollTop =
                    chatContainerRef.current.scrollHeight;
                }
              } catch (e) {
                console.error("Error parsing snapshot data:", e);
              }
            }
            continue;
          }

          // Check if it's a category event
          if (line.startsWith("event: category")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const category = dataLine.substring(6).trim();
                const categoryObj = categorizeFeedback(category);
                setFeedbackCategory(categoryObj);
              } catch (e) {
                console.error("Error parsing category data:", e);
              }
            }
            continue;
          }

          // Check if it's a done event
          if (line.startsWith("event: done")) {
            const assistantMessage = {
              role: "assistant",
              type: "feedback",
              content: accumulatedFeedback,
            };

            setConversationHistory((prev) => [...prev, assistantMessage]);

            // Save the AI response to the database - IMPORTANT to use the same conversation
            const assistantMessageAdded = await addMessage({
              role: "assistant",
              content: accumulatedFeedback,
              messageType: "feedback",
            });

            if (isDemo && !assistantMessageAdded) {
              console.warn(
                "Failed to add assistant message to demo conversation"
              );
            }

            setTimeout(() => {
              setIsComplete(true);
              setIsStreaming(false);
            }, 50);

            continue;
          }

          // Check if it's an error event
          if (line.startsWith("event: error")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const errorData = JSON.parse(dataLine.substring(6).trim());
                const errorMessage =
                  errorData.error || "Unknown error occurred";
                setFeedback(errorMessage);
                setIsComplete(true);
                setIsStreaming(false);

                // Add error message to conversation history
                const errorAssistantMessage = {
                  role: "assistant",
                  type: "feedback",
                  content: errorMessage,
                };

                setConversationHistory((prev) => [
                  ...prev,
                  errorAssistantMessage,
                ]);
              } catch (e) {
                console.error("Error parsing error data:", e);
                const errorMessage = dataLine.substring(6).trim();
                setFeedback(`Error: ${errorMessage}`);
              }
            }
            continue;
          }
        }
      }

      // Return the final feedback and category for the parent component
      return {
        content: accumulatedFeedback,
        category: feedbackCategory.heading,
      };
    } catch (error) {
      console.error("Error fetching feedback:", error);

      // Provide a more specific error message
      const errorMessage =
        error.message ||
        "Sorry, there was an error processing your solution. Please try again.";

      setFeedbackCategory(categorizeFeedback("undefined"));
      setFeedback(errorMessage);
      setIsComplete(true);
      setIsStreaming(false);

      // Add error message to conversation history
      const errorAssistantMessage = {
        role: "assistant",
        type: "feedback",
        content: errorMessage,
      };

      setConversationHistory((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFurtherExplanation = async (
    message,
    messageType = "explanation",
    userPlan
  ) => {
    if (!message.trim()) {
      console.error("Empty message provided to fetchFurtherExplanation");
      return;
    }

    // First add the user's question/explanation request to conversation history
    const userMessage = {
      role: "user",
      type: messageType,
      content: message,
    };

    // Update conversation history with the user's message
    const updatedConversationHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedConversationHistory);

    setLoading(true);
    setIsStreaming(true);
    setFeedback(""); // Reset feedback for new streaming content

    // Track explanations for free users (only count actual explanation requests, not questions)
    if (messageType === "explanation" && userPlan === "free") {
      setExplanationCount((prev) => prev + 1);
    }

    try {
      // Add user message to local conversation history
      const userMessage = {
        role: "user",
        type: messageType,
        content: message,
      };

      setConversationHistory((prev) => [...prev, userMessage]);

      // Save the user message to the database
      await addMessage({
        role: "user",
        content: message,
        messageType: messageType,
      });

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/feedback/explain-further`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            messageType,
            userPlan,
            conversationHistory: updatedConversationHistory, // Pass the updated conversation history
          }),
        }
      );

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 403) {
          throw new Error(
            "You've reached your explanation limit. Please upgrade your plan for unlimited explanations."
          );
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedExplanation = "";
      let lastContent = ""; // Track the last content for cursor effect

      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          // Handle regular data events - MUST come first for real-time typing effect
          if (line.startsWith("data:")) {
            try {
              const content = line.substring(5).trim();
              // Immediately update the displayed text with each new chunk for a streaming effect
              accumulatedExplanation += content;
              setFeedback(accumulatedExplanation);

              // Auto-scroll if enabled
              if (chatContainerRef.current && !isUserScrolling) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
              }

              continue;
            } catch (e) {
              console.error("Error parsing data content:", e);
            }
          }

          // Check if it's a snapshot event (for complete content rendering)
          if (line.startsWith("event: snapshot")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const snapshotData = JSON.parse(dataLine.substring(6).trim());
                // Use the snapshot for rendering to ensure proper formatting
                accumulatedExplanation = snapshotData.content;
                setFeedback(accumulatedExplanation);

                // Auto-scroll if enabled
                if (chatContainerRef.current && !isUserScrolling) {
                  chatContainerRef.current.scrollTop =
                    chatContainerRef.current.scrollHeight;
                }
              } catch (e) {
                console.error("Error parsing snapshot data:", e);
              }
            }
            continue;
          }

          // Check if it's a done event
          if (line.startsWith("event: done")) {
            const assistantMessage = {
              role: "assistant",
              type: messageType,
              content: accumulatedExplanation,
            };

            setConversationHistory((prev) => [...prev, assistantMessage]);

            // Save the AI response to the database
            await addMessage({
              role: "assistant",
              content: accumulatedExplanation,
              messageType: messageType,
            });

            setTimeout(() => {
              setIsComplete(true);
              setIsStreaming(false);
            }, 50);

            continue;
          }

          // Check if it's an error event
          if (line.startsWith("event: error")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const errorData = JSON.parse(dataLine.substring(6).trim());
                const errorMessage =
                  errorData.error || "Unknown error occurred";
                setFeedback(errorMessage);
                setIsComplete(true);
                setIsStreaming(false);

                // Add error message to conversation history
                const errorAssistantMessage = {
                  role: "assistant",
                  type: messageType,
                  content: errorMessage,
                };

                setConversationHistory((prev) => [
                  ...prev,
                  errorAssistantMessage,
                ]);
              } catch (e) {
                console.error("Error parsing error data:", e);
                const errorMessage = dataLine.substring(6).trim();
                setFeedback(`Error: ${errorMessage}`);
              }
            }
            continue;
          }
        }
      }

      // Return the final explanation for the parent component
      return {
        content: accumulatedExplanation,
        type: messageType,
      };
    } catch (error) {
      console.error("Error fetching explanation:", error);

      // Provide a more specific error message
      const errorMessage =
        error.message ||
        "Sorry, there was an error processing your request. Please try again.";
      setFeedback(errorMessage);

      setIsComplete(true);
      setIsStreaming(false);

      // Add error message to conversation history
      const errorAssistantMessage = {
        role: "assistant",
        type: messageType,
        content: errorMessage,
      };

      setConversationHistory((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const resetExplanation = () => {
    setFeedback("");
    setIsComplete(false);
  };

  const resetFeedback = () => {
    console.log(
      "Resetting feedback state - preparing for new conversation entry in database"
    );
    setFeedback("");
    setFeedbackCategory({
      heading: "NO FEEDBACK",
      color: "text-gray-400",
      bgColor: "bg-gray-800",
      icon: "⚪️",
      description: "Submit your answer to receive feedback",
    });
    setIsComplete(false);
    setIsStreaming(false);
    setConversationHistory([]);
    setExplanationCount(0);

    // If in demo mode, also reset the demo conversation state
    // This will ensure a new database entry is created on next submission
    if (isDemo && demoConversation.resetConversation) {
      demoConversation.resetConversation();
    }
  };

  return {
    feedback,
    isStreaming,
    conversationHistory,
    chatContainerRef,
    feedbackCategory,
    isAnswerIncorrect: feedbackCategory.heading.includes("WRONG"),
    isComplete,
    loadingFeedback: loading,
    explanationCount,
    isExplanationLimitReached: explanationCount >= 3,
    fetchFeedback,
    fetchFurtherExplanation,
    resetExplanation,
    resetFeedback,
    scrollToBottom,
    conversationId,
    addMessage,
    isDemo,
    demoConversationId: isDemo ? demoConversation.demoConversationId : null,
    sessionId: isDemo ? demoConversation.sessionId : null,
  };
};
