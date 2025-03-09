import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

/**
 * Custom hook for managing demo conversation history with the chatbot
 * for anonymous users on the landing page
 *
 * @param {string} problemId - ID of the current problem
 * @param {object} problemMetadata - Additional metadata about the problem
 * @returns {object} Demo conversation history management functions and state
 */
export const useDemoConversationHistory = (problemId, problemMetadata = {}) => {
  const [demoConversationId, setDemoConversationId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Add state to prevent multiple concurrent conversation creations
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  // Use a ref to keep track of pending conversation creation
  const pendingConversationPromise = useRef(null);

  // Initialize or generate session ID on first load
  useEffect(() => {
    // Try to load existing session ID from localStorage
    const storedSessionId = localStorage.getItem("demo_session_id");

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate a new session ID and store it
      const newSessionId = uuidv4();
      localStorage.setItem("demo_session_id", newSessionId);
      setSessionId(newSessionId);
    }

    setInitialized(true);
  }, []);

  // Reset conversation when problemId changes (user selects a new problem)
  useEffect(() => {
    if (problemId) {
      console.log(
        "Problem ID changed, resetting conversation state",
        problemId
      );
      setDemoConversationId(null);
      setConversationHistory([]);
      setError(null);
      pendingConversationPromise.current = null;
      setIsCreatingConversation(false);
    }
  }, [problemId]);

  // Start a new demo conversation
  const startNewDemoConversation = useCallback(
    async (role, content) => {
      // If already creating a conversation, return the pending promise
      if (isCreatingConversation && pendingConversationPromise.current) {
        return pendingConversationPromise.current;
      }

      // If already have a conversation ID, just return it
      if (demoConversationId) {
        return demoConversationId;
      }

      if (!sessionId || !problemId) {
        console.log(
          "Missing required data for demo conversation initialization",
          {
            sessionId,
            problemId,
          }
        );
        return null;
      }

      // Make sure required parameters have default values
      const safeRole = role || "user";
      const safeContent = content || "Started a new demo conversation";

      // Check if we already have an existing conversation for this session & problem
      // before creating a new one
      try {
        console.log(
          "Checking for existing conversations before creating a new one"
        );
        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/conversations/demo/session/${sessionId}`
        );

        const { demoConversations } = response.data;

        // Find the most recent conversation for this problem
        const existingConversation = demoConversations.find(
          (conv) => conv.problemId === problemId
        );

        if (existingConversation) {
          setDemoConversationId(existingConversation._id);
          // If there are messages, load them
          if (
            existingConversation.messages &&
            existingConversation.messages.length > 0
          ) {
            setConversationHistory(existingConversation.messages);
          }
          return existingConversation._id;
        }
      } catch (err) {
        console.log("Error checking for existing conversations:", err.message);
        // Continue with creation if check fails
      }

      setIsCreatingConversation(true);
      setLoading(true);
      setError(null);

      // Create a new promise and store it in the ref
      pendingConversationPromise.current = (async () => {
        try {
          const response = await axios.post(
            `${BACKEND_DOMAIN}/api/conversations/demo`,
            {
              sessionId,
              problemId,
              initialMessage: {
                role: safeRole,
                content: safeContent,
                messageType: "other",
              },
              metadata: {
                problemTitle: problemMetadata.title || "",
                problemDifficulty: problemMetadata.difficulty || "",
                problemCategory: problemMetadata.category || "",
              },
            }
          );

          const newDemoConversationId = response.data.demoConversationId;

          // Store the id in state for future use
          setDemoConversationId(newDemoConversationId);
          setConversationHistory([
            {
              role: safeRole,
              content: safeContent,
              messageType: "other",
              timestamp: new Date(),
            },
          ]);

          setLoading(false);
          setIsCreatingConversation(false);

          // Return the ID for immediate use
          return newDemoConversationId;
        } catch (err) {
          console.error("Error starting new demo conversation:", err);
          setError(err.message || "Failed to start demo conversation");
          setLoading(false);
          setIsCreatingConversation(false);
          return null;
        }
      })();

      return pendingConversationPromise.current;
    },
    [
      sessionId,
      problemId,
      problemMetadata,
      demoConversationId,
      isCreatingConversation,
    ]
  );

  // Add a message to the current demo conversation
  const addMessage = useCallback(
    async ({ role, content, messageType = "other" }) => {
      let currentConversationId = demoConversationId;

      console.log(
        `Adding message to conversation. Have ID: ${Boolean(
          currentConversationId
        )}`,
        { role, messageType, contentLength: content?.length || 0 }
      );

      // If we don't have a conversation ID yet, create one
      if (!currentConversationId) {
        console.log(
          "No existing conversation ID, creating new entry in database"
        );
        // Pass the message details to the startNewDemoConversation function
        currentConversationId = await startNewDemoConversation(role, content);

        // If we still couldn't create a conversation, return false
        if (!currentConversationId) {
          console.error("Failed to create new conversation for message");
          return false;
        }

        // Important: Since this is asynchronous, we need to check if another process
        // already added a message while we were creating the conversation
        if (
          conversationHistory.some(
            (msg) =>
              msg.role === role &&
              msg.content === content &&
              msg.messageType === messageType
          )
        ) {
          console.log("Message already added, skipping duplicate");
          return true;
        }
      }

      // Add message to local state first to prevent race conditions
      const message = {
        role,
        content,
        messageType,
        timestamp: new Date(),
      };

      // Optimistically update the UI
      setConversationHistory((prev) => [...prev, message]);

      setLoading(true);
      try {
        // Use the current conversation ID (either from state or from the creation)
        await axios.post(
          `${BACKEND_DOMAIN}/api/conversations/demo/${currentConversationId}/messages`,
          { message }
        );

        console.log("Message added successfully to conversation");
        setLoading(false);
        return true;
      } catch (err) {
        console.error(
          `Error adding message to demo conversation ${currentConversationId}:`,
          err
        );
        setError(err.message || "Failed to add message to demo conversation");
        setLoading(false);
        return false;
      }
    },
    [demoConversationId, startNewDemoConversation, conversationHistory]
  );

  // Load existing demo conversation if available
  useEffect(() => {
    const loadExistingConversation = async () => {
      if (!sessionId || !problemId || !initialized || isCreatingConversation) {
        return;
      }

      // If we already have a conversation ID, no need to load
      if (demoConversationId) {
        return;
      }

      setLoading(true);
      try {
        // Try to find an existing conversation for this session and problem
        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/conversations/demo/session/${sessionId}`
        );

        const { demoConversations } = response.data;

        // Find the most recent conversation for this problem
        const relevantConversation = demoConversations.find(
          (conv) => conv.problemId === problemId
        );

        if (relevantConversation) {
          setDemoConversationId(relevantConversation._id);
          setConversationHistory(relevantConversation.messages || []);
        } else {
          // No existing conversation found, but don't automatically start one
          // We'll create one when the user actually submits something
        }
      } catch (err) {
        console.error("Error loading existing demo conversation:", err);
        setError(err.message || "Failed to load demo conversation");
        // Don't auto-create on error - wait for user action
      } finally {
        setLoading(false);
      }
    };

    loadExistingConversation();
  }, [
    sessionId,
    problemId,
    initialized,
    demoConversationId,
    isCreatingConversation,
  ]);

  return {
    demoConversationId,
    sessionId,
    conversationHistory,
    loading,
    error,
    addMessage,
    startNewDemoConversation,
    resetConversation: useCallback(() => {
      console.log(
        "Resetting demo conversation state - will create new entry on next interaction"
      );
      // Setting the demoConversationId to null is the key action here
      // This ensures that on the next message/submission, a new conversation
      // will be created in the database instead of appending to an existing one
      setDemoConversationId(null);
      setConversationHistory([]);
      setError(null);
      pendingConversationPromise.current = null;
      setIsCreatingConversation(false);

      // No need to make any API calls here - we'll create a new conversation
      // when the user submits their next answer
    }, []),
  };
};

export default useDemoConversationHistory;
