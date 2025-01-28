import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdOutlineLogin } from "react-icons/md";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { debounce } from "lodash";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../../firebase/auth";
import { useAuth } from "../../../../contexts/authContext";
import { motion } from "framer-motion";
import "../../../../index.css";

const Login = () => {
  const { userLoggedIn, registrationStep } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loginRef = useRef(null);
  const { navigate } = useNavigate();

  useEffect(() => {
    if (loginRef.current) {
      loginRef.current.style.opacity = 1;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
      console.log("User signed in successfully!");
      if (registrationStep === "complete") {
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage("Error signing in. Please check your credentials.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = useCallback(
    debounce(async (e) => {
      e.preventDefault();
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (error) {
        setErrorMessage("Error signing in with Google: " + error.message);
      } finally {
        setIsSigningIn(false);
      }
    }, 300),
    []
  );

  if (userLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-gray-800 to-black sm:px-6 lg:px-8">
      <div className="relative z-[9] shadow-xl custom-shape-divider-top-1736546609x">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <Link
        className={`z-10 absolute top-3 tracking-tighter left-8 md:left-28 text-xl font-black px-4 py-1 rounded-md transition duration-100 text-green-400 hover:text-green-200`}
        to="/landing"
      >
        Quantercise
      </Link>
      <div className="flex flex-col items-center justify-center w-full max-w-screen-xl lg:flex-row">
        <h1 className="relative z-20 block w-full max-w-lg pb-8 text-5xl font-black tracking-tighter text-center text-transparent lg:hidden lg:text-left lg:pt-0 lg:max-w-md lg:text-7xl bg-clip-text animate-gradient gradient-text">
          <span className="inline lg:block">Code. </span>
          {"  "}
          <span className="inline lg:block">Analyze. </span>
          {"  "}
          <span className="inline lg:block">Conquer. </span>
          {"  "}
        </h1>
        <main
          ref={loginRef}
          className="relative z-10 w-full max-w-md p-8 mx-auto space-y-8 bg-gray-900 border-4 border-gray-800 shadow-2xl lg:w-1/2 rounded-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold tracking-wide text-center text-gray-100 sm:text-2xl">
              Log In to Your Account
            </h3>
            <div className="w-full border-b-2 border-gray-500 opacity-50"></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <label
                  className="text-sm font-bold text-gray-400"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
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
                <label
                  className="text-sm font-bold text-gray-400"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 mt-2 text-gray-200 transition-all duration-200 bg-gray-800 border border-gray-800 rounded-lg shadow-sm outline-none focus:border-green-600 focus:bg-gray-950"
                />
              </motion.div>
              {errorMessage && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="font-bold text-red-500"
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
                className={`w-full px-4 py-2 text-black font-bold rounded-lg ${
                  isSigningIn
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500 hover:shadow-xl transition duration-300 shadow-md"
                }`}
              >
                {isSigningIn ? "Signing In..." : "Sign In"}
                <MdOutlineLogin className="inline-block mb-[2px] ml-2 text-xl font-extrabold " />
              </motion.button>
            </form>
            <p className="text-sm text-center text-gray-300">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-green-400 transition duration-200 hover:text-green-200"
              >
                Register
              </Link>
            </p>
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
              disabled={isSigningIn}
              onClick={(e) => handleGoogleSignIn(e)}
              className={`w-full flex items-center justify-center gap-x-3 py-2.5 border border-gray-700 rounded-lg text-sm font-medium text-gray-400 ${
                isSigningIn
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
              {isSigningIn ? "Signing In..." : "Continue with Google"}
            </motion.button>
          </motion.div>
        </main>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center w-full lg:w-1/2 "
        >
          <h1 className="hidden w-full max-w-lg pt-8 text-5xl font-black tracking-tighter text-center text-transparent lg:block lg:text-left lg:pt-0 lg:max-w-md lg:text-7xl bg-clip-text animate-gradient gradient-text">
            <span className="inline lg:block">Code. </span>
            {"  "}
            <span className="inline lg:block">Analyze. </span>
            {"  "}
            <span className="inline lg:block">Conquer. </span>
            {"  "}
          </h1>
          <div className="hidden max-w-md mt-8 space-y-8 font-semibold lg:block">
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Get Started Quickly
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-green-400">
                Intuitive tools, personalized AI feedback, and hands-on
                simulated practice.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                In-Depth Performance Analytics
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-blue-400">
                Whether you're a beginner or advanced student, monitor your
                progress and improve your skills.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100 ">
                Track Internship Applications
              </h2>
              <p className="pl-2 mt-2 text-gray-400 border-l-4 border-purple-400">
                Keep track of your applications, interviews, and offers in one
                place.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="relative shadow-xl mb-12 z-[9] custom-shape-divider-bottom-1736546061x">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;
