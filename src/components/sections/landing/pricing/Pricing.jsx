import React, { useState, useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import anime from "animejs";
import axios from "axios";
import PriceCard from "./PriceCard"; // Import the PriceCard component
import { handleCheckout } from "../../../../utils/stripe"; // Import utility function
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false); // Toggle for monthly/annual pricing
  const navigate = useNavigate(); // React Router hook for navigation

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  // const handleCheckout = useCallback(async (priceId) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await axios.post(
  //       `http://localhost:4242/api/stripe/create-checkout-session`,
  //       { priceId }
  //     );
  //     if (response.data.url) {
  //       window.location.href = response.data.url;
  //     } else {
  //       throw new Error("No URL returned from Stripe");
  //     }
  //   } catch (error) {
  //     console.error("Error creating checkout session:", error);
  //     setError("Failed to initiate checkout. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  return (
    <Elements stripe={stripePromise}>
      <div
        id="pricing"
        className="relative z-10 flex items-center justify-center text-gray-300 bg-gray-900"
      >
        <div className="absolute inset-0 z-20 pointer-events-none opacity-30"></div>

        <div className="w-full max-w-6xl px-6 text-center">
          <h2 className="py-8 text-4xl font-black tracking-tighter text-transparent md:text-5xl gradient-text animate-gradient">
            Pricing
          </h2>
          <p className="max-w-screen-md mx-auto text-lg">
            Start with{" "}
            <span className="font-bold text-white">15 free questions.</span>{" "}
            Upgrade below for more features.
          </p>

          <div className="relative z-10 flex items-center justify-center mt-8 font-light">
            <span
              className={`mr-4 transition-all duration-200 ${
                !isAnnual ? "text-green-400 font-bold" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <div
              className={`relative inline-block w-16 h-8 rounded-full outline-offset-4 outline outline-2 hover:cursor-pointer transition-all duration-300 ${
                isAnnual
                  ? "bg-blue-400 outline-blue-400"
                  : "bg-green-400 outline-green-400"
              }`}
              onClick={togglePricing}
            >
              <div
                className={`absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow transition-transform duration-300 ${
                  isAnnual ? "transform translate-x-full" : ""
                }`}
              />
            </div>
            <span
              className={`ml-4 transition-all duration-200 ${
                isAnnual ? "text-blue-400 font-bold" : "text-gray-400"
              }`}
            >
              Annually
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 mt-8 lg:flex-row">
            <PriceCard
              title={isAnnual ? "Sharpe Yearly" : "Sharpe"}
              price={isAnnual ? "$49.99" : "$4.99"}
              period={isAnnual ? "/ year" : "/ month"}
              features={[
                "Access to all 100 questions",
                "Assistive hints for each question",
                "Basic progress tracking",
                "Detailed solution walkthroughs",
              ]}
              color="text-green-400"
              hoverColor="group-hover/card:text-green-300"
              priceId={
                isAnnual
                  ? "price_1PrL4B2LYK3gCcnXwaBSR3uB"
                  : "price_1PfQac2LYK3gCcnX2jnYp8du"
              }
              handleCheckout={redirectToRegister}
              badgeText={isAnnual ? "Annual Commitment" : "For Beginners"}
              isAnnual={isAnnual}
            />

            <PriceCard
              title={isAnnual ? "Pro Yearly" : "Pro"}
              price={isAnnual ? "$99.99" : "$9.99"}
              period={isAnnual ? "/ year" : "/ month"}
              features={[
                "Access to all 100 questions",
                "Advanced progress and performance analytics",
                "Site-integrated applications tracking dashboard",
                "Detailed follow-up questions for each question",
              ]}
              color="text-blue-400"
              hoverColor="group-hover/card:text-blue-300"
              priceId={
                isAnnual
                  ? "price_1PyaL42LYK3gCcnX2coQGFMH"
                  : "price_1PyaJH2LYK3gCcnXQyg47GM7"
              }
              handleCheckout={redirectToRegister}
              badgeText={isAnnual ? "Best Value - Save 17%" : "Most Popular"}
              isAnnual={isAnnual}
            />
          </div>

          <p className="mt-8 text-sm text-gray-400">
            *Prices are in USD. All plans come with a 30-day money-back
            guarantee. No hidden fees. Cancel anytime.
          </p>

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="w-10 h-10 border-t-4 border-b-4 border-yellow-400 rounded-full animate-spin"></div>
              <p className="ml-4 text-yellow-400">Redirecting...</p>
            </div>
          )}
          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        </div>
      </div>
    </Elements>
  );
};

export default Pricing;
