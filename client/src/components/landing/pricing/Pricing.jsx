import React, { useState, useCallback, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SEO from "../../parts/SEO";
import PriceCard from "./PriceCard"; // Import the PriceCard component
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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

  // Schema for pricing page
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Quantercise Subscription",
    description:
      "Access to quantitative practice problems and learning resources",
    url: "https://quantercise.com/pricing",
    offers: [
      {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "USD",
        priceValidUntil: "2025-12-31",
        availability: "https://schema.org/InStock",
        url: "https://quantercise.com/pricing",
        seller: {
          "@type": "Organization",
          name: "Quantercise",
        },
      },
      {
        "@type": "Offer",
        price: "49.99",
        priceCurrency: "USD",
        priceValidUntil: "2025-12-31",
        availability: "https://schema.org/InStock",
        url: "https://quantercise.com/pricing",
        seller: {
          "@type": "Organization",
          name: "Quantercise",
        },
      },
    ],
  };

  return (
    <Elements stripe={stripePromise}>
      <SEO
        title="Quantercise Pricing | Affordable Plans for Quantitative Skills"
        description="Choose a plan that fits your needs. Monthly and annual subscription options available with premium features to enhance your quantitative skills."
        keywords="quantercise pricing, subscription plans, monthly plan, annual plan, quant practice plans"
        canonicalUrl="https://quantercise.com/pricing"
        schema={pricingSchema}
      />
      <div
        id="pricing"
        className="flex relative z-10 justify-center items-center py-16 text-gray-300 bg-gray-900"
      >
        <div className="absolute inset-0 z-20 opacity-30 pointer-events-none"></div>

        <div className="px-4 w-full max-w-6xl text-center">
          <h2 className="py-8 text-4xl font-bold tracking-tighter text-transparent md:text-5xl gradient-text animate-gradient">
            Pricing
          </h2>

          <p className="mx-auto max-w-screen-md text-lg">
            Start with{" "}
            <span className="font-bold text-white">15 free questions.</span>{" "}
            <br />
            Upgrade below for more features.
          </p>

          <div className="flex relative z-10 justify-center items-center mt-8 font-light">
            <span
              className={`mr-4 transition-all duration-200 ${
                !isAnnual ? "font-bold text-green-400" : "text-gray-400"
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
                isAnnual ? "font-bold text-blue-400" : "text-gray-400"
              }`}
            >
              Annually
            </span>
          </div>

          <div className="flex flex-col gap-6 justify-center items-center mt-8 lg:flex-row">
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
          <div className="w-[250px] mx-auto mt-8 text-xs text-left text-gray-400 lg:whitespace-nowrap md:w-max ">
            <ReactTyped
              strings={[
                `*Prices are in USD. All plans come with a 30-day money-back
            guarantee. No hidden fees. Cancel anytime.`,
              ]}
              typeSpeed={20}
              backSpeed={60}
              startWhenVisible={true}
              startDelay={100}
              showCursor={false}
              smartBackspace={true}
            />
          </div>

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="w-10 h-10 rounded-full border-t-4 border-b-4 border-yellow-400 animate-spin"></div>
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
