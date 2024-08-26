import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiUserPlus } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth";
import axios from "axios"; // Import axios to make API calls
import AnimatedGrid2 from "../../landing/AnimatedGrid2";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn, setCurrentUser, setIsPro } = useAuth(); // Added setIsPro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerRef = useRef(null);

  useEffect(() => {
    // Smooth fade-in animation for the register form
    if (registerRef.current) {
      registerRef.current.style.opacity = 1;
    }
  }, []);

  const fetchUserProStatus = async (uid) => {
    try {
      const response = await axios.get(`/api/users/${uid}`); // Adjust API endpoint
      if (response.data && response.data.isPro !== undefined) {
        setIsPro(response.data.isPro); // Set the isPro status in the app's state
      }
    } catch (error) {
      console.error("Error fetching user's Pro status:", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        setIsRegistering(false);
        return;
      }
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        setCurrentUser(userCredential.user);
        await fetchUserProStatus(userCredential.user.uid); // Fetch and set isPro status
        navigate("/home");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const onGoogleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isRegistering) {
        setIsRegistering(true);
        try {
          const userCredential = await doSignInWithGoogle();
          setCurrentUser(userCredential.user);
          await fetchUserProStatus(userCredential.user.uid); // Fetch and set isPro status
          navigate("/home");
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsRegistering(false);
        }
      }
    },
    [isRegistering]
  );

  if (userLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-950 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-10 bg-black bg-opacity-20"></div>
      <AnimatedGrid2 />
      <main
        ref={registerRef}
        className="relative z-10 w-full max-w-md p-8 space-y-8 border border-gray-700 shadow-xl opacity-0 bg-gray-950 rounded-xl"
        style={{ marginTop: "5rem" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-green-400">Quantercise</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="w-full border-b border-gray-700 opacity-50"></div>

          <h3 className="text-xl font-medium text-center text-gray-100 sm:text-2xl">
            Create a New Account
          </h3>
          <form onSubmit={onSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <label className="text-sm font-bold text-gray-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-200 transition-all duration-200 bg-gray-800 border border-gray-800 rounded-lg shadow-sm outline-none focus:border-green-600 focus:bg-gray-950"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <label className="text-sm font-bold text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-200 transition-all duration-200 bg-gray-800 border border-gray-800 rounded-lg shadow-sm outline-none focus:border-green-600 focus:bg-gray-950"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <label className="text-sm font-bold text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 my-2 text-gray-200 transition-all duration-200 bg-gray-800 border border-gray-800 rounded-lg shadow-sm outline-none focus:border-green-600 focus:bg-gray-950"
              />
            </motion.div>
            {errorMessage && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="font-bold text-red-600"
              >
                {errorMessage}
              </motion.span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-black font-bold rounded-lg ${
                isRegistering
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 hover:shadow-xl transition duration-300 shadow-md"
              }`}
            >
              {isRegistering ? "Registering..." : "Sign Up"}
              <FiUserPlus className="inline-block mb-[2px] ml-2 text-xl font-extrabold " />
            </motion.button>
          </form>
          <p className="text-sm text-center text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-green-400 transition duration-200 hover:text-green-200 group"
            >
              Continue
              <IoIosArrowRoundForward className="inline-block mb-[1px] text-xl font-extrabold group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="w-full border-b border-gray-700 opacity-50"></div>
          <div className="absolute px-4 text-sm font-bold text-gray-400 bg-gray-800">
            OR
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          disabled={isRegistering}
          onClick={(e) => onGoogleSignIn(e)}
          className={`w-full flex items-center justify-center gap-x-3 py-2.5 border border-gray-700 rounded-lg text-sm font-medium text-gray-400 ${
            isRegistering
              ? "cursor-not-allowed bg-gray-700"
              : "hover:bg-gray-700 transition duration-300 active:bg-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                fill="#4285F4"
              />
              <path
                d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                fill="#34A853"
              />
              <path
                d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                fill="#FBBC04"
              />
              <path
                d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {isRegistering
            ? "Registering with Google..."
            : "Continue with Google"}
        </motion.button>
      </main>
    </div>
  );
};

export default Register;
