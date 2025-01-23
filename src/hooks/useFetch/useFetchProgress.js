import { useState, useEffect } from "react";

export const useFetchProgress = (mongoId) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblemsAndProgress = async () => {
      if (!mongoId) return;

      setLoading(true);
      setError(null);

      try {
        const [problemsResponse, progressResponse] = await Promise.all([
          fetch(`https://quantercise-api.vercel.app/api/questions`),
          fetch(
            `https://quantercise-api.vercel.app/api/user/progress/${mongoId}`
          ),
        ]);
        if (!problemsResponse.ok || !progressResponse.ok)
          throw new Error("Failed to fetch data");

        const problemsData = await problemsResponse.json();
        const progressData = await progressResponse.json();

        const mergedProblems = problemsData.map((problem) => {
          const progress = progressData.progress.find(
            (p) => p.questionId === problem._id
          );
          return progress ? { ...problem, ...progress } : problem;
        });

        setProblems(mergedProblems);
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
