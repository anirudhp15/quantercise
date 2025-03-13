import { useMemo } from "react";

export const useProblemFilters = (problems, filters) => {
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesTag =
        filters.tag === "All Tags" || problem.tags?.includes(filters.tag);
      const matchesDifficulty =
        filters.difficulty === "Any Difficulty" ||
        problem.difficulty === filters.difficulty;

      return matchesTag && matchesDifficulty;
    });
  }, [problems, filters]);

  return { filteredProblems };
};
