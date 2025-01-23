import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./../authContext";
import { set } from "mongoose";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [profileColor, setProfileColor] = useState("#6B7280");
  const [isPro, setIsPro] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null); // Placeholder for future use
  const [notificationPreferences, setNotificationPreferences] = useState({}); // Placeholder for future use

  // Fetch user-specific data when currentUser changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/user/${currentUser.uid}`);
        setProfileColor(response.data.profileColor || "#6B7280");
        setIsPro(response.data.isPro);
        setCurrentPlan(response.data.currentPlan);
        // Optionally handle other user-specific properties in the future
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

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
    profileColor,
    setProfileColor: updateProfileColor,
    isPro,
    setIsPro,
    currentPlan,
    setCurrentPlan,
    notificationPreferences,
    setNotificationPreferences, // Placeholder for updating notifications in the future
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
