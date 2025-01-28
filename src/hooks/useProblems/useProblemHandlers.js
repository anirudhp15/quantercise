export const useProblemHandlers = (mongoId, problems, setProblems) => {
  const updateProblemProgress = async (updatePayload) => {
    try {
      await fetch("/api/user/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleSolveProblem = (problem) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problem.id ? { ...p, visited: true } : p))
    );
    updateProblemProgress({
      mongoId,
      problemId: problem.id,
      progress: { visited: true },
    });
  };

  return { handleSolveProblem };
};
