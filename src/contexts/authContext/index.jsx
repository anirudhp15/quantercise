import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import axios from "axios";

// Define your domain
const YOUR_DOMAIN = process.env.YOUR_DOMAIN || "http://localhost:4242";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isPro, setIsPro] = useState(false); // Track Pro status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });

      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      try {
        // Get the MongoDB ID based on the Firebase UID or Google ID
        const { data: mongoIdResponse } = await axios.get(
          `${YOUR_DOMAIN}/api/user/mongoId/${user.uid}`
        );
        const mongoId = mongoIdResponse.mongoId;

        // Fetch user data from MongoDB using the MongoDB ID
        const { data: userResponse } = await axios.get(
          `${YOUR_DOMAIN}/api/user/${mongoId}`
        );

        // Set the Pro status based on the response
        if (userResponse) {
          setIsPro(userResponse.isPro || false);
        } else {
          // If the user doesn't exist in MongoDB, create a new entry
          await axios.post(`${YOUR_DOMAIN}/api/user`, {
            firebaseUid: user.uid,
            email: user.email,
            isPro: false,
            signInCount: 1,
          });
        }

        // Increment sign-in count in MongoDB
        await axios.put(`${YOUR_DOMAIN}/api/user/${mongoId}/signin`);
      } catch (error) {
        console.error(
          "Error fetching user data or incrementing sign-in count:",
          error
        );
      }

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsPro(false);
    }

    setLoading(false);
  }

  const updateProfile = async ({ displayName, photoURL }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
      setCurrentUser({ ...auth.currentUser, displayName, photoURL });

      // Optionally update MongoDB with the new display name and photo URL
      try {
        const { data: mongoIdResponse } = await axios.get(
          `${YOUR_DOMAIN}/api/user/mongoId/${auth.currentUser.uid}`
        );
        const mongoId = mongoIdResponse.mongoId;

        await axios.put(`${YOUR_DOMAIN}/api/user/${mongoId}`, {
          displayName,
          photoURL,
        });
      } catch (error) {
        console.error("Error updating profile in MongoDB:", error);
      }
    }
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    isPro,
    setCurrentUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
