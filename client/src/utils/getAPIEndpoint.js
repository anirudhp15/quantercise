/**
 * Returns the API endpoint URL based on the current environment
 * @returns {string} The API endpoint URL
 */
export const getAPIEndpoint = () => {
  return process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
};
