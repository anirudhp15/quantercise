import React, { useState, useEffect } from "react";
import ApplicationsComponent from "../../sections/applications/Applications";
import { motion } from "framer-motion";
import { SiOpentofu } from "react-icons/si";
import AnimatedGrid from "../../landing/animatedGrid/AnimatedGrid";

const Applications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex fixed inset-0 z-50 justify-center items-center bg-gradient-to-br from-gray-900 to-gray-900 via-gray-950">
        <AnimatedGrid />
        <div className="flex relative z-50 flex-col justify-center items-center p-8 w-full max-w-md bg-gray-800 rounded-lg shadow-2xl">
          <div className="relative mb-6 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            <SiOpentofu className="absolute inset-0 mx-auto my-auto w-12 h-12 text-blue-400" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Loading Applications...
          </h2>
          <p className="mt-4 text-sm text-center text-gray-400">
            Take a deep breath before your next set. You're almost there.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex fixed inset-0 z-50 justify-center items-center bg-gray-900">
        <div className="flex flex-col justify-center items-center p-8 w-full max-w-md bg-gray-800 rounded-lg shadow-2xl">
          <div className="p-4 mb-6 bg-red-500 bg-opacity-20 rounded-full">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Error Loading Applications
          </h2>
          <p className="mb-4 text-sm text-center text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ApplicationsComponent />
    </motion.div>
  );
};

export default Applications;
