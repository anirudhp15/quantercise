// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFm2ByZ2ZmQYau203qOzSGjGsjwWG5J4I",
  authDomain: "quantercise.firebaseapp.com",
  projectId: "quantercise",
  storageBucket: "quantercise.appspot.com",
  messagingSenderId: "642507075520",
  appId: "1:642507075520:web:c215656f4df8a513ffe225",
  measurementId: "G-NBR0XYCDJT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, auth, storage, db };
