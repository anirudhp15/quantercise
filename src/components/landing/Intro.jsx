import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import axios from "axios";
import backgroundImage from "../../assets/images/practice.jpg";
import AnimatedGrid from "./AnimatedGrid";

const Intro = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL
      : process.env.REACT_APP_DEV_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/notify`, { email });
      if (response.status === 200) {
        setMessage(response.data.message);
      } else {
        setMessage("Server error. Please try again later.");
      }
      setShowMessage(true);
    } catch (error) {
      setMessage("Server error. Please try again later.");
      setShowMessage(true);
    }

    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  return (
    <div
      id="intro"
      className="relative flex items-center justify-center w-full min-h-screen text-gray-300 bg-center bg-cover"
    >
      <div className="fixed inset-0 w-screen h-screen bg-black opacity-50"></div>

      <AnimatedGrid />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center h-full max-w-screen-xl mx-auto lg:flex-row"
      >
        <div className="px-12 text-center lg:w-1/2 lg:pr-8 lg:text-left">
          <h1 className="pt-32 text-3xl font-bold xl:pt-16 lg:pb-4 sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="block text-5xl font-bold text-transparent sm:pt-12 bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 sm:inline md:text-7xl">
              Quantercise
            </span>
          </h1>
          <p className="hidden mt-6 text-lg font-medium text-gray-300 md:block sm:text-xl md:text-2xl">
            A cutting-edge platform designed to elevate your quantitative
            finance skills. Sign up now to join our waitlist and be the first to
            access exclusive features:
          </p>
          <p className="block mt-6 text-lg font-medium text-gray-300 md:hidden sm:text-xl md:text-2xl">
            Join our waitlist now and be the first to access exclusive features
            on our cutting-edge platform:
          </p>
          <div className="flex justify-center mt-4 lg:justify-start">
            <ul className="text-sm font-normal text-left text-gray-400 list-disc list-inside sm:text-base md:text-lg">
              <li>100+ interview questions used in industry</li>
              <li>Comprehensive hints</li>
              <li>Detailed follow-up explanations</li>
              <li>AI-driven feedback assistant</li>
            </ul>
          </div>
          <div className="mt-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4 lg:flex-row lg:items-start"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full max-w-xs px-3 py-2 mt-2 text-white transition duration-200 bg-gray-900 border border-gray-600 rounded-lg shadow-sm outline-none font-extralight focus:border-green-600 focus:bg-gray-950"
                required
              />
              <button
                type="submit"
                className="w-auto px-6 py-2 mt-4 text-lg font-bold text-black transition-all duration-200 bg-green-400 rounded-lg shadow-lg whitespace-nowrap lg:mt-0 animate-bounce hover:scale-105 group hover:bg-green-500 hover:text-white hover:shadow-xl"
              >
                Notify Me
                <FaArrowRightLong className="inline-block ml-2 transition-transform duration-300 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-lg transition-opacity duration-500 ${
                  showMessage ? "opacity-100" : "opacity-0"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2.5, delay: 0.3 }}
          className="relative z-10 max-w-screen-xl mx-auto mt-8 lg:mt-0 lg:w-1/2"
        >
          <div className="relative max-w-sm mx-auto overflow-hidden transition-all duration-150 border-2 border-gray-500 rounded-lg lg:mt-24 sm:max-w-md md:max-w-lg lg:max-w-full lg:mr-8 hover:border-gray-400 group">
            <img
              src={backgroundImage}
              alt="Quantitative Finance Illustration"
              className="w-full transition-opacity duration-150 shadow-xl group-hover:opacity-40"
            />
            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full px-4 py-2 transition-opacity duration-150 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
              <p className="text-sm font-thin text-center text-white md:text-lg">
                Access our extensive knowledgebase of interview questions,
                tagged by specific concepts and subjects to focus on in
                probability, statistics, programming, finance, and general
                logical reasoning. Perfect for undergraduates in STEM, graduate
                students, PhD candidates, and early career quant professionals.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Intro;
