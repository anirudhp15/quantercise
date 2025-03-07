import { useCallback } from "react";
import axios from "axios";

export const useInteractionHandlers = (
  userAnswer,
  setUserAnswer,
  fetchFeedback,
  fetchFurtherExplanation,
  resetExplanation,
  selectedProblem,
  userPlan,
  setInputType
) => {
  const handleSubmit = useCallback(() => {
    if (!userAnswer || !userAnswer.trim()) {
      console.warn("Attempted to submit empty solution");
      fetchFeedback(selectedProblem?.description, "No solution provided");
      return;
    }

    // Submit the user's solution
    fetchFeedback(selectedProblem?.description, userAnswer);

    // Clear the input after sending
    setUserAnswer("");
  }, [userAnswer, setUserAnswer, fetchFeedback, selectedProblem]);

  const handleExplainFurther = useCallback(() => {
    if (!userAnswer || !userAnswer.trim()) {
      console.warn("Attempted to request explanation with empty query");
      return;
    }

    // Use whatever the user has typed in the input field
    const message = userAnswer;

    // Clear the input field after sending
    setUserAnswer("");

    // Call the API with the user's complete explanation request
    fetchFurtherExplanation(message, "explanation", userPlan);
  }, [userAnswer, setUserAnswer, fetchFurtherExplanation, userPlan]);

  const handleAskQuestion = useCallback(() => {
    if (!userAnswer || !userAnswer.trim()) {
      console.warn("Attempted to ask empty question");
      return;
    }

    // Use the current user input as the question
    const question = userAnswer;

    // Clear the input after sending
    setUserAnswer("");

    // Process the question
    fetchFurtherExplanation(question, "question", userPlan);
  }, [userAnswer, setUserAnswer, fetchFurtherExplanation, userPlan]);

  // Direct API calls for more advanced implementations
  const submitAnswer = useCallback(
    async (answer) => {
      try {
        const response = await axios.post("/api/problems/submit", {
          problemId: selectedProblem?.id,
          answer,
        });
        return response.data;
      } catch (error) {
        console.error("Error submitting answer:", error);
        return { success: false, error: error.message };
      }
    },
    [selectedProblem]
  );

  const requestFeedback = useCallback(
    async (answer) => {
      try {
        const response = await axios.post("/api/feedback/generate", {
          problemId: selectedProblem?.id,
          userAnswer: answer,
        });
        return response.data;
      } catch (error) {
        console.error("Error getting feedback:", error);
        return { success: false, error: error.message };
      }
    },
    [selectedProblem]
  );

  return {
    handleSubmit,
    handleExplainFurther,
    handleAskQuestion,
    submitAnswer,
    requestFeedback,
  };
};

export default useInteractionHandlers;
