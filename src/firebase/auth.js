import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import axios from "axios";

// Function to create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  console.log("User created:", user.uid);

  return user;
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("User signed in:", user);

    // Check if user has another credential (e.g., Google) linked to their account
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    console.log("Sign-in methods:", signInMethods);

    if (signInMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
      // If the Google account exists, link it to email/password credentials
      const googleProvider = new GoogleAuthProvider();
      const googleCredential = await signInWithPopup(auth, googleProvider);
      await linkWithCredential(auth.currentUser, googleCredential.credential);
    }

    console.log("User signed in with email and password:", user);

    // Capture additional user information
    const displayName = user.displayName || "";
    const profilePicture =
      user.photoURL || "../../assets/images/default_profile.jpg";

    // Send user info to your Express.js server to update MongoDB
    await axios.post(`/api/auth/login`, {
      googleId: user.uid,
      email: user.email,
      displayName,
      profilePicture,
      registrationStep: "complete", // Update registration step
    });

    console.log("User info sent to server:", user);

    return user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

// Function to sign in with Google
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Capture additional user information
    const displayName = user.displayName || "";
    const profilePicture =
      user.photoURL || "../../assets/images/default_profile.jpg";

    // Check if the user already exists with email/password and link the accounts
    const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
    if (signInMethods.includes(EmailAuthProvider.PROVIDER_ID)) {
      // If email/password is already used, link the Google account
      const emailCredential = EmailAuthProvider.credential(
        user.email,
        auth.currentUser.password
      );
      await linkWithCredential(auth.currentUser, emailCredential);
    }

    // Send user info to your Express.js server to update MongoDB
    await axios.post(`/api/auth/google-login`, {
      uid: user.uid,
      email: user.email,
      displayName,
      profilePicture,
      registrationStep: "complete", // Update registration step
    });

    return user;
  } catch (error) {
    // Handle specific error when account exists with different credentials
    if (error.code === "auth/account-exists-with-different-credential") {
      const existingEmail = error.customData.email;
      const pendingCredential = error.credential;

      // Prompt the user to log in with the existing method (email/password)
      console.error(
        `An account already exists with the email ${existingEmail}. Please log in using your email and password.`
      );
    } else {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }
};

// Function to sign out
export const doSignOut = () => {
  return auth.signOut();
};

// Function to reset password
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Function to change password
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Function to send email verification
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
