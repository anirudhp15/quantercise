import { useState, useCallback } from "react";

export const useBookmarkManagement = () => {
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);

  const toggleBookmark = useCallback((problemId) => {
    setBookmarkedProblems((prevBookmarks) =>
      prevBookmarks.includes(problemId)
        ? prevBookmarks.filter((id) => id !== problemId)
        : [...prevBookmarks, problemId]
    );
  }, []);

  return { bookmarkedProblems, toggleBookmark };
};
