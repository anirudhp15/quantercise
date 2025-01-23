import { useMemo } from "react";

/**
 * Custom hook to filter and render problems based on current filters and state.
 * @param {Array} problems - The array of problems to filter and display.
 * @param {Object} filters - Filters including search term, selected tag, difficulty, and category.
 * @param {Array} bookmarkedProblems - Array of bookmarked problem IDs.
 * @param {boolean} isPro - Whether the user is a Pro user.
 * @returns {Array} - Filtered list of problems to show.
 */
export const useRenderProblems = ({
  problems,
  filters: { searchTerm, selectedTag, selectedDifficulty, selectedCategory },
  bookmarkedProblems,
  isPro,
}) => {
  // Filter problems based on provided criteria
  const filteredProblems = useMemo(() => {
    return problems.filter(
      (problem) =>
        (selectedTag === "All Tags" || problem.tags?.includes(selectedTag)) &&
        (selectedDifficulty === "Any Difficulty" ||
          problem.difficulty === selectedDifficulty) &&
        (problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (problem.tags &&
            problem.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )))
    );
  }, [problems, searchTerm, selectedTag, selectedDifficulty]);

  // Further filter problems based on selected category
  const problemsToShow = useMemo(() => {
    if (selectedCategory === "Bookmarks") {
      return filteredProblems.filter((problem) =>
        bookmarkedProblems.includes(problem.id)
      );
    }
    return filteredProblems.filter(
      (problem) =>
        selectedCategory === "All Topics" ||
        problem.category === selectedCategory
    );
  }, [filteredProblems, selectedCategory, bookmarkedProblems]);

  return problemsToShow;
};
