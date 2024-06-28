import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const { currentUser } = useAuth();
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  useEffect(() => {
    // Fetch user's progress and upcoming events from your backend or local storage
    const storedProblems = JSON.parse(localStorage.getItem("problems"));
    if (storedProblems) {
      const completedCount = storedProblems.filter(
        (problem) => problem.completed
      ).length;
      setProblemsCompleted(completedCount);
    }
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 mt-16 text-gray-300 bg-gray-900 sm:p-6">
      <div className="max-w-screen-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="py-4 text-3xl font-bold text-green-400 sm:text-5xl">
            Welcome back, {currentUser.displayName || currentUser.email}!
          </h1>
          <p className="mt-2 text-lg font-light">
            Ready to ace your quant finance interviews? Let's get started!
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-300 duration-300 sm:text-2xl group-hover:text-blue-400">
                Practice Problems
              </h2>
              <p className="mt-2 font-thin">
                Access a variety of quant interview problems to improve your
                skills.
              </p>
              <Link
                to="/practice-problems"
                className="inline-block px-4 py-2 mt-4 font-bold text-gray-300 transition duration-300 bg-blue-500 hover:text-white hover:bg-blue-600 rounded-xl hover:shadow-lg group/link"
              >
                Start Practicing
                <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-2 group-hover/link:rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-purple-400 sm:text-2xl">
                Progress Tracker
              </h2>
              <p className="mt-2 font-thin">
                {problemsCompleted === 0 ? (
                  <span>
                    No problems completed yet. View practice problems to get
                    started!
                  </span>
                ) : problemsCompleted === 1 ? (
                  <span>
                    You've completed 1 problem so far. Try working on some new
                    questions!
                  </span>
                ) : (
                  <span>
                    You've completed {problemsCompleted} problems so far. Great
                    work, keep up the momentum!
                  </span>
                )}
              </p>
              <Link
                to="/progress"
                className="inline-block px-4 py-2 mt-4 font-bold text-gray-300 transition duration-300 bg-purple-600 hover:text-white hover:bg-purple-700 rounded-xl hover:shadow-lg"
              >
                View Progress
                <FaArrowRightLong className="inline-block ml-2 hover:scale-110 hover:-rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>

          <div className="relative group sm:col-span-2">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 sm:col-span-2 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-400 sm:text-2xl">
                Performance Analytics
              </h2>
              <p className="mt-2 font-thin">
                Track your performance and identify areas for improvement.
              </p>
              <Link
                to="/analytics"
                className="inline-block px-4 py-2 mt-4 font-bold text-gray-300 transition duration-300 bg-blue-700 hover:text-white hover:bg-blue-800 rounded-xl hover:shadow-lg"
              >
                View Analytics
                <FaArrowRightLong className="inline-block ml-2 hover:scale-110 hover:-rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
