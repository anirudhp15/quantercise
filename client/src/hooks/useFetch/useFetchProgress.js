import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchProgress = (mongoId) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_DOMAIN =
    process.env.NODE_ENV === "production"
      ? "https://quantercise-api.vercel.app"
      : "http://localhost:4242";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchProblemsAndProgress = async () => {
      if (!mongoId) return;

      setLoading(true);
      setError(null);

      try {
        const problemsResponse = await fetch(`${BACKEND_DOMAIN}/api/questions`);
        if (!problemsResponse.ok) throw new Error("Failed to fetch data");

        const problemsData = await problemsResponse.json();

        setProblems(problemsData);
        return problems;
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mongoId) fetchProblemsAndProgress();
  }, [mongoId]);

  return { problems, loading, error };
};
