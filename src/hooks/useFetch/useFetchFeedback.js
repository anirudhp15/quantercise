import { useState } from "react";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

export const useFeedback = () => {
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
          heading: "STRONGLY INCORRECT",
          color: "text-red-500",
          bgColor: "bg-red-950",
          icon: "❌",
          description: "Your solution has significant errors",
        };
      case "weakly wrong":
        return {
          heading: "SLIGHTLY INCORRECT",
          color: "text-yellow-500",
          bgColor: "bg-yellow-950",
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
          heading: "SLIGHTLY CORRECT",
          color: "text-green-300",
          bgColor: "bg-green-950",
          icon: "✅",
          description: "Your solution is mostly correct",
        };
      case "strongly right":
        return {
          heading: "STRONGLY CORRECT",
          color: "text-green-500",
          bgColor: "bg-green-950",
          icon: "🌟",
          description: "Your solution is completely correct",
        };
      default:
        return {
          heading: "FEEDBACK UNAVAILABLE",
          color: "text-gray-400",
          bgColor: "bg-gray-800",
          icon: "⚪️",
          description: "Unable to determine the quality of your solution",
        };
    }
  };

  const fetchFeedback = async (problemDescription, userSolution, isPro) => {
    setLoading(true);
    setFeedback(""); // Reset feedback
    setIsComplete(false);
    setFeedbackCategory(categorizeFeedback(null)); // Reset to default

    try {
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedFeedback = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          // Check if it's a category event
          if (line.startsWith("event: category")) {
            const dataLine = line.split("\n")[1];
            if (dataLine && dataLine.startsWith("data: ")) {
              try {
                const categoryData = JSON.parse(dataLine.substring(6));
                if (categoryData.category) {
                  const categoryObj = categorizeFeedback(categoryData.category);
                  setFeedbackCategory(categoryObj);
                }
              } catch (e) {
                console.error("Error parsing category data:", e);
              }
            }
            continue;
          }

          // Check if it's a done event
          if (line.startsWith("event: done")) {
            setIsComplete(true);
            continue;
          }

          // Handle regular data events
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.content) {
                accumulatedFeedback += data.content;
                setFeedback(accumulatedFeedback);
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback("Unable to fetch feedback. Please try again later.");
      setFeedbackCategory({
        heading: "ERROR",
        color: "text-red-500",
        bgColor: "bg-red-950",
        icon: "⚠️",
        description: "There was an error processing your request",
      });
    } finally {
      setLoading(false);
      setIsComplete(true);
    }
  };

  return {
    feedback,
    feedbackCategory,
    loading,
    isComplete,
    fetchFeedback,
  };
};
