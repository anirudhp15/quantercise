import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
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

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const updateProfile = async ({ displayName, photoURL }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
      setCurrentUser({ ...auth.currentUser, displayName, photoURL });
    }
  };

  const fetchUserActivities = (userId, callback) => {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      callback(activities);
    });
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    setCurrentUser,
    updateProfile,
    fetchUserActivities,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
