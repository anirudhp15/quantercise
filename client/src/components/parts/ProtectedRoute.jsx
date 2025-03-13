import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useUser } from "../../contexts/userContext";
import SquigglyPlaceholder from "../parts/SquigglyPlaceholder";
import { SiOpentofu } from "react-icons/si";
import AnimatedGrid from "../landing/animatedGrid/AnimatedGrid";

const ProtectedRoute = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const { currentUser, isLoading } = useAuth();
  const { registrationStep } = useUser();

  // Wait a short delay to ensure Firebase auth has time to initialize
  useEffect(() => {
    const authCheckTimer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 1000); // Short delay to allow auth state to be determined

    return () => clearTimeout(authCheckTimer);
  }, []);

  // If we're still loading, show a nice loading screen
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex fixed inset-0 z-50 justify-center items-center px-4 bg-gradient-to-br from-gray-900 to-gray-900 via-gray-950">
        <AnimatedGrid />
        <div className="flex relative z-50 flex-col justify-center items-center p-8 w-full max-w-md bg-gray-800 rounded-lg shadow-2xl">
          <div className="relative mb-6 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-green-400 animate-spin"></div>
            <SiOpentofu className="absolute inset-0 mx-auto my-auto w-12 h-12 text-green-300" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-green-200">
            Restoring your session...
          </h2>
          <SquigglyPlaceholder lines={3} />
          <p className="mt-4 text-sm text-center text-gray-300">
            Take a deep breath before your next set. You're almost there.
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If user is authenticated but registration is not complete, redirect to appropriate step
  if (registrationStep === "plan") {
    return <Navigate to="/plan-selection" />;
  } else if (registrationStep === "mongo" || registrationStep === "auth") {
    return <Navigate to="/register" />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
