import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import axios from "axios";

// Define your domain
// const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  try {
    // Capture additional user information
    const displayName = user.displayName || ""; // Firebase user might not have a displayName
    const profilePicture =
      user.photoURL || "../../assets/images/default_profile.jpg"; // Default if no profile picture

    // Send user info to your Express.js server to update MongoDB
    await axios.post(
      `https://quantercise-api.vercel.app/api/auth/firebase-login`,
      {
        uid: user.uid,
        email: user.email,
        displayName,
        profilePicture,
        isPro: false, // Default isPro to false for newly created users
      }
    );
  } catch (error) {
    console.error("Error sending user info to server:", error);
  }

  return user;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  try {
    // Capture additional user information
    const displayName = user.displayName || "";
    const profilePicture =
      user.photoURL || "../../assets/images/default_profile.jpg";

    // Send user info to your Express.js server to update MongoDB
    await axios.post(`https://quantercise-api.vercel.app/api/auth/login`, {
      uid: user.uid,
      email: user.email,
      displayName,
      profilePicture,
    });
  } catch (error) {
    console.error("Error sending user info to server:", error);
  }

  return user;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  try {
    // Capture additional user information
    const displayName = user.displayName || "";
    const profilePicture =
      user.photoURL || "../../assets/images/default_profile.jpg";

    // Send user info to your Express.js server to update MongoDB
    await axios.post(
      `https://quantercise-api.vercel.app/api/auth/google-login`,
      {
        uid: user.uid,
        email: user.email,
        displayName,
        profilePicture,
      }
    );
  } catch (error) {
    console.error("Error sending user info to server:", error);
  }

  return user;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
