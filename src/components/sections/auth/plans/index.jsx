import React from "react";
import { motion } from "framer-motion";
import PriceCard from "../../landing/pricing/PriceCard";
import useFetchPlans from "../../../../hooks/useFetch/useFetchPlans";
import { useAuth } from "../../../../contexts/authContext";
import { useUser } from "../../../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlanSelection = () => {
  const { currentUser } = useAuth(); // Current user details
  const {
    isPro,
    setIsPro,
    currentPlan,
    setCurrentPlan,
    mongoId,
    setProfileColor,
    handlePlanChange,
  } = useUser(); // User-specific updates
  const { plans } = useFetchPlans(); // Fetch available plans
  const navigate = useNavigate();

  const onPlanSelect = async (plan) => {
    console.log("Selected plan:", plan);
    console.log("Current user:", currentUser);
    try {
      if (plan.price > 0) {
        // Redirect to Stripe checkout page for paid plans
        const response = await axios.post("/api/payment/plans/select", {
          userId: mongoId,
          planId: plan._id,
        });

        if (response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          throw new Error("Failed to generate checkout URL.");
        }
      } else {
        const uid = currentUser.firebaseUid || currentUser.googleId;
        // Handle free plan selection
        await handlePlanChange(plan._id); // Update the user context
        await axios.put(`/api/user/${uid}/registration-step`, {
          registrationStep: "complete",
        });
        navigate("/home"); // Redirect to home
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      alert("Failed to select plan. Please try again.");
    }
  };

  const freePlan = {
    _id: "free-plan-id",
    name: "Starter",
    price: 0,
    features: ["Access to 10 questions", "Basic analytics"],
    priceId: "free-plan-price-id",
  };

  const allPlans = [...plans, freePlan];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-24 text-white bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-screen-lg text-center xl:text-left"
      >
        <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
          Select Your Plan
        </h2>
        <p className="mt-4 text-lg font-light tracking-wide">
          Start with a{" "}
          <span
            onClick={() => onPlanSelect(freePlan)}
            className="font-bold text-gray-400 hover:text-gray-300 hover:cursor-pointer"
          >
            free plan
          </span>
          , or upgrade for advanced features.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-wrap justify-center gap-8 mt-12 max-w-screen-2xl"
      >
        {allPlans.map((plan) => (
          <PriceCard
            key={plan._id}
            title={plan.name}
            price={plan.price === 0 ? "Free" : `$${plan.price}`}
            period={plan.price > 0 ? "/ month" : ""}
            features={plan.features}
            color={plan.price === 0 ? "text-gray-400" : "text-green-400"}
            hoverColor={
              plan.price === 0
                ? "group-hover/card:text-gray-300"
                : "group-hover/card:text-green-300"
            }
            priceId={plan.priceId}
            handleCheckout={() => onPlanSelect(plan)}
            badgeText={plan.price === 0 ? "Free" : "Premium Features"}
            isAnnual={false}
          />
        ))}
      </motion.div>

      <p className="mt-12 text-sm text-gray-400">
        *Prices are in USD. Cancel anytime. No hidden fees.
      </p>
    </div>
  );
};

export default PlanSelection;
