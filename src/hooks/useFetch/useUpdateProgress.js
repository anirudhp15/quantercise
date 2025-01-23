import { useCallback } from "react";

export const useUpdateProblemProgress = () => {
  const updateProblemProgress = useCallback(
    async ({ userId, questionId, progress }) => {
      try {
        const response = await fetch(
          "https://quantercise-api.vercel.app/api/user/update-progress",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, questionId, progress }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update problem progress");
        }
      } catch (error) {
        console.error("Error in updateProblemProgress:", error);
      }
    },
    []
  );

  return updateProblemProgress;
};
