import axios from "axios";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

/**
 * Initiates a Stripe checkout session and redirects the user to the Stripe payment page.
 *
 * @param {string} priceId - The Stripe price ID for the selected plan.
 * @param {string} [userId] - Optional user ID to associate with the session.
 * @returns {Promise<void>}
 */
export const handleCheckout = async (priceId, userId = null) => {
  try {
    // Prepare the request payload
    const payload = { priceId };
    if (userId) {
      payload.userId = userId;
    }

    // Call the backend API to create the checkout session
    const response = await axios.post(
      `${BACKEND_DOMAIN}/api/stripe/create-checkout-session`,
      payload
    );

    if (response.data.url) {
      // Redirect user to the Stripe checkout page
      window.location.href = response.data.url;
    } else {
      throw new Error("No checkout URL returned.");
    }
  } catch (error) {
    console.error("Error initiating checkout:", error);
    alert("Failed to initiate checkout. Please try again.");
  }
};

/**
 * Subscribes the user to a free plan.
 * @param {string} planId - The ID of the free plan to subscribe to.
 * @param {string} userId - The user ID to associate with the subscription.
 * @returns {Promise<void>}
 */

export const handleFreePlan = async (planId, userId = null) => {
  try {
    const response = await axios.post(`/api/payment/plans/subscribe`, {
      userId,
      planId,
    });
    alert(response.data.message);
    window.location.href = "/home";
  } catch (error) {
    console.error("Error subscribing to free plan:", error);
    alert("Failed to subscribe to the free plan. Please try again.");
  }
};
