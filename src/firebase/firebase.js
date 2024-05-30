// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export { app, auth };
