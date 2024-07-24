import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const { currentUser, isPro } = useAuth();
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  useEffect(() => {
    // Scroll to the middle of the screen when the component mounts
    const scrollToMiddle = () => {
      window.scrollTo({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        behavior: "smooth",
      });
    };

    scrollToMiddle();

    // Fetch user's progress from local storage
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

  // Define milestone messages
  const getIntroMessage = () => {
    if (problemsCompleted === 0) {
      return "Welcome! Ready to dive into quant finance? Let's get started!";
    } else if (problemsCompleted > 0 && problemsCompleted <= 10) {
      return "Great to see you back! Keep pushing through those problems!";
    } else if (problemsCompleted > 10 && problemsCompleted <= 50) {
      return "Impressive progress! You're getting closer to mastering quant finance.";
    } else if (problemsCompleted > 50 && problemsCompleted <= 100) {
      return "Fantastic work! Your dedication is paying off.";
    } else {
      return "You're a quant finance wizard! Keep up the excellent work.";
    }
  };

  return (
    <div className="h-screen p-6 mt-16 mb-10 text-gray-300 bg-gray-900 sm:mb-0 sm:h-auto sm:pb-16">
      <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
      <div className="relative z-10 max-w-screen-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1
            className={`py-4 text-3xl font-bold sm:text-4xl md:text-5xl ${
              isPro ? "text-blue-400" : "text-green-400"
            }`}
          >
            Welcome back, {currentUser.displayName || currentUser.email}!
          </h1>
          <p className="mt-2 text-lg font-light">{getIntroMessage()}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-green-300 transition-all duration-200 sm:text-2xl group-hover:text-green-400">
                Practice Problems
              </h2>
              <p className="mt-2 font-thin">
                Access a variety of quant interview problems to improve your
                skills.
              </p>
              <Link
                to="/practice-problems"
                className="inline-block px-4 py-2 mt-4 font-bold text-black transition duration-300 bg-green-500 shadow-sm hover:text-white hover:bg-green-700 rounded-xl hover:shadow-lg group/link"
              >
                Start Practicing
                <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-400 transition-all duration-200 group-hover:text-blue-500 sm:text-2xl">
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
                className="inline-block px-4 py-2 mt-4 font-bold text-black transition duration-300 bg-blue-500 shadow-sm hover:text-white hover:bg-blue-700 rounded-xl hover:shadow-lg group/link"
              >
                View Progress
                <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>

          <div className="relative group sm:col-span-2">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 sm:col-span-2 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-purple-400 transition-all duration-200 sm:text-2xl group-hover:text-purple-500">
                Performance Analytics
              </h2>
              <p className="mt-2 font-thin">
                Track your performance and identify areas for improvement.
              </p>
              <Link
                to="/analytics"
                className="inline-block px-4 py-2 mt-4 font-bold text-black transition duration-300 bg-purple-500 shadow-sm hover:text-white hover:bg-purple-700 rounded-xl hover:shadow-lg group/link"
              >
                View Analytics
                <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
