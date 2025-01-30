import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import ProblemTimer from "./ProblemTimer";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { SiOpentofu } from "react-icons/si";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";
import { useAuth } from "../../../contexts/authContext";
import SquigglyPlaceholder from "../../parts/SquigglyPlaceholder";

const ProblemCard = ({
  problem,
  userAnswer,
  setUserAnswer,
  notes,
  setNotes,
  handleSaveNotes,
  savedMessage,
  toggleNotes,
  showNotes,
  fetchNewProblem,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false); // Track timeout state
  const { currentUser } = useAuth();
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const handleStartProblem = () => {
    setIsOverlayVisible(false);
  };

  const { feedback, feedbackCategory, fetchFeedback } = useFeedback();

  const extractFeedbackExplanation = (feedback) => {
    if (!feedback) return "No explanation available";

    const match = feedback.match(/Explanation:(.*)/); // Captures everything after "Explanation:"
    return match && match[1] ? match[1] : "No explanation provided";
  };

  const categorizeFeedback = (feedbackText) => {
    if (!feedbackText || feedbackText === "") {
      return {
        heading: "NO FEEDBACK",
        color: "text-gray-400",
        replace: "",
      };
    }

    const lowerText = feedbackText.toLowerCase();

    if (lowerText.includes("strongly wrong")) {
      return {
        heading: "STRONGLY INCORRECT",
        color: "text-red-500",
        replace: "strongly wrong",
      };
    }
    if (lowerText.includes("weakly wrong")) {
      return {
        heading: "SLIGHTLY INCORRECT",
        color: "text-yellow-500",
        replace: "weakly wrong",
      };
    }
    if (lowerText.includes("weakly correct")) {
      return {
        heading: "SLIGHTLY CORRECT",
        color: "text-green-300",
        replace: "weakly correct",
      };
    }
    if (lowerText.includes("strongly correct")) {
      return {
        heading: "STRONGLY CORRECT",
        color: "text-green-500",
        replace: "strongly correct",
      };
    }
    return {
      heading: "FEEDBACK UNAVAILABLE",
      color: "text-gray-400",
      replace: "",
    };
  };

  const handleSubmit = () => {
    if (timeoutOccurred) return; // Prevent submission after timeout

    setShowSolution(true);

    if (!userAnswer || userAnswer.trim() === "") {
      // If user hasn't provided an answer
      fetchFeedback(
        problem.description,
        "No solution provided",
        categorizeFeedback
      );

      return;
    }

    // Fetch feedback only if an answer is provided
    fetchFeedback(problem.description, userAnswer, categorizeFeedback);
  };

  const handleTimeout = () => {
    setTimeoutOccurred(true); // Mark timeout as occurred
    setShowSolution(true); // Show solution

    fetchFeedback(
      problem.description,
      "No solution provided",
      categorizeFeedback
    );
  };

  const resetQuestion = () => {
    fetchNewProblem();
    setIsOverlayVisible(true);
    setShowSolution(false);
    setTimeoutOccurred(false); // Reset timeout state
    setUserAnswer("");
    setNotes("");
  };

  return (
    <div className="w-full p-8 pb-0 bg-gray-600 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-gray-800">
      {/* Skeleton Preview Overlay */}
      {isOverlayVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center w-full"
        >
          {/* Title & Timer Skeleton */}
          <div className="flex items-center justify-between w-full pb-2 mb-4 border-b-4 border-gray-500">
            <div className="flex flex-col w-full">
              <h2 className="mb-2 text-3xl font-bold tracking-tighter text-green-400">
                {problem.title}
              </h2>
              <p className="text-sm tracking-widest text-gray-400">
                {problem.category}
              </p>

              {/* Tags & Difficulty Skeleton */}
              <div className="flex gap-2 my-4">
                <div className="flex items-center gap-2 px-3 py-1 text-sm font-black text-gray-400 rounded-sm bg-gray-700/50">
                  <FaStar className="w-4 h-4 text-gray-400" />
                  {problem.difficulty.toUpperCase()}
                </div>
                {problem.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 text-xs tracking-wide text-gray-400 rounded-full shadow-md w-min whitespace-nowrap bg-gray-700/50"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Area Skeleton */}
            <div className="flex flex-col items-center justify-center w-32 border-2 border-green-400 rounded-full aspect-square bg-gray-700/50">
              <button
                onClick={handleStartProblem}
                className="p-6 font-bold text-black bg-green-400 border-2 border-green-400 rounded-full aspect-square animate-pulse hover:bg-green-500"
              >
                Begin
              </button>
            </div>
          </div>

          {/* Problem Description Skeleton */}
          <div className="w-full p-4 mt-4 rounded-lg bg-gray-700/50">
            <SquigglyPlaceholder lines={3} />
          </div>

          {/* Input Field & Buttons Skeleton */}
          <div className="flex flex-col items-center w-full gap-2 my-4 md:flex-row">
            <div className="w-full h-12 rounded-lg cursor-not-allowed bg-gray-700/50" />
            <div className="grid items-center w-full grid-cols-2 gap-2">
              <div className="flex items-center w-full h-12 col-span-1 rounded-lg cursor-not-allowed md:w-auto bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400">
                  Submit
                </span>
              </div>
              <div className="flex items-center w-full h-12 col-span-1 px-2 rounded-lg cursor-not-allowed md:w-auto bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400 whitespace-nowrap">
                  Reset Question
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Section Skeleton */}
          <div className="w-full p-8 pt-6 mb-6 -mx-8 rounded-b-lg bg-gray-900/50">
            <div className="flex flex-col h-32 px-4 py-4 rounded-b-lg bg-gray-800/50 lg:flex-row">
              <div className="flex items-center justify-center p-4">
                <SiOpentofu className="w-16 h-16 text-gray-400 animate-pulse lg:animate-bounce" />
              </div>
              <div className="flex-col hidden w-full my-auto lg:flex">
                <SquigglyPlaceholder lines={4} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Actual Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isOverlayVisible ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`transition-all duration-500 ${
          isOverlayVisible ? "hidden" : "block"
        }`}
      >
        {/* Title and Timer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              {problem.title}
            </h1>
            <p className="text-sm tracking-widest text-gray-400">
              {problem.category}
            </p>
            {/* Tags and Difficulty */}
            <div className="flex gap-2">
              <span
                className={`flex items-center tracking-tighter font-black gap-2 px-3 py-1 text-black text-sm rounded-sm ${
                  problem.difficulty === "Easy"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : problem.difficulty === "Medium"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
              >
                <FaStar className="w-4 h-4 text-black" />
                {problem.difficulty.toUpperCase()}
              </span>
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm tracking-wide text-white rounded-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <ProblemTimer
            difficulty={problem.difficulty}
            onTimeout={handleTimeout}
            feedbackCategory={feedbackCategory.heading}
          />
        </div>

        <div className="mt-4 mb-4 border-t-2 border-gray-500"></div>

        {/* Problem Description */}
        <div className="p-4 mt-4 font-medium bg-gray-700 rounded-lg shadow-sm">
          <p>{problem.description}</p>
        </div>

        {/* User Input */}
        <div className="my-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your Answer"
              className="w-full p-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600"
              disabled={timeoutOccurred} // Disable button after timeout
            >
              Submit
            </button>
            <button
              onClick={resetQuestion}
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg whitespace-nowrap hover:bg-blue-600"
            >
              Reset Question
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-8 pt-4 -mx-8 bg-gray-900 rounded-b-lg shadow-md"
        >
          {loadingFeedback ? (
            <p className="p-4 mt-4 text-blue-300 animate-pulse">
              <SiOpentofu className="inline-block mr-2 text-4xl text-blue-400 shadow-lg animate-bounce" />
              Fetching feedback...
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="p-8 mt-4 bg-gray-800 rounded-b-lg shadow-md"
            >
              {showSolution && (
                <h2 className={`text-lg  font-bold ${feedbackCategory.color}`}>
                  {feedbackCategory.heading}
                </h2>
              )}
              <div className="p-4 bg-gray-700 rounded-b-lg">
                <SiOpentofu
                  className={`inline-block mr-4 text-4xl ${
                    timeoutOccurred
                      ? "text-red-400"
                      : currentUser
                      ? currentUser.profileColor ?? "text-gray-400"
                      : "text-blue-400"
                  }`}
                />
                {!showSolution && !loadingFeedback ? (
                  <ReactTyped
                    strings={["Press Submit to view feedback"]}
                    typeSpeed={1}
                    className="mt-2 text-sm leading-[3rem] text-gray-300"
                    loop={false}
                  />
                ) : timeoutOccurred ? (
                  <ReactTyped
                    strings={[
                      "Time's up! Press Reset Question to try another one",
                    ]}
                    typeSpeed={1}
                    className="mt-2 text-sm leading-[3rem] text-red-400"
                    loop={false}
                  />
                ) : (
                  <ReactTyped
                    strings={[extractFeedbackExplanation(feedback)]}
                    typeSpeed={1}
                    className="mt-2 text-sm leading-[3rem] text-gray-300"
                    loop={false}
                  />
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProblemCard;
