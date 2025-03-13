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
import { motion } from "framer-motion";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";

const Register = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    setCurrentUser,
    registrationStep,
    setRegistrationStep,
    registerUserInMongoDB,
  } = useAuth();
  const { mongoId } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerRef = useRef(null);

  useEffect(() => {
    if (registerRef.current) {
      registerRef.current.style.opacity = 1; // Smooth fade-in animation
    }

    if (currentUser?.uid) {
      if (registrationStep === "mongo") {
        navigate("/plan-selection");
      } else if (registrationStep === "complete") {
        navigate("/home");
      }
    }
  }, [currentUser, registrationStep, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setIsRegistering(true);

      // Step 1: Register the user in Firebase
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      const firebaseUser = {
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: userCredential.displayName || email.split("@")[0],
      };

      // Step 2: Register the user in MongoDB and set the free plan
      await registerUserInMongoDB(firebaseUser, password);

      await axios.put(`/api/user/${mongoId}/registration-step`, {
        registrationStep: "plan",
      });

      // Redirect to plan selection
      navigate("/plan-selection");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered. Please log in.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const onGoogleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isRegistering) {
        setIsRegistering(true);
        try {
          const userCredential = await doSignInWithGoogle();
          setCurrentUser({
            uid: userCredential.uid,
            email: userCredential.email,
            displayName: userCredential.displayName || "",
            profilePicture: userCredential.photoURL || "",
            isRegisteredInMongoDB: false,
          });

          // Set the registration step to MongoDB registration
          setRegistrationStep("mongo");

          // Redirect to plan selection
          navigate("/plan-selection");
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsRegistering(false);
        }
      }
    },
    [isRegistering, navigate, setCurrentUser, setRegistrationStep]
  );

  if (registrationStep === "complete") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full min-h-screen bg-gradient-to-br from-black to-gray-800 sm:px-6 lg:px-8">
      <div class="relative z-[9] custom-shape-divider-top-1736546609">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <Link
        className={`absolute top-3 left-8 z-10 px-4 py-1 text-xl font-black tracking-tighter text-green-400 rounded-md transition duration-100 md:left-28 hover:text-green-200`}
        to="/landing"
      >
        Quantercise
      </Link>
      <div className="flex flex-col items-center w-full max-w-screen-xl lg:flex-row">
        {/* Left Section */}
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex relative z-10 flex-col items-center px-8 py-12 w-full lg:w-1/2 lg:px-12 lg:py-24"
        >
          <h1 className="w-full max-w-sm text-5xl font-black tracking-tighter text-center text-transparent bg-clip-text lg:text-left lg:max-w-md lg:text-7xl animate-gradient gradient-text">
            <span className="text-3xl font-semibold tracking-normal text-gray-300">
              Welcome to{" "}
            </span>{" "}
            Quantercise.
          </h1>
          <div className="hidden mt-8 space-y-8 max-w-md font-semibold lg:block">
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Streamlined Access
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-green-400">
                Seamlessly log in and get back to improving your quantitative
                skills.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Secure Authentication
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-blue-400">
                Experience reliable and secure access to your account.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Effortless Integration
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-purple-400">
                Single sign-on and Google authentication for ease of use.
              </p>
            </div>
          </div>
        </motion.div>
        <main
          ref={registerRef}
          className="relative z-10 p-8 mx-auto space-y-8 w-full max-w-md bg-gray-900 rounded-xl border-4 border-gray-800 shadow-2xl opacity-0 lg:w-1/2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold tracking-wide text-center text-gray-100 sm:text-2xl">
              Create a New Account
            </h3>
            <div className="w-full border-b-2 border-gray-500 opacity-50"></div>

            <form onSubmit={onSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <label className="text-sm font-bold text-gray-400">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 mt-2 w-full text-gray-200 bg-gray-800 rounded-lg border border-gray-800 shadow-sm transition-all duration-200 outline-none focus:border-green-600 focus:bg-gray-950"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                <label className="text-sm font-bold text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3 py-2 mt-2 w-full text-gray-200 bg-gray-800 rounded-lg border border-gray-800 shadow-sm transition-all duration-200 outline-none focus:border-green-600 focus:bg-gray-950"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              >
                <label className="text-sm font-bold text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-3 py-2 my-2 w-full text-gray-200 bg-gray-800 rounded-lg border border-gray-800 shadow-sm transition-all duration-200 outline-none focus:border-green-600 focus:bg-gray-950"
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
                    : "bg-green-400 shadow-md transition duration-300 hover:bg-green-500 hover:shadow-xl"
                }`}
              >
                {isRegistering ? "Registering..." : "Sign Up"}
                <FiUserPlus className="inline-block mb-[2px] ml-2 text-xl font-extrabold " />
              </motion.button>
            </form>
            <p className="text-sm tracking-wide text-center text-gray-300">
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
            className="flex justify-center items-center"
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
            className={`w-full tracking-wide flex items-center justify-center gap-x-3 py-2.5 border-2 border-gray-700 rounded-lg text-sm font-medium text-gray-400 ${
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
        <div class=" relative  mb-12 z-[9] custom-shape-divider-bottom-1736546061">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
              class="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Register;
