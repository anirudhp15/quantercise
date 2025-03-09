import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { useFetchMongoId } from "../useFetch/useFetchMongoId";

/**
 * Custom hook for managing conversation history with the Qube chatbot
 *
 * @param {string} questionId - ID of the current question/problem
 * @param {object} questionMetadata - Additional metadata about the question
 * @returns {object} Conversation history management functions and state
 */
export const useConversationHistory = (questionId, questionMetadata = {}) => {
  const [mongoId, setMongoId] = useState(null);
  const { currentUser } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [progressData, setProgressData] = useState(null);
  useFetchMongoId(currentUser, setMongoId);

  // Initialize or retrieve conversation when component mounts
  useEffect(() => {
    const initializeConversation = async () => {
      if (!currentUser?.email || !mongoId || !questionId) {
        console.log("Missing required data for conversation initialization", {
          userId: mongoId,
          questionId,
        });
        setInitialized(true);
        return;
      }

      setLoading(true);
      try {
        // First, check if there's an existing progress for this user and question
        const progressResponse = await axios.get(
          `/api/progress/user/${mongoId}/question/${questionId}`
        );

        const progress = progressResponse.data.progress;
        setProgressData(progress);

        // If we have an active conversation, use it
        if (progress?.activeConversationId) {
          if (typeof progress.activeConversationId === "object") {
            // If the conversation was populated in the response
            setConversationId(progress.activeConversationId._id);

            // Sort messages by timestamp before setting state
            const sortedMessages = progress.activeConversationId.messages || [];
            sortedMessages.sort((a, b) => {
              if (a.timestamp && b.timestamp) {
                return new Date(a.timestamp) - new Date(b.timestamp);
              }
              return 0;
            });

            setConversationHistory(sortedMessages);
            console.log(
              "Loaded conversation with",
              sortedMessages.length,
              "messages"
            );
          } else {
            // Otherwise, we need to fetch the conversation
            const conversationResponse = await axios.get(
              `/api/conversations/${progress.activeConversationId}`
            );

            if (conversationResponse?.data?.conversation) {
              setConversationId(conversationResponse.data.conversation._id);

              // Sort messages by timestamp before setting state
              const sortedMessages =
                conversationResponse.data.conversation.messages || [];
              sortedMessages.sort((a, b) => {
                if (a.timestamp && b.timestamp) {
                  return new Date(a.timestamp) - new Date(b.timestamp);
                }
                return 0;
              });

              setConversationHistory(sortedMessages);
              console.log(
                "Fetched conversation with",
                sortedMessages.length,
                "messages"
              );
            }
          }
        } else {
          // No active conversation, need to start one
          await startNewConversation();
        }

        setInitialized(true);
      } catch (err) {
        console.error("Error initializing conversation:", err);
        setError("Failed to load conversation history. Please try again.");

        // Fall back to empty conversation
        setConversationHistory([]);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    initializeConversation();
  }, [currentUser, mongoId, questionId]);

  // Function to create a new conversation and start working on a question
  const startNewConversation = useCallback(
    async (initialMessage = null) => {
      if (!currentUser?.email || !mongoId || !questionId) {
        console.warn(
          "Cannot create conversation: Missing user or question ID",
          {
            userId: mongoId,
            questionId,
          }
        );
        return null;
      }

      try {
        // Use the new progress/start endpoint to start working on a question
        const response = await axios.post("/api/progress/start", {
          userId: mongoId,
          questionId,
        });

        if (response?.data?.progress) {
          setProgressData(response.data.progress);

          // The progress object contains the active conversation
          if (response.data.progress.activeConversationId) {
            const conversationId =
              typeof response.data.progress.activeConversationId === "object"
                ? response.data.progress.activeConversationId._id
                : response.data.progress.activeConversationId;

            setConversationId(conversationId);

            // If we have a populated conversation
            if (
              typeof response.data.progress.activeConversationId === "object"
            ) {
              setConversationHistory(
                response.data.progress.activeConversationId.messages || []
              );
            } else {
              // Need to fetch the conversation
              const convResponse = await axios.get(
                `/api/conversations/${conversationId}`
              );
              setConversationHistory(
                convResponse.data.conversation.messages || []
              );
            }

            // Add initial message if provided
            if (initialMessage) {
              await addMessage(initialMessage);
            }

            return conversationId;
          }
        }

        console.error("Invalid response format from progress/start API");
        return null;
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError("Failed to create new conversation. Please try again.");
        return null;
      }
    },
    [currentUser, mongoId, questionId]
  );

  // Function to add a message to the conversation
  const addMessage = useCallback(
    async (message) => {
      if (!message?.role || !message?.content) {
        console.warn("Cannot add invalid message format", message);
        return false;
      }

      if (!mongoId) {
        console.warn("Cannot add message: No current user");
        return false;
      }

      // Ensure the message has a timestamp
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      if (!conversationId) {
        if (initialized) {
          // If the conversation hasn't been initialized yet, create one
          console.log(
            "No existing conversation, creating new one with initial message"
          );
          const newConversationId = await startNewConversation(
            messageWithTimestamp
          );
          return newConversationId ? true : false;
        }
        console.warn(
          "Cannot add message: No conversation ID and not initialized"
        );
        return false;
      }

      try {
        // Send message to server
        await axios.put(`/api/conversations/${conversationId}/messages`, {
          message: messageWithTimestamp,
        });

        // Update local state while maintaining order
        setConversationHistory((prev) => {
          const newHistory = [...prev, messageWithTimestamp];
          // Sort by timestamp
          return newHistory.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return 0;
          });
        });

        return true;
      } catch (err) {
        console.error("Error adding message:", err);
        // Still update local state even if server fails, maintaining order
        setConversationHistory((prev) => {
          const newHistory = [...prev, messageWithTimestamp];
          // Sort by timestamp
          return newHistory.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return 0;
          });
        });
        return true;
      }
    },
    [mongoId, conversationId, initialized, startNewConversation]
  );

  // Function to clear conversation history
  const clearConversationHistory = useCallback(async () => {
    if (!mongoId || !questionId) {
      console.warn("Cannot clear history: Missing user or question ID");
      return false;
    }

    try {
      // Use the updated clear-history endpoint that works with UserQuestionProgress
      const response = await axios.post(
        `/api/conversations/clear-history/${mongoId}/${questionId}`
      );

      if (response?.data?.conversation && response?.data?.progress) {
        setConversationId(response.data.conversation._id);
        setConversationHistory([]);
        setProgressData(response.data.progress);
        return true;
      } else {
        console.error("Invalid response format from clear history API");
        return false;
      }
    } catch (err) {
      console.error("Error clearing conversation history:", err);
      setError("Failed to clear conversation history. Please try again.");
      return false;
    }
  }, [mongoId, questionId]);

  // Function to update conversation metadata
  const updateMetadata = useCallback(
    async (metadata) => {
      if (!conversationId) {
        console.warn("Cannot update metadata: No conversation ID");
        return false;
      }

      if (!metadata || Object.keys(metadata).length === 0) {
        console.warn("Cannot update with empty metadata");
        return false;
      }

      try {
        const response = await axios.put(
          `/api/conversations/${conversationId}/metadata`,
          {
            metadata,
          }
        );

        return response?.status === 200;
      } catch (err) {
        console.error("Error updating metadata:", err);
        return false;
      }
    },
    [conversationId]
  );

  // Function to get progress data for the current question
  const getProgressData = useCallback(async () => {
    if (!mongoId || !questionId) {
      console.warn("Cannot get progress: Missing user or question ID");
      return null;
    }

    try {
      const response = await axios.get(
        `/api/progress/user/${mongoId}/question/${questionId}`
      );

      if (response?.data?.progress) {
        setProgressData(response.data.progress);
        return response.data.progress;
      }

      return null;
    } catch (err) {
      console.error("Error fetching progress data:", err);
      return null;
    }
  }, [mongoId, questionId]);

  // Function to submit an attempt
  const submitAttempt = useCallback(
    async (code, language, timeSpent, correct, feedbackCategory) => {
      if (!mongoId || !questionId || !code) {
        console.warn("Cannot submit attempt: Missing required data");
        return null;
      }

      try {
        const response = await axios.post("/api/progress/submit-attempt", {
          userId: mongoId,
          questionId,
          code, // The backend expects 'code' but maps it to 'userAnswer'
          language,
          timeSpent,
          correct,
          feedbackCategory,
        });

        if (response?.data?.progress) {
          setProgressData(response.data.progress);
          return response.data;
        }

        return null;
      } catch (err) {
        console.error("Error submitting attempt:", err);
        return null;
      }
    },
    [mongoId, questionId]
  );

  return {
    conversationId,
    conversationHistory,
    loading,
    error,
    progressData,
    addMessage,
    clearConversationHistory,
    updateMetadata,
    getProgressData,
    submitAttempt,
    initialized,
  };
};
