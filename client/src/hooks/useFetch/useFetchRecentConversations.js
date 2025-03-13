import axios from "axios";
import { getAPIEndpoint } from "../../utils/getAPIEndpoint";
import { getAuth } from "firebase/auth";

// API endpoint for conversations
const API_URL = getAPIEndpoint();

/**
 * Fetch recent conversations for a user
 * @param {string} userId - The ID of the user
 * @param {number} limit - Maximum number of conversations to retrieve (default: 3)
 * @returns {Promise} - Promise resolving to an array of recent conversations
 */
export const fetchRecentConversations = async (userId, limit = 3) => {
  try {
    // Get the current Firebase user
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Get the ID token
    const token = await user.getIdToken();

    const response = await axios.get(
      `${API_URL}/api/conversations/recent/${userId}?limit=${limit}`,
      {
        headers: {
          "x-auth-token": token,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recent conversations:", error);
    throw error;
  }
};
