import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isPro, setIsPro] = useState(false);
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

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setIsPro(userDoc.data().isPro || false);
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
    }
  };

  const fetchUserActivities = (userId, setActivities) => {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(activities);
    });
    return unsubscribe;
  };

  const verifyCheckoutSession = async (sessionId, userId) => {
    try {
      const response = await axios.post(
        "http://localhost:4242/verify-checkout-session",
        {
          sessionId,
          userId,
        }
      );
      if (response.data.success) {
        setIsPro(true);
      }
    } catch (error) {
      console.error("Error verifying checkout session:", error);
    }
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    isPro,
    setCurrentUser,
    updateProfile,
    fetchUserActivities,
    verifyCheckoutSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
