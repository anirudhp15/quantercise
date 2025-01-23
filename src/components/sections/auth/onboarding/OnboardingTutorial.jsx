import React from "react";

const OnboardingTutorial = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to Quantercise!
      </h1>
      <p className="mt-4 text-gray-600">
        Let’s get you set up and ready to go.
      </p>
      <button
        className="px-4 py-2 mt-6 font-bold text-white bg-green-500 rounded hover:bg-green-600"
        onClick={() => console.log("Onboarding Step 1")}
      >
        Get Started
      </button>
    </div>
  );
};

export default OnboardingTutorial;
