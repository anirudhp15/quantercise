import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [registrationStep, setRegistrationStep] = useState("auth");
  const [userValid, setUserValid] = useState(false);

  // Ensure Firebase uses persistent auth
  useEffect(() => {
    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Auth persistence set to browserLocalPersistence");
      } catch (error) {
        console.error("Error setting auth persistence:", error);
      }
    })();
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout;

    const fetchUserData = async (user) => {
      try {
        // Fetch user data, including registrationStep, from your backend
        const { data } = await axios.get(`/api/user/${user.uid}`);
        setCurrentUser(user);
        setRegistrationStep(data.registrationStep || "auth"); // Default to "auth" if not set
        setAuthError(null); // Clear any previous errors
        setUserValid(true); // User exists in MongoDB
        return true;
      } catch (error) {
        console.error(
          `Failed to fetch user data (attempt ${retryCount + 1}):`,
          error
        );

        // If we haven't reached max retries, schedule another attempt
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying in ${retryCount * 2} seconds...`);

          // Clear any existing timeout
          if (retryTimeout) clearTimeout(retryTimeout);

          // Set a new timeout with exponential backoff
          retryTimeout = setTimeout(
            () => fetchUserData(user),
            retryCount * 2000
          );
          setUserValid(false); // User not found in MongoDB during retry
          return false;
        } else {
          // Max retries reached, set error state
          setAuthError(
            "Failed to connect to the server. Please refresh the page or try again later."
          );
          setCurrentUser(user); // Still set the user so they're not completely locked out
          setRegistrationStep("auth");
          setLoading(false);
          setUserValid(false); // User not found in MongoDB after max retries
          return false;
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const success = await fetchUserData(user);
        // Only set loading to false if fetch was successful or max retries reached
        if (success) {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setRegistrationStep("auth");
        setAuthError(null); // Clear any errors when signed out
        setLoading(false);
        setUserValid(false); // No user logged in
      }
    });

    return () => {
      unsubscribe();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
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
        registrationStep: "plan", // Set directly to plan selection step
        isPro: null, // Assign default free plan
        currentPlan: null, // Assign default free plan
      });

      // Update currentUser and Pro status after registration
      setCurrentUser((prev) => ({
        ...prev,
        ...response.data.user,
      }));
      setIsPro(false); // Default to free user after registration
      setAuthError(null); // Clear any errors
      setUserValid(true); // User now exists in MongoDB
      setRegistrationStep("plan"); // Ensure registrationStep is updated in context
    } catch (error) {
      console.error("Error registering user in MongoDB:", error);
      setAuthError("Failed to complete registration. Please try again.");
      setUserValid(false); // Registration failed
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsPro(false); // Reset Pro status on logout
      setRegistrationStep("auth");
      setAuthError(null); // Clear any errors on successful logout
      setUserValid(false); // No user logged in
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthError("Failed to sign out. Please try again.");
    }
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
    authError,
    setAuthError,
    isLoading: loading,
    userValid, // Expose userValid state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
