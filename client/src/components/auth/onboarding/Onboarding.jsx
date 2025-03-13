import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../contexts/authContext";
import backgroundImage from "../../../assets/images/practice_problems.jpg";
import backgroundImage2 from "../../../assets/images/applications.jpg";
import backgroundVideo from "../../../assets/videos/demo_v2.mp4";
import { TbCheck } from "react-icons/tb";
import { SiOpentofu } from "react-icons/si";
import axios from "axios";
import { useUser } from "../../../contexts/userContext";

const Onboarding = () => {
  const { currentUser, setRegistrationStep } = useContext(AuthContext);
  const { subscriptionDetails, setSubscriptionDetails, mongoId } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [editableDisplayName, setEditableDisplayName] = useState(
    currentUser?.displayName || "User"
  ); // Editable name
  const navigate = useNavigate();

  const handleDisplayNameChange = (e) => {
    setEditableDisplayName(e.target.value); // Update local state
  };

  const updateDisplayName = async () => {
    try {
      // Update context immediately for a smoother UI
      setSubscriptionDetails((prev) => ({
        ...prev,
        displayName: editableDisplayName,
      }));

      // Send update request to MongoDB
      await axios.put(`/api/user/${currentUser.uid}`, {
        displayName: editableDisplayName,
      });
      console.log("Display name updated successfully!");
    } catch (error) {
      console.error("Failed to update display name:", error);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Update registrationStep to "complete"
        await axios.put(`/api/user/${mongoId}/registration-step`, {
          registrationStep: "complete",
        });

        setRegistrationStep("complete");
        console.log("User onboarding complete.");

        // Navigate to home
        navigate("/home");
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      }
    }
  };

  const renderStepContent = () => {
    if (!subscriptionDetails || !subscriptionDetails.features) {
      return <p>No features available for this plan.</p>;
    }
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col justify-center items-center pt-4 space-y-6">
            <SiOpentofu className="text-8xl text-green-500 animate-bounce" />
            <div className="flex items-center space-x-2 text-4xl font-extrabold">
              <h2 className="text-gray-50">Hello </h2>
              <input
                type="text"
                value={editableDisplayName}
                placeholder="User"
                onChange={handleDisplayNameChange}
                onBlur={updateDisplayName} // Update in the database when input loses focus
                className="p-2 text-green-400 bg-gray-700 rounded-lg rounded-br-lg border-b-2 border-green-400 hover:bg-gray-800 focus:bg-gray-950 focus:outline-none"
              />
            </div>
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

            <div className="grid grid-cols-2 w-full text-xl bg-gray-900 rounded-lg shadow-lg">
              <div className="p-8 space-y-6">
                <div className="font-semibold text-center text-gray-300 lg:text-left">
                  You'll have access to the following features:
                </div>
                <ul className="space-y-2 text-lg font-normal">
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
              <div className="p-4 m-4 rounded-r-lg bg-gray-950">
                <div className="font-semibold text-center text-gray-300 lg:text-left">
                  You'll have the following AI assistant:
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="pb-4 space-y-4 text-center">
            <h2 className="text-3xl font-bold text-gray-50">
              Explore the Problems Page
            </h2>
            <p className="text-gray-400">
              Dive into our vast collection of problems to hone your skills. Use
              filters to find problems that match your interests and skill
              level.
            </p>
            <div className="mt-4 rounded-lg border-8 border-gray-700">
              <img
                alt="Content image"
                src={backgroundImage}
                className="object-contain mx-auto max-w-full rounded-lg shadow-md"
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
            <div className="mt-4 rounded-lg border-8 border-gray-700">
              <video
                src={backgroundVideo}
                autoPlay
                alt="Profile Page Preview"
                className="object-contain mx-auto max-w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b via-gray-800 from-gray-950 to-gray-950">
      <div className="relative w-[90vw] max-w-screen-lg p-8 bg-gray-800 rounded-lg shadow-lg space-y-6">
        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-gray-700 rounded-lg">
          <div
            className={`absolute top-0 left-0 h-full bg-green-500 rounded-lg transition-all duration-300`}
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
          <span className={currentStep >= 1 ? "text-green-400" : ""}>
            Introduction
          </span>
          <span className={currentStep >= 2 ? "text-green-400" : ""}>
            Features
          </span>
          <span className={currentStep === 3 ? "text-green-400" : ""}>
            Complete
          </span>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className={`px-4 py-2 font-bold rounded ${
              currentStep === 1
                ? "bg-gray-500 cursor-not-allowed text-gray-300"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
          >
            {currentStep < 3 ? "Next" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
