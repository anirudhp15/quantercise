import { useCallback } from "react";
import axios from "axios";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

export const useUpdateProblemProgress = () => {
  const updateProblemProgress = useCallback(
    async ({ userId, questionId, progress }) => {
      try {
        const response = await fetch(
          `${BACKEND_DOMAIN}/api/user/update-progress`,
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
