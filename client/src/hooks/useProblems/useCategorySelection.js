import { useState, useCallback } from "react";

/**
 * A custom hook to handle category selection and related state.
 * @param {function} setSelectedTag - Function to update the selected tag.
 * @param {function} setSelectedProblem - Function to update the selected problem.
 * @returns {object} - Contains selectedCategory state and its handlers.
 */
export const useCategorySelection = (setSelectedTag, setSelectedProblem) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedCategory(category);
      setSelectedTag("All Tags");
      setSelectedProblem(null);
    },
    [setSelectedTag, setSelectedProblem]
  );

  const handleReviewAllClick = useCallback(() => {
    setSelectedCategory("All Topics");
    setSelectedTag("All Tags");
    setSelectedProblem(null);
  }, [setSelectedTag, setSelectedProblem]);

  const handleBookmarkClick = useCallback(() => {
    setSelectedCategory("Bookmarks");
    setSelectedTag("All Tags");
    setSelectedProblem(null);
  }, [setSelectedTag, setSelectedProblem]);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedProblem(null);
    setSelectedTag("All Tags");
  }, [setSelectedProblem, setSelectedTag]);

  return {
    selectedCategory,
    handleCategoryClick,
    handleReviewAllClick,
    handleBookmarkClick,
    handleBackToCategories,
  };
};
