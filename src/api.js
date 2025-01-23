import axios from "axios";

export const getFeedback = async (problemDescription, userSolution, isPaid) => {
  try {
    const response = await axios.post(
      "http://localhost:4242/api/feedback/solution",
      {
        problemDescription,
        userSolution,
        isPaid,
      }
    );
    return response.data.feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    throw error;
  }
};
