import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_live_51Pf7hS2LYK3gCcnXnwSMrwWSkx0rAvUjXiJerFVVVlvov6xhlpsT9fWBoh26JZSZoivFQC3SqgWKLXS5RmzThBmW00noET6xuB"
);

const StripeCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { priceId, productName, productDescription, productPrice } =
    location.state || {};

  const redirectToStripeCheckout = async () => {
    console.log("Stripe Checkout initialized");
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to initialize");
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      mode: "subscription",
      lineItems: [{ price: priceId, quantity: 1 }],
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error("Error redirecting to Stripe checkout:", error);
    }
  };

  useEffect(() => {
    if (priceId) {
      redirectToStripeCheckout();
    } else {
      console.error("priceId is not provided");
    }
  }, [priceId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-white">Checkout</h1>
        <div className="mb-4 text-lg text-gray-300">
          <h2 className="text-2xl font-semibold">{productName}</h2>
          <p className="mt-2">{productDescription}</p>
          <p className="mt-2 text-xl font-bold">${productPrice}</p>
        </div>
        <button
          onClick={redirectToStripeCheckout}
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default StripeCheckout;
