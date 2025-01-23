import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SiOpentofu } from "react-icons/si";
import AuthContext from "../../../../contexts/authContext";
import axios from "axios";
import { TbCheck } from "react-icons/tb";
import Confetti from "react-confetti";
import backgroundImage from "../../../../assets/images/practice_problems.jpg";
import backgroundImage2 from "../../../../assets/images/applications.jpg";

import "../../../../index.css";

const SuccessPage = () => {
  const { currentUser, registrationStep, setRegistrationStep } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");

      if (!sessionId) {
        console.error("No session ID found in URL");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          `/api/stripe/verify-checkout-session`,
          {
            sessionId,
            userId: currentUser.uid,
          }
        );

        if (response.data.success) {
          console.log(
            "Subscription details:",
            response.data.subscriptionDetails
          );
          setSubscriptionDetails(response.data.subscriptionDetails);
          // Update user's currentPlan in MongoDB
          await axios.put(`/api/user/${currentUser.uid}`, {
            currentPlan: response.data.planObject, // Pass the plan object from the response
          });

          console.log("User's current plan updated successfully.");
        } else {
          console.error("Failed to verify session:", response.data.error);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [currentUser, navigate, location.search]);

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Update registrationStep to "complete" in MongoDB
        await axios.put(`/api/user/${currentUser.uid}/registration-step`, {
          registrationStep: "complete",
        });

        // Update local state
        setRegistrationStep("complete");
        console.log("Registration step set to complete.");

        // Redirect to the home page
        navigate("/home");
      } catch (error) {
        console.error("Failed to update registration step:", error);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center pt-4 space-y-6">
            <SiOpentofu className="text-green-500 animate-bounce text-8xl" />
            <h2 className="text-4xl font-extrabold text-gray-50">
              Hello{" "}
              <span className="text-green-400">
                {currentUser.displayName || "User"}
              </span>
            </h2>
            <p className="text-gray-400">
              You are now subscribed to the{" "}
              <span className="font-bold text-green-400">
                {subscriptionDetails?.planName || "N/A"}
              </span>{" "}
              plan. Your next billing date is{" "}
              <span className="font-bold text-green-400">
                {subscriptionDetails?.nextBillingDate || "N/A"}
              </span>
              .
            </p>

            <div className="w-full p-6 space-y-6 text-xl bg-gray-900 rounded-lg shadow-lg">
              <div className="font-semibold text-center text-gray-300 lg:text-left ">
                You'll have access to the following features:
              </div>
              <ul className="space-y-2 text-lg font-light">
                {subscriptionDetails?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-400">
                      <TbCheck />
                    </span>
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="pb-4 space-y-4 text-center ">
            <h2 className="text-3xl font-bold text-gray-50">
              Explore the Problems Page
            </h2>
            <p className="text-gray-400">
              Dive into our vast collection of problems to hone your skills. Use
              filters to find problems that match your interests and skill
              level.
            </p>
            <div className="mt-4 border-8 border-gray-500 rounded-lg ">
              <img
                src={backgroundImage}
                alt="Problems Page Preview"
                className="object-contain max-w-full mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="relative pb-4 space-y-4 text-center">
            {/* <Confetti numberOfPieces={3000} recycle={false} /> */}
            <h2 className="text-4xl font-extrabold text-gray-50">
              You're All Set!
            </h2>
            <p className="text-gray-400">
              Need help? Visit your profile page for assistance, updates, and
              account management.
            </p>
            {/* <p className="font-bold text-green-400">Go Quantercise!</p> */}
            <div className="mt-4 border-8 border-gray-500 rounded-lg">
              <img
                src={backgroundImage2}
                alt="Profile Page Preview"
                className="object-contain max-w-full mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950">
      <div className="relative z-10 w-[90vw] max-w-screen-lg p-8 bg-gray-800 rounded-lg shadow-lg min-h-[50vh] max-h-[90vh] space-y-6">
        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-gray-700 rounded-lg">
          <div
            className={`absolute top-0 left-0 h-full bg-green-500 rounded-lg transition-all duration-300`}
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
          <span className={currentStep >= 1 ? "text-green-400" : ""}>
            Subscription
          </span>
          <span className={currentStep >= 2 ? "text-green-400" : ""}>
            Explore
          </span>
          <span className={currentStep === 3 ? "text-green-400" : ""}>
            Complete
          </span>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex flex-row justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className={`px-3 py-1 font-bold rounded transition-all ${
              currentStep === 1
                ? "bg-gray-500 cursor-not-allowed text-gray-300"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="px-3 py-1 font-bold text-white bg-green-500 rounded hover:bg-green-600"
          >
            {currentStep < 3 ? "Next" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
