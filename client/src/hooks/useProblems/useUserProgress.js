// client/src/hooks/useUserProgress.js
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export const useUserProgress = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [startedCount, setStartedCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [lastActive, setLastActive] = useState(0);

  // Start or resume working on a question
  const startQuestion = useCallback(
    async (questionId, metadata = {}) => {
      if (!userId || !questionId) return null;
      setLoading(true);
      try {
        const response = await axios.post("/api/progress/start", {
          userId,
          questionId,
          ...metadata,
        });
        return response.data.progress;
      } catch (err) {
        console.error("Error starting question:", err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Submit an attempt for a question
  const submitAttempt = useCallback(
    async (questionId, attemptData) => {
      if (!userId || !questionId) return null;

      const {
        code,
        language = "text",
        timeSpent = 0,
        correct = false,
        feedbackCategory = null,
      } = attemptData;

      if (!code) {
        console.warn("Cannot submit attempt without code/answer");
        return null;
      }

      setLoading(true);
      try {
        const response = await axios.post("/api/progress/submit-attempt", {
          userId,
          questionId,
          code,
          language,
          timeSpent,
          correct,
          feedbackCategory,
        });

        return response.data.progress;
      } catch (err) {
        console.error("Error submitting attempt:", err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Update basic progress data
  const updateProgress = useCallback(
    async (questionId, progressData) => {
      if (!userId || !questionId) return null;

      // First get the existing progress
      try {
        const getResponse = await axios.get(
          `/api/progress/user/${userId}/question/${questionId}`
        );
        const progress = getResponse.data.progress;

        if (!progress || !progress._id) {
          // If no progress exists yet, start the question
          return startQuestion(questionId);
        }

        // If we have existing progress, update relevant fields
        const updates = {};

        if (progressData.visited && !progress.started) {
          updates.started = true;
          updates.startedAt = new Date();
        }

        if (progressData.completed !== undefined) {
          updates.completed = progressData.completed;
          if (progressData.completed) {
            updates.completedAt = new Date();
          }
        }

        if (progressData.bookmarked !== undefined) {
          updates.bookmarked = progressData.bookmarked;
        }

        if (progressData.notes !== undefined) {
          updates.notes = progressData.notes;
        }

        // If we have any updates to make
        if (Object.keys(updates).length > 0) {
          // Use the correct endpoint for updates
          const response = await axios.put(
            `/api/progress/update/${progress._id}`,
            updates
          );
          return response.data.progress;
        }

        return progress;
      } catch (err) {
        console.error("Error updating progress:", err);
        setError(err.message);
        return null;
      }
    },
    [userId, startQuestion]
  );

  // Get progress for a specific question
  const getQuestionProgress = useCallback(
    async (questionId) => {
      if (!userId || !questionId) return null;

      try {
        const response = await axios.get(
          `/api/progress/user/${userId}/question/${questionId}`
        );
        return response.data.progress;
      } catch (err) {
        console.error("Error fetching question progress:", err);
        setError(err.message);
        return null;
      }
    },
    [userId]
  );

  useEffect(() => {
    const fetchProblemsCompleted = async () => {
      try {
        const response = await axios.get(
          `/api/progress/user/${userId}/problems-completed`
        );
        setCompletedCount(response.data.completedCount);
        setStartedCount(response.data.startedCount);
      } catch (err) {
        console.error("Error fetching problems completed:", err);
        setError(err.message);
      }
    };

    const fetchStreakCount = async () => {
      try {
        const response = await axios.get(`/api/progress/user/${userId}/streak`);
        setStreakCount(response.data.streakCount);
        setLastActive(response.data.lastActive);
      } catch (err) {
        console.error("Error fetching streak count:", err);
        setError(err.message);
      }
    };
    fetchProblemsCompleted();
    fetchStreakCount();
  }, [userId]);

  return {
    startQuestion,
    submitAttempt,
    updateProgress,
    getQuestionProgress,
    loading,
    error,
    completedCount,
    startedCount,
    streakCount,
    lastActive,
  };
};
