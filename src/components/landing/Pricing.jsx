import React, { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrValidate } from "react-icons/gr";
import { TbAlertSquareRounded } from "react-icons/tb";
import axios from "axios";
import PropTypes from "prop-types";

// Load the Stripe public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PriceCard = React.memo(
  ({
    title,
    price,
    period,
    features,
    color,
    priceId,
    handleCheckout,
    badgeText,
    isAnnual,
  }) => {
    return (
      <div
        className={`relative group w-full max-w-lg p-6 transition-all duration-300 border border-gray-500 bg-gray-950 rounded-md hover:border-gray-300 ${
          isAnnual ? "scale-[1.00] shadow-lg" : "scale-[0.99]"
        }`}
      >
        {badgeText && (
          <div
            className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold transition-all duration-200 rounded-tr-sm group-hover:text-black rounded-bl-xl ${
              title == "Pro" || title == "Pro Yearly"
                ? "group-hover:bg-blue-400 border border-t-0 border-r-0 border-gray-500 text-blue-400 group-hover:border-blue-400"
                : "group-hover:bg-green-400 border border-t-0 border-r-0 border-gray-500 text-green-400 group-hover:border-green-400"
            }`}
          >
            {badgeText}
            {isAnnual && (
              <GrValidate className="inline-block h-4 w-4 mb-[2px] ml-1" />
            )}
            {!isAnnual && (
              <TbAlertSquareRounded className="inline-block h-4 w-4 mb-[2px] ml-1" />
            )}
          </div>
        )}
        <h3 className={`text-2xl xl:text-4xl font-bold sm:text-md ${color}`}>
          {title}
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-300 xl:text-4xl">
          <span className="text-gray-300">{price}</span>
          <span className="ml-1 text-sm text-gray-300">{period}</span>
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
          className={`inline-block w-full px-4 py-2 mt-6 font-bold text-center transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:text-white hover:shadow-lg group ${
            color === "text-green-400"
              ? "bg-green-400 text-black"
              : "bg-blue-400 text-black"
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
  badgeText: PropTypes.string, // Added prop for the badge
  isAnnual: PropTypes.bool, // Added prop to apply scaling
};

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false); // Toggle for monthly/annual pricing

  // Toggle the annual or monthly pricing plans
  const togglePricing = () => {
    setIsAnnual(!isAnnual);
  };

  const handleCheckout = useCallback(async (priceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:4242/api/stripe/create-checkout-session`,
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
          <h2 className="relative py-8 text-4xl font-black text-transparent z-2 md:pb-12 md:text-5xl gradient-text animate-gradient">
            Pricing
          </h2>
          <p className="relative max-w-screen-lg pb-8 mx-auto text-lg font-normal text-gray-300 z-2 sm:text-xl md:text-2xl">
            All users start with our{" "}
            <span className="font-black text-white">Starter Plan</span>, with 15
            free questions. For more extensive practice, choose from one of our
            plans below.
          </p>

          {/* Sleek Toggle Switch for Monthly/Annual Pricing */}
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
                className={`absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow transition-transform duration-300 transform ${
                  isAnnual ? "translate-x-full" : ""
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
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-auto gap-2 mt-8 lg:flex-row">
          {/* Starter Plan */}
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
            priceId={
              isAnnual
                ? "price_1PrL4B2LYK3gCcnXwaBSR3uB"
                : "price_1PfQac2LYK3gCcnX2jnYp8du"
            }
            handleCheckout={handleCheckout}
            badgeText={isAnnual ? "Annual Commitment" : "For Beginners"}
            isAnnual={isAnnual}
          />

          {/* Pro Plan */}
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
            priceId={
              isAnnual
                ? "price_1PyaL42LYK3gCcnX2coQGFMH"
                : "price_1PyaJH2LYK3gCcnXQyg47GM7"
            }
            handleCheckout={handleCheckout}
            badgeText={isAnnual ? "Best Value - Save 17%" : "Most Popular"}
            isAnnual={isAnnual}
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
