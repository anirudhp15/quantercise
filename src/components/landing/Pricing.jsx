import React, { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FaArrowRightLong } from "react-icons/fa6";
import axios from "axios";
import PropTypes from "prop-types";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
console.log("Stripe Promise:", stripePromise);

const PriceCard = React.memo(
  ({ title, price, period, features, color, priceId, handleCheckout }) => {
    return (
      <div className="w-full max-w-sm p-6 mt-8 transition-all duration-200 border-2 border-gray-500 bg-gray-950 rounded-xl hover:border-gray-300">
        <h3 className={`text-xl font-medium sm:text-md ${color}`}>{title}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
          <span className="text-gray-300">{price}</span>
          <span className="ml-2 text-sm text-gray-300">{period}</span>
        </p>
        <div className="mt-4 mb-4 border-t border-gray-700"></div>
        <ul className="mt-4 text-sm text-left">
          {features.map((feature, index) => (
            <li key={index} className="mt-2 text-gray-300">
              • {feature}
            </li>
          ))}
        </ul>
        <div className="mt-4 mb-4 border-t border-gray-700"></div>
        <button
          className={`inline-block w-full px-4 py-2 mt-6 font-bold text-center transition-all duration-200 rounded-xl hover:scale-105 hover:cursor-pointer hover:text-white hover:shadow-lg group ${
            color === "text-green-400"
              ? "bg-green-400 text-black"
              : color === "text-blue-400"
              ? "bg-blue-400 text-black"
              : "bg-purple-400 text-black"
          }`}
          onClick={() => handleCheckout(priceId)}
        >
          Get Started
          <FaArrowRightLong className="inline-block ml-2 transition-transform duration-300 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    );
  }
);
PriceCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string.isRequired,
  priceId: PropTypes.string.isRequired,
  handleCheckout: PropTypes.func.isRequired,
};

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = useCallback(async (priceId) => {
    try {
      setLoading(true);
      setError(null);
      if (priceId === "starter") {
        window.location.href = "/home";
        return;
      }
      const response = await axios.post(
        `${YOUR_DOMAIN}/create-checkout-session`,
        { priceId }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No URL returned from Stripe");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <div
        id="pricing"
        className="relative min-h-screen p-16 my-auto text-gray-300 lg:p-32 lg:pb-48"
      >
        <div className="mx-auto text-center">
          <h2 className="relative py-8 text-4xl font-bold text-transparent z-2 md:pb-12 md:text-5xl gradient-text animate-gradient">
            Pricing Plans
          </h2>
          <p className="relative pb-8 text-lg font-medium text-white z-2 sm:text-xl md:text-2xl">
            Choose the plan that best fits your needs.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full lg:flex-row lg:justify-around lg:gap-8">
          <PriceCard
            title="Starter"
            price="$0"
            period="(free)"
            features={[
              "Access to 10 essential questions",
              "Basic feedback to get you started",
              "Limited hints to guide your learning",
              "No exclusive resources or advanced content",
            ]}
            color="text-green-400"
            priceId="starter"
            handleCheckout={handleCheckout}
          />
          <PriceCard
            title="Pro (Monthly)"
            price="$4.99"
            period="per month"
            features={[
              "Unlimited access to all questions",
              "Detailed feedback on every question",
              "Hints and common follow-up questions",
              "Exclusive resources to boost your learning",
            ]}
            color="text-blue-400"
            priceId="price_1PfQac2LYK3gCcnX2jnYp8du"
            handleCheckout={handleCheckout}
          />
          <PriceCard
            title="Pro (Annual)"
            price="$49.99"
            period="per year"
            features={[
              "Unlimited access to all questions",
              "Detailed feedback and unlimited hints",
              "Exclusive resources to boost your learning",
              "Save 17% compared to monthly plan",
            ]}
            color="text-purple-400"
            priceId="price_1PrL4B2LYK3gCcnXwaBSR3uB"
            handleCheckout={handleCheckout}
          />
        </div>
        {loading && (
          <div className="flex items-center justify-center mt-8">
            <div className="w-10 h-10 border-t-4 border-b-4 border-yellow-400 rounded-full animate-spin"></div>
            <p className="ml-4 text-yellow-400">Redirecting to checkout...</p>
          </div>
        )}
        {error && <p className="mt-8 text-center text-red-400">{error}</p>}
      </div>
    </Elements>
  );
};

export default Pricing;
