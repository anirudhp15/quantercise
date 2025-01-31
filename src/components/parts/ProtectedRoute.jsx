import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import axios from "axios";
import { useUser } from "../../contexts/userContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const { registrationStep } = useUser();

  // Redirect if the user is not logged in
  if (!currentUser) {
    console.log("Redirecting to /login, user not logged in");
    return <Navigate to="/register" replace />;
  }

  console.log("Registration step:", registrationStep);
  // Redirect based on the current registration step
  switch (registrationStep) {
    case "auth":
      console.log("Redirecting to /register, user not registered in MongoDB");
      // User authenticated but not registered in MongoDB
      return <Navigate to="/register" replace />;
    case "mongo":
      console.log(
        "Redirecting to /plan-selection, user has not selected a plan"
      );
      // User registered in MongoDB but has not selected a plan
      return <Navigate to="/plan-selection" replace />;
    case "plan":
      console.log(
        "User has completed onboarding, allowing access to protected routes"
      );
      // User in plan-selection step, ensure they complete it
      return <Navigate to="/plan-selection" replace />;
    case "complete":
      console.log(
        "User has completed onboarding, allowing access to protected routes"
      );
      // User has completed onboarding; allow access to protected routes
      return children;
    default:
      console.error("Unknown registration step:", registrationStep);
      // Fallback for unknown states; send to the registration page
      return <Navigate to="/register" replace />;
  }
};

export default ProtectedRoute;
