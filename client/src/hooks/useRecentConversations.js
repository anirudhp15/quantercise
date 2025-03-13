import { useState, useEffect } from "react";
import { fetchRecentConversations } from "./useFetch/useFetchRecentConversations";

/**
 * Custom hook to fetch and manage recent conversations
 * @param {Object} currentUser - The current user object
 * @param {number} limit - Maximum number of conversations to retrieve (default: 3)
 * @returns {Object} - Object containing conversations, loading state, and error state
 */
const useRecentConversations = (currentUser, limit = 15) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecentConversations = async () => {
      if (!currentUser || !currentUser.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchRecentConversations(currentUser.uid, limit);
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recent conversations:", err);
        setError("Failed to load recent conversations");
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    getRecentConversations();
  }, [currentUser, limit]);

  return { conversations, loading, error };
};

export default useRecentConversations;
