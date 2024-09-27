import React, { useState, useEffect, useCallback } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedGrid2 from "../landing/AnimatedGrid2";
import { ReactTyped } from "react-typed";
import axios from "axios";
import "../../index.css";
import { useLowDetail } from "../../contexts/LowDetailContext";

// Define your domain
const YOUR_DOMAIN = "http://localhost:4242";

const Home = React.memo(() => {
  const { currentUser } = useAuth();
  const { lowDetailMode } = useLowDetail(); // Access Low Detail Mode
  const [isPro, setIsPro] = useState(false); // State for Pro status
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  // Fetch user's Pro status and progress from the backend
  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Determine if the user is using Google or Firebase authentication
      const authType = currentUser.providerData[0]?.providerId.includes(
        "google"
      )
        ? "googleId"
        : "firebaseUid";

      // Step 1: Fetch mongoId based on googleId or firebaseUid
      const mongoIdResponse = await axios.get(
        `${YOUR_DOMAIN}/api/user/mongoId/${currentUser.uid}`
      );
      const mongoId = mongoIdResponse.data.mongoId;

      // Step 2: Fetch user data using mongoId
      const userDataResponse = await axios.get(
        `${YOUR_DOMAIN}/api/user/${mongoId}`
      );

      // Step 3: Set the isPro status
      setIsPro(userDataResponse.data.isPro);

      // Step 4: Fetch and count completed problems (if stored in localStorage)
      const storedProblems = JSON.parse(localStorage.getItem("problems")) || [];
      const completedCount = storedProblems.filter((p) => p.completed).length;
      setProblemsCompleted(completedCount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Define milestone messages
  const getIntroMessage = useCallback(() => {
    if (problemsCompleted === 0) {
      return "Welcome! Ready to dive into quantitative finance? Let's get started!";
    } else if (problemsCompleted <= 10) {
      return "Great to see you back! Keep pushing through those problems!";
    } else if (problemsCompleted <= 50) {
      return "Impressive progress! You're getting closer to mastering quant finance.";
    } else if (problemsCompleted <= 100) {
      return "Fantastic work! Your dedication is paying off.";
    } else {
      return "You're a quant finance wizard! Keep up the excellent work.";
    }
  }, [problemsCompleted]);

  return (
    <div className="home-wrapper">
      <div className="absolute inset-0 z-10 bg-black bg-opacity-10"></div>

      <div className="relative flex items-center justify-center h-auto min-h-screen text-gray-300 bg-gray-950">
        {!lowDetailMode && <AnimatedGrid2 />}
        {/* Conditionally render AnimatedGrid2 */}
        <div className="relative z-10 flex flex-col justify-center max-w-screen-lg py-24 mx-auto">
          <div className="text-3xl font-black text-center text-transparent lg:text-left sm:text-4xl md:text-5xl animate-gradient gradient-text">
            <div className="h-14">
              <ReactTyped
                strings={["Welcome Back!", "Start Practicing Now!"]}
                typeSpeed={100}
                backSpeed={60}
                startDelay={500}
                showCursor={false}
              />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
          >
            <p className="mt-2 text-lg font-light text-center lg:text-left">
              {getIntroMessage()}
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
            className="grid grid-cols-1 gap-4 my-8 lg:grid-cols-5 sm:gap-6"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="relative group lg:col-span-3"
            >
              <div
                className={`relative z-10 h-full p-4 transition-all duration-200 transform ${
                  isPro
                    ? "border-2 hover:border-green-400 border-gray-400"
                    : "border hover:border-gray-300 border-gray-400"
                } rounded-lg shadow-lg bg-gray-900 group-hover:bg-gray-950 border-gray-500 sm:p-6 group-hover:shadow-2xl`}
              >
                {/* Rest of the component */}
                <h2 className="text-xl font-semibold text-green-300 transition-all duration-200 sm:text-2xl group-hover:text-green-400">
                  Problems
                </h2>
                <p className="mt-2 font-light">
                  Access a variety of quant interview problems to improve your
                  skills.
                </p>
                <Link
                  to="/practice-problems"
                  className="inline-block px-4 py-2 mt-4 font-bold text-green-400 bg-transparent border-2 border-green-400 rounded-lg shadow-sm hover:text-black hover:bg-green-400 hover:shadow-lg group/link"
                >
                  Start Practicing
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="relative group lg:col-span-2"
            >
              <div
                className={`relative z-10 h-full p-4 transition-all duration-200 transform ${
                  isPro
                    ? "border-2 hover:border-blue-400 border-gray-400"
                    : "border hover:border-gray-300 border-gray-400"
                } rounded-lg shadow-lg bg-gray-900 group-hover:bg-gray-950 border-gray-500 sm:p-6 group-hover:shadow-2xl`}
              >
                {" "}
                <h2 className="text-xl font-semibold text-blue-400 transition-all duration-200 group-hover:text-blue-500 sm:text-2xl">
                  Progress Tracker
                </h2>
                <p className="mt-2 font-light text-left">
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
                      You've completed {problemsCompleted} problems so far.
                      Great work, keep up the momentum!
                    </span>
                  )}
                </p>
                <Link
                  to="/progress"
                  className="inline-block px-4 py-2 mt-4 font-bold text-blue-400 bg-transparent border-2 border-blue-400 rounded-lg shadow-sm hover:text-black hover:bg-blue-400 hover:shadow-lg group/link"
                >
                  View Progress
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </Link>
              </div>
            </motion.div>

            {isPro && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="relative group lg:col-span-2"
              >
                <div
                  className={`relative z-10 h-full p-4 transition-all duration-200 transform ${
                    isPro
                      ? "border-2 hover:border-purple-400 border-gray-400"
                      : "border hover:border-gray-300 border-gray-400"
                  } rounded-lg shadow-lg bg-gray-900 group-hover:bg-gray-950 border-gray-500 sm:p-6 group-hover:shadow-2xl`}
                >
                  {" "}
                  <h2 className="text-xl font-semibold text-purple-400 transition-all duration-200 sm:text-2xl group-hover:text-purple-500">
                    Analytics
                  </h2>
                  <p className="mt-2 font-light">
                    Track your performance and identify areas for improvement.
                  </p>
                  <Link
                    to="/analytics"
                    className="inline-block px-4 py-2 mt-4 font-bold text-purple-400 bg-transparent border-2 border-purple-400 rounded-lg shadow-sm hover:text-black hover:bg-purple-400 hover:shadow-lg group/link"
                  >
                    View Analytics
                    <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                  </Link>
                </div>
              </motion.div>
            )}

            {isPro && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="relative group lg:col-span-3"
              >
                <div
                  className={`relative z-10 h-full p-4 transition-all duration-200 transform ${
                    isPro
                      ? "border-2 hover:border-sky-400 border-gray-400"
                      : "border hover:border-gray-300 border-gray-400"
                  } rounded-lg shadow-lg bg-gray-900 group-hover:bg-gray-950 border-gray-500 sm:p-6 group-hover:shadow-2xl`}
                >
                  {" "}
                  <h2 className="text-xl font-semibold transition-all duration-200 text-sky-300 sm:text-2xl group-hover:text-sky-400">
                    Applications
                  </h2>
                  <p className="mt-2 font-light">
                    Keep track of your internship/job applications and upcoming
                    interviews.
                  </p>
                  <Link
                    to="/applications"
                    className="inline-block px-4 py-2 mt-4 font-bold bg-transparent border-2 rounded-lg shadow-sm text-sky-400 border-sky-400 hover:text-black hover:bg-sky-400 hover:shadow-lg group/link"
                  >
                    View Applications
                    <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                  </Link>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="relative group lg:col-span-5"
            >
              <div
                className={`relative z-10 h-full p-4 transition-all duration-200 transform ${
                  isPro
                    ? "border-2 hover:border-yellow-400 border-gray-400"
                    : "border hover:border-gray-300 border-gray-400"
                } rounded-lg shadow-lg bg-gray-900 group-hover:bg-gray-950 border-gray-500 sm:p-6 group-hover:shadow-2xl`}
              >
                {" "}
                <h2 className="text-xl font-semibold text-yellow-400 transition-all duration-200 sm:text-2xl group-hover:text-yellow-500">
                  Profile Settings
                </h2>
                <p className="mt-2 font-light">
                  Update your profile information and account settings.
                </p>
                <Link
                  to="/profile"
                  className="inline-block px-4 py-2 mt-4 font-bold text-yellow-500 bg-transparent border-2 border-yellow-500 rounded-lg shadow-sm hover:text-black hover:bg-yellow-500 hover:shadow-lg group/link"
                >
                  View Profile
                  <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default Home;
