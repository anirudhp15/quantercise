import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { useUser } from "../userContext";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPro, setIsPro] = useState(false); // Track Pro status globally
  const [loading, setLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState("auth"); // "auth", "mongo", "plan"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data, including registrationStep, from your backend
          const { data } = await axios.get(`/api/user/${user.uid}`);
          setCurrentUser(user);
          setRegistrationStep(data.registrationStep || "auth"); // Default to "auth" if not set
          console.log("User data fetched:", data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setCurrentUser(null);
          setRegistrationStep("auth");
        }
      } else {
        setCurrentUser(null);
        setRegistrationStep("auth");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerUserInMongoDB = async (firebaseUser, password) => {
    try {
      // Register user in MongoDB
      const response = await axios.post(`/api/auth/register`, {
        email: firebaseUser.email,
        password,
        displayName: firebaseUser.displayName,
        firebaseUid: firebaseUser.uid,
        profilePicture: firebaseUser.photoURL,
        registrationStep: "mongo", // Move to the next step
        isPro: false,
        currentPlan: null, // Assign default free plan
      });

      // Update currentUser and Pro status after registration
      setCurrentUser((prev) => ({
        ...prev,
        ...response.data.user,
      }));
      setIsPro(false); // Default to free user after registration
      setRegistrationStep("mongo");
    } catch (error) {
      console.error("Error registering user in MongoDB:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsPro(false); // Reset Pro status on logout
    setRegistrationStep("auth");
  };

  const isRegistrationComplete = () => registrationStep === "complete";

  const value = {
    currentUser,
    setCurrentUser,
    isPro,
    setIsPro, // Allow dynamic updates to Pro status
    registerUserInMongoDB,
    logout,
    isRegistrationComplete,
    registrationStep,
    setRegistrationStep,
    userLoggedIn: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
