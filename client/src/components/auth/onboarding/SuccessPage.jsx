import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../contexts/authContext";
import { useUser } from "../../../contexts/userContext";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SiOpentofu } from "react-icons/si";

const SuccessPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { setSubscriptionDetails } = useUser(); // Correctly destructure from context
  const [loading, setLoading] = useState(true);
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

          // Update user's current plan in the database
          await axios.put(`/api/user/${currentUser.uid}/current-plan`, {
            currentPlan: response.data.planObject,
          });

          console.log("User's current plan updated successfully.");
          setSubscriptionDetails(response.data.subscriptionDetails); // Set subscription details in context
          navigate("/onboarding"); // Redirect to onboarding
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
  }, [currentUser, navigate, location.search, setSubscriptionDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // No UI since the user is redirected to onboarding
};

export default SuccessPage;
