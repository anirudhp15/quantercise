import { useState } from "react";
import axios from "axios";

export const useFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFeedback = async (
    problemDescription,
    userSolution,
    isPro,
    categorizeFeedback
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/feedback/solution`, {
        problemDescription,
        userSolution,
        isPro,
      });

      const feedbackText = response.data.feedback; // Extract feedback
      const category = categorizeFeedback(feedbackText); // Categorize feedback

      console.log("Feedback:", feedbackText);
      console.log("Category:", category);

      setFeedback(feedbackText); // Clean up feedback
      setFeedbackCategory(category);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback("Unable to fetch feedback. Please try again later.");
      setFeedbackCategory({ heading: "ERROR", color: "text-gray-400" });
    } finally {
      setLoading(false);
    }
  };

  return { feedback, feedbackCategory, loading, fetchFeedback };
};
