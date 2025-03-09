import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./../authContext";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [profileColor, setProfileColor] = useState("#6B7280");
  const [isPro, setIsPro] = useState(null); // Updated to handle null for free plans
  const [currentPlan, setCurrentPlan] = useState(null); // Holds the plan's MongoDB ID
  const [mongoId, setMongoId] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState({});
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [registrationStep, setRegistrationStep] = useState(null);

  // Fetch user-specific data when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user profile from the API
      const userResponse = await axios.get(`/api/user/${currentUser.uid}`);
      const userData = userResponse.data;
      setProfileColor(userData.profileColor || "#6B7280");
      setIsPro(userData.isPro);
      setCurrentPlan(userData.currentPlan); // MongoDB ID of the user's plan
      setMongoId(userData._id);
      setRegistrationStep(userData.registrationStep);

      // Update subscription details including cancellation status
      setSubscriptionDetails({
        ...subscriptionDetails,
        status: userData.subscriptionStatus,
        cancellationDetails: userData.cancellationDetails || null,
      });

      // Update `isPro` based on the plan
      await updatePlanDetails(userData.currentPlan);
    } catch (error) {
      console.error("Error fetching user or plan data:", error);
      setIsPro(null); // Default to null in case of an error
    }
  };

  // Update plan details in context
  const updatePlanDetails = async (planId) => {
    try {
      if (!planId || planId === "free-plan-id") {
        setIsPro(null); // Free user
        return;
      }

      const planResponse = await axios.get(`/api/payment/plans/${planId}`);
      const planName = planResponse.data.name;

      // Determine `isPro` based on the plan name
      if (["Pro", "Pro Yearly"].includes(planName)) {
        setIsPro(true);
      } else if (["Sharpe", "Sharpe Yearly"].includes(planName)) {
        setIsPro(false);
      } else {
        setIsPro(null);
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setIsPro(null);
    }
  };

  // Handle plan change
  const handlePlanChange = async (planId) => {
    try {
      // Make API call to update the user's plan

      const response = await axios.post(`/api/payment/plans/subscribe`, {
        userId: mongoId,
        planId,
      });

      // Update context states
      setCurrentPlan(planId);
      setRegistrationStep("complete");
      await updatePlanDetails(planId);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  // Update profile color
  const updateProfileColor = async (color) => {
    setProfileColor(color);
    try {
      await axios.put(`/api/user/${currentUser.uid}/update-color`, {
        profileColor: color,
      });
      console.log("Profile color updated successfully!");
    } catch (error) {
      console.error("Failed to update profile color:", error);
    }
  };

  // Context value
  const value = {
    mongoId,
    setMongoId,
    registrationStep,
    profileColor,
    setProfileColor: updateProfileColor,
    isPro,
    setIsPro,
    currentPlan,
    setCurrentPlan,
    notificationPreferences,
    setNotificationPreferences,
    subscriptionDetails,
    setSubscriptionDetails,
    handlePlanChange, // Expose plan change function to components
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
