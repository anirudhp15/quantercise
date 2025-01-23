import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchProblem = () => {
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState(null);

  const fetchNewProblem = async () => {
    try {
      const response = await axios.get(`/api/questions/random`);
      setProblem(response.data);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error fetching the problem of the day:", err);
      setError("Unable to fetch problem. Please try again.");
    }
  };

  useEffect(() => {
    fetchNewProblem();
  }, []);

  return { problem, fetchNewProblem, error };
};
