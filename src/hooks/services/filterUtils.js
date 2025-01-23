export const filterProblems = (
  problems,
  searchTerm,
  selectedTag,
  selectedDifficulty
) => {
  return problems.filter(
    (problem) =>
      (selectedTag === "All Tags" || problem.tags.includes(selectedTag)) &&
      (selectedDifficulty === "Any Difficulty" ||
        problem.difficulty === selectedDifficulty) &&
      (problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );
};
