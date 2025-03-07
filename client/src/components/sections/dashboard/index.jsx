import React, { useState, useEffect, useCallback } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { ReactTyped } from "react-typed";
import axios from "axios";
import "../../../index.css";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import useFetchUserData from "../../../hooks/useFetch/useFetchUserData";
import SectionCard from "./SectionCard";
import { useUser } from "../../../contexts/userContext";
import {
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaTrophy,
  FaFire,
  FaLightbulb,
} from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbHome } from "react-icons/tb";
import { TbProgressCheck } from "react-icons/tb";
import { BsBank } from "react-icons/bs";
import { useUserProgress } from "../../../hooks/useProblems/useUserProgress";
import { useFetchProblem } from "../../../hooks/useFetch/useFetchNewProblem";
import { formatDistanceToNow } from "date-fns";

const Home = React.memo(() => {
  const { currentUser } = useAuth();
  const { lowDetailMode } = useLowDetail();
  const { mongoId } = useUser();
  const [showOverlay, setShowOverlay] = useState(false);
  const { completedCount, startedCount, streakCount, lastActive } =
    useUserProgress(mongoId);
  console.log("problemsCompleted dashboard", completedCount);
  const { isPro } = useUser();
  const { problem, error } = useFetchProblem();

  // For past dates (normal "Last active" scenario)
  const timeAgo = formatDistanceToNow(new Date(lastActive), {
    addSuffix: true,
  });
  // Output: "21 days ago" (if today is March 28, 2024)

  // For future dates (if the date is actually correct)
  const timeUntil = formatDistanceToNow(new Date(lastActive), {
    addSuffix: true,
  });
  // Output: "in about 1 year"

  console.log("Problems completed:", completedCount);
  console.log("Is Pro:", isPro);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const getIntroMessage = useCallback(() => {
    if (completedCount === 0) {
      return "Welcome! Ready to dive into quantitative finance? Let's get started!";
    } else if (completedCount <= 10) {
      return "Great to see you back! Keep pushing through those problems!";
    } else if (completedCount <= 50) {
      return "Impressive progress! You're getting closer to mastering quant finance.";
    } else if (completedCount <= 100) {
      return "Fantastic work! Your dedication is paying off.";
    } else {
      return "You're a quant finance wizard! Keep up the excellent work.";
    }
  }, [completedCount]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-wrapper">
      <div className="flex relative justify-center items-center px-4 w-full h-auto min-h-screen text-gray-300 bg-gradient-to-b from-black via-gray-900 to-black">
        {!lowDetailMode && <AnimatedGrid2 />}
        <div className="flex relative z-10 flex-col justify-center py-24 mx-auto max-w-screen-2xl">
          <div className="flex flex-col justify-center items-center lg:flex-row">
            <div className="w-full lg:w-2/5 xl:w-full">
              <div className="text-3xl font-black text-center text-transparent lg:text-left sm:text-4xl md:text-5xl animate-gradient gradient-text">
                <div className="h-14">
                  <ReactTyped
                    strings={["lets quantercise!"]}
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
                transition={{ duration: 1.8, ease: "easeInOut", delay: 1 }}
              >
                <p className="my-4 text-lg font-light tracking-wide leading-relaxed text-center text-gray-200 md:text-xl lg:text-2xl lg:text-left">
                  {getIntroMessage()}
                </p>
              </motion.div>
            </div>
            <div className="block w-full lg:hidden lg:p-4 lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 3 }}
                className="flex flex-row gap-2 justify-center text-xs font-normal lg:justify-end"
              >
                <Link
                  to="/practice-problems"
                  className="flex justify-center items-center px-2 py-1 text-green-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-green-400"
                >
                  Practice
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/applications"
                  className="flex justify-center items-center px-2 py-1 text-sky-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-sky-400"
                >
                  Add Application
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/profile"
                  className="flex justify-center items-center px-2 py-1 text-gray-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-gray-400"
                >
                  Profile
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
          {/* Dashboard Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden mt-4 w-full bg-gray-900 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 justify-between p-4 border-b-2 border-gray-700 lg:flex-row sm:p-6">
              <h3 className="text-2xl font-bold text-gray-200">Overview</h3>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 3 }}
                className="hidden flex-wrap gap-2 justify-center text-xs font-normal lg:justify-end lg:flex"
              >
                <Link
                  to="/practice-problems"
                  className="flex justify-center items-center px-2 py-1 text-green-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-green-400"
                >
                  Practice
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                {isPro === true && (
                  <Link
                    to="/applications"
                    className="flex justify-center items-center px-2 py-1 text-sky-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-sky-400"
                  >
                    Add Application
                    <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex justify-center items-center px-2 py-1 text-gray-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-gray-400"
                >
                  Profile
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
              {/* Stats Card 1 - Problems Completed */}
              <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Problems Started
                    </p>
                    <p className="text-2xl font-bold text-orange-300">
                      {startedCount || 0}
                    </p>
                  </div>
                  <div className="p-3 text-green-400 bg-gray-700 rounded-full">
                    <FaTrophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mt-1 text-xs text-green-400">
                    {completedCount || 0}{" "}
                    <span className="text-gray-400">completed</span>
                  </p>
                  <div className="overflow-hidden relative mt-2 w-full h-2 bg-gray-900 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-400"
                      style={{
                        width: `${Math.min((completedCount || 0) * 2, 100)}%`,
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 h-full bg-orange-400 opacity-75"
                      style={{
                        width: `${Math.min((startedCount || 0) * 2, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {completedCount === 0
                      ? "Solve problems to build your progress"
                      : `You're making great progress!`}
                  </p>
                </div>
              </div>

              {/* Stats Card 2 - Current Streak */}
              <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold text-gray-200">
                      {streakCount} days
                    </p>
                  </div>
                  <div className="p-3 text-red-400 bg-gray-700 rounded-full">
                    <FaFire className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mt-1 text-xs text-gray-400">
                    Last active: {timeAgo}
                  </p>
                  <div className="flex mt-2 space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < 3 ? "bg-red-400" : "bg-gray-700"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Card 3 - Problem of the Day */}
              <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Featured Problem
                    </p>
                    <p className="text-xl font-bold text-gray-200">
                      {problem ? problem.title : "Loading..."}
                    </p>
                  </div>
                  <div className="p-3 text-green-400 bg-gray-700 rounded-full">
                    <BsBank className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center mt-2 space-x-2">
                    {problem && (
                      <>
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            problem.difficulty === "Easy"
                              ? "text-green-400 bg-gray-700"
                              : problem.difficulty === "Medium"
                              ? "text-yellow-400 bg-gray-700"
                              : "text-red-400 bg-gray-700"
                          } rounded`}
                        >
                          {problem.difficulty}
                        </span>
                        {problem.tags.slice(0, 1).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium text-green-400 bg-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-400">
                      {problem ? problem.category : "Loading..."}
                    </p>
                    <Link
                      to="/practice-problems"
                      className="flex justify-center items-center px-3 py-1 text-xs text-green-400 bg-gray-700 rounded border border-gray-600 transition-all duration-200 hover:bg-gray-600 hover:border-green-400"
                    >
                      Solve Now
                      <FaArrowRightLong className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="overflow-hidden my-2 w-full bg-gray-900 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sm:p-6">
              <h3 className="text-xl font-bold text-gray-200">
                Market Insights
              </h3>
              <div className="px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-300 rounded">
                LIVE
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      ></path>
                    </svg>
                    <span className="text-xs font-medium">Market Trend</span>
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-gray-200">
                    Volatility in Tech Sector
                  </h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Recent tech earnings have increased market volatility.
                    Relevant for options pricing models.
                  </p>
                  <div className="flex items-center mt-4 space-x-2">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-xs text-gray-400">
                      Relevant for Quant Interviews
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                    <span className="text-xs font-medium">
                      Recommended Reading
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-gray-200">
                    Stochastic Calculus Fundamentals
                  </h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Brush up on your stochastic calculus to excel in your quant
                    interviews and financial modeling.
                  </p>
                  <div className="flex items-center mt-4">
                    <Link
                      to="/practice-problems/category/stochastic-calculus"
                      className="flex items-center text-xs text-blue-400 hover:text-blue-300"
                    >
                      Practice Related Problems
                      <FaArrowRightLong className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-xs font-medium">Recently Added</span>
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-gray-200">
                    Regression Analysis Question
                  </h4>
                  <p className="mt-2 text-sm text-gray-400">
                    A new challenging question on multivariate regression
                    techniques has been added to the platform.
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="px-2 py-1 text-xs font-medium text-purple-400 bg-gray-700 rounded">
                      Advanced
                    </span>
                    <Link
                      to="/practice-problems/latest"
                      className="flex items-center text-xs text-purple-400 hover:text-purple-300"
                    >
                      View Question
                      <FaArrowRightLong className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                  delayChildren: 0.5,
                },
              },
            }}
            className="grid grid-cols-1 gap-2 my-2 lg:my-4 lg:grid-cols-5 sm:gap-4"
          >
            <SectionCard
              title="Problems"
              icon={<RiPlayListAddFill />}
              description="Access a variety of quant interview problems to improve your skills."
              buttonText="Start Practicing"
              link="/practice-problems"
              textColor={"text-green-400"}
              bgColor={"bg-green-400"}
              hoverColor={"hover:text-green-400"}
              buttonBorderColor={"border-green-400"}
              columnSpan={"lg:col-span-2"}
            />
            {isPro === null && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                bgColor={"bg-gray-400"}
                hoverColor={"hover:text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}

            {isPro === false && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                bgColor={"bg-gray-400"}
                hoverColor={"hover:text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}
            {/* <SectionCard
              title="Track Progress"
              icon={<TbProgressCheck />}
              description={
                problemsCompleted === 0 ? (
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
                )
              }
              buttonText="View Progress"
              link="/progress"
              textColor={"text-blue-400"}
              bgColor={"bg-blue-400"}
              hoverColor={"hover:text-blue-400"}
              buttonBorderColor={"border-blue-400"}
              columnSpan={"lg:col-span-3"}
            /> */}

            {/* {isPro && (
              <SectionCard
                title="Analytics"
                icon={<FaChartBar />}
                description="Track your performance and identify areas for improvement."
                buttonText="View Analytics"
                link="/analytics"
                textColor={"text-purple-400"}
                bgColor={"bg-purple-400"}
                hoverColor={"hover:text-purple-400"}
                buttonBorderColor={"border-purple-400"}
                columnSpan={"lg:col-span-3"}
              />
            )} */}
            {isPro === true && (
              <SectionCard
                title="Applications"
                icon={<FaClipboardList />}
                description="Keep track of your internship/job applications and upcoming interviews."
                buttonText="View Applications"
                link="/applications"
                textColor={"text-sky-400"}
                bgColor={"bg-sky-400"}
                hoverColor={"hover:text-sky-400"}
                buttonBorderColor={"border-sky-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}
            {isPro === true && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                bgColor={"bg-gray-400"}
                hoverColor={"hover:text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-5"}
              />
            )}
          </motion.div>
        </div>
      </div>
      <div className="flex custom-shape-divider-bottom-1733342128">
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
});

export default Home;
