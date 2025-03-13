import React, { useState, useEffect, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import ProblemTimer from "./components/ProblemTimer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { SiOpentofu } from "react-icons/si";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";
import { useAuth } from "../../../contexts/authContext";
import { useUser } from "../../../contexts/userContext";
import SquigglyPlaceholder from "../../parts/SquigglyPlaceholder";
import ProcessedText from "../../parts/ProcessedText";
import "katex/dist/katex.min.css";

// Constants
const MAX_DAILY_RESETS = 3;
const RESET_COUNTER_KEY = "demo_reset_counter";
const RESET_DATE_KEY = "demo_reset_date";

const ProblemCard = ({
  problem,
  userAnswer,
  setUserAnswer,
  isPro,
  notes,
  setNotes,
  handleSaveNotes,
  savedMessage,
  toggleNotes,
  showNotes,
  fetchNewProblem,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const { currentUser } = useAuth();
  const { isPro: isProUser } = useUser();
  console.log("currentUser isPro status", isProUser);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState({
    heading: "NO FEEDBACK",
    color: "text-gray-400",
    replace: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [showResetLimitModal, setShowResetLimitModal] = useState(false);

  // Use the enhanced feedback hook with demo mode enabled (for anonymous users on landing page)
  const {
    feedback,
    feedbackCategory: hookFeedbackCategory,
    loading: loadingFeedback,
    isComplete,
    isStreaming,
    fetchFeedback,
    demoConversationId,
    sessionId,
    resetFeedback,
  } = useFeedback(
    true, // This is a demo conversation (anonymous user)
    problem?._id, // Pass the problem ID for tracking
    {
      // Pass problem metadata
      title: problem?.title,
      difficulty: problem?.difficulty,
      category: problem?.category,
    }
  );

  // Load and initialize reset counter from localStorage
  useEffect(() => {
    const loadResetCounter = () => {
      const today = new Date().toDateString();
      const lastResetDate = localStorage.getItem(RESET_DATE_KEY);

      // If it's a new day, reset the counter
      if (lastResetDate !== today) {
        localStorage.setItem(RESET_COUNTER_KEY, "0");
        localStorage.setItem(RESET_DATE_KEY, today);
        setResetCount(0);
      } else {
        // Load existing count
        const storedCount = parseInt(
          localStorage.getItem(RESET_COUNTER_KEY) || "0",
          10
        );
        setResetCount(storedCount);
      }
    };

    loadResetCounter();
  }, []);

  // Function to increment the reset counter
  const incrementResetCounter = useCallback(() => {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem(RESET_DATE_KEY) || today;

    // If it's a new day, reset the counter
    if (lastResetDate !== today) {
      localStorage.setItem(RESET_COUNTER_KEY, "1"); // Start at 1 for the first reset
      localStorage.setItem(RESET_DATE_KEY, today);
      setResetCount(1);
      return 1;
    } else {
      // Increment existing count
      const currentCount = parseInt(
        localStorage.getItem(RESET_COUNTER_KEY) || "0",
        10
      );
      const newCount = currentCount + 1;
      localStorage.setItem(RESET_COUNTER_KEY, newCount.toString());
      setResetCount(newCount);
      return newCount;
    }
  }, []);

  const handleStartProblem = () => {
    setIsOverlayVisible(false);
    setIsTimerStarted(true);
  };

  // Use the feedbackCategory from the hook instead of local state
  useEffect(() => {
    if (hookFeedbackCategory) {
      setFeedbackCategory(hookFeedbackCategory);
    }
  }, [hookFeedbackCategory]);

  const handleSubmit = () => {
    // Don't submit if already loading or if answer is empty
    if (loadingFeedback || isStreaming || !userAnswer.trim()) {
      return;
    }

    // Set local state to prevent double-submissions
    // This is a UI safeguard in addition to the hook's internal checks
    setIsSubmitting(true);

    // Track submission in analytics if available
    if (window.gtag) {
      window.gtag("event", "demo_problem_submission", {
        event_category: "engagement",
        event_label: problem?.title,
        problem_id: problem?._id,
        demo_conversation_id: demoConversationId,
        session_id: sessionId,
      });
    }

    // Call the feedback function and reset the submission state when done
    fetchFeedback(problem.description, userAnswer, isPro).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleTimeout = () => {
    setTimeoutOccurred(true);
    setShowSolution(true);
    fetchFeedback(problem.description, "No solution provided", isPro);
  };

  const resetQuestion = () => {
    // Check if user has reached the daily reset limit
    if (resetCount >= MAX_DAILY_RESETS && !currentUser) {
      setShowResetLimitModal(true);

      // Track reset limit reached in analytics if available
      if (window.gtag) {
        window.gtag("event", "demo_reset_limit_reached", {
          event_category: "conversion",
          event_label: "Reset Limit Modal Shown",
          problem_id: problem?._id,
          problem_title: problem?.title,
        });
      }

      return;
    }

    // Increment reset counter if user is not logged in
    if (!currentUser) {
      incrementResetCounter();

      // Track reset usage in analytics if available
      if (window.gtag) {
        window.gtag("event", "demo_reset_used", {
          event_category: "engagement",
          event_label: `Reset ${resetCount + 1} of ${MAX_DAILY_RESETS}`,
          problem_id: problem?._id,
          problem_title: problem?.title,
        });
      }
    }

    // First reset the feedback and conversation state
    resetFeedback();

    // Then reset the UI state
    fetchNewProblem();
    setIsOverlayVisible(true);
    setShowSolution(false);
    setTimeoutOccurred(false);
    setIsTimerStarted(false);
    setUserAnswer("");
    setNotes("");
  };

  const handleFetchFeedback = () => {
    fetchFeedback(problem.description, "User solution here", isPro);
  };

  // Close the reset limit modal
  const closeResetLimitModal = () => {
    setShowResetLimitModal(false);
  };

  // Handle click on create account button
  const handleCreateAccountClick = () => {
    // Track conversion in analytics if available
    if (window.gtag) {
      window.gtag("event", "demo_create_account_click", {
        event_category: "conversion",
        event_label: "From Reset Limit Modal",
        problem_id: problem?._id,
        problem_title: problem?.title,
      });
    }

    // Close modal and redirect to signup
    closeResetLimitModal();
    window.location.href = "/signup";
  };

  return (
    <div className="p-4 pt-8 pb-0 w-full bg-gray-600 rounded-lg shadow-lg lg:pb-0 lg:p-8 hover:shadow-2xl hover:shadow-gray-800">
      {/* Reset Limit Modal */}
      {showResetLimitModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 mx-4 w-full max-w-md bg-gray-800 rounded-lg shadow-xl"
          >
            <h3 className="mb-4 text-xl font-bold text-white">
              Daily Limit Reached
            </h3>
            <p className="mb-6 text-gray-300">
              You've reached your daily limit of {MAX_DAILY_RESETS} question
              resets. Create a free account to access more questions and
              features.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeResetLimitModal}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <Link
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateAccountClick();
                }}
                className="px-4 py-2 text-center text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* Skeleton Preview Overlay */}
      {isOverlayVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center w-full"
        >
          {/* Title & Timer Skeleton */}
          <div className="flex flex-col justify-between items-center pb-4 mb-4 w-full border-b-4 border-gray-500 lg:flex-row">
            <div className="flex flex-col w-full text-center lg:w-2/3 lg:text-left">
              <h2 className="mb-2 text-xl font-bold tracking-tighter text-green-400 lg:text-3xl">
                {problem.title}
              </h2>

              <p className="text-sm tracking-widest text-gray-400">
                {problem.category}
              </p>

              {/* Tags & Difficulty Skeleton */}
              <div className="flex flex-wrap gap-2 justify-center my-4 w-full">
                <div className="flex gap-2 items-center px-3 py-1 text-sm font-black text-gray-400 rounded-sm bg-gray-700/50">
                  <FaStar className="w-4 h-4 text-gray-400" />
                  {problem.difficulty.toUpperCase()}
                </div>
                {problem.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 w-min text-xs tracking-wide text-gray-400 whitespace-nowrap rounded-full shadow-md bg-gray-700/50"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Area Skeleton */}
            <div className="flex justify-center items-center w-auto lg:w-32">
              <button
                onClick={handleStartProblem}
                className="px-4 py-2 font-bold text-black bg-green-400 rounded-lg border-2 border-green-400 animate-pulse hover:bg-green-500"
              >
                Begin
              </button>
            </div>
          </div>

          {/* Problem Description Skeleton */}
          <div className="p-4 mt-4 w-full rounded-lg bg-gray-700/50">
            <SquigglyPlaceholder lines={3} />
          </div>

          {/* Input Field & Buttons Skeleton */}
          <div className="flex flex-col gap-2 items-center my-4 w-full md:flex-row">
            <div className="w-full h-12 rounded-lg cursor-not-allowed bg-gray-700/50" />
            <div className="grid grid-cols-2 gap-2 items-center w-full">
              <div className="flex col-span-1 items-center w-full h-12 rounded-lg cursor-not-allowed md:w-auto bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400">
                  Reset Question
                </span>
              </div>
              <div className="flex col-span-1 items-center px-2 w-full h-12 rounded-lg cursor-not-allowed md:w-auto bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400 whitespace-nowrap">
                  Submit
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Section Skeleton */}
          <div className="p-8 pt-6 -mx-8 mb-6 w-full rounded-b-lg bg-gray-900/50">
            <div className="flex flex-col px-4 py-4 h-32 rounded-b-lg bg-gray-800/50 lg:flex-row">
              <div className="flex justify-center items-center p-4">
                <SiOpentofu className="w-16 h-16 text-gray-400 animate-pulse lg:animate-bounce" />
              </div>
              <div className="hidden flex-col my-auto w-full lg:flex">
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
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex flex-col gap-2 items-center mb-4 w-full md:items-start md:mb-0">
            <h1 className="text-3xl font-bold tracking-tighter text-center md:text-left">
              {problem.title}
            </h1>
            <p className="text-sm tracking-widest text-gray-400">
              {problem.category}
            </p>
            {/* Tags and Difficulty */}
            <div className="flex gap-2 justify-center mt-2 md:mt-0 md:justify-start">
              <span
                className={`flex items-center tracking-tighter font-black gap-2 px-2 py-1 text-black text-sm rounded-sm ${
                  problem.difficulty === "Easy"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : problem.difficulty === "Medium"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gradient-to-r from-red-400 to-red-500"
                }`}
              >
                <FaStar className="w-4 h-4 text-black" />
                {problem.difficulty.toUpperCase()}
              </span>
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs tracking-wide text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"
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
            isStarted={isTimerStarted}
          />
        </div>

        <div className="my-2 border-t-2 border-gray-500"></div>

        {/* Problem Description */}
        <div className="p-4 font-medium bg-gray-700 rounded-lg shadow-sm">
          <p>{problem.description}</p>
        </div>

        {/* User Input */}
        <div className="my-2 lg:my-4">
          <div className="flex flex-col gap-2 items-center w-full md:flex-row">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your Answer"
              className="p-2 w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex flex-row gap-2 justify-between items-center my-2 w-full md:w-min md:justify-end">
              <div className="flex flex-col items-start">
                <button
                  onClick={resetQuestion}
                  className="px-4 py-2 font-semibold text-black whitespace-nowrap bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Reset Question
                </button>
                {!currentUser && (
                  <div className="mt-1 ml-1 text-xs text-gray-400 md:hidden">
                    {MAX_DAILY_RESETS - resetCount} question resets left today
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 font-bold text-black bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingFeedback || isStreaming || isSubmitting}
              >
                {loadingFeedback ? "Analyzing..." : "Submit"}
              </button>
            </div>
          </div>
          {!currentUser && (
            <div className="hidden ml-1 text-xs text-gray-400 md:block">
              {MAX_DAILY_RESETS - resetCount} question resets left today
            </div>
          )}
        </div>

        {/* Feedback Section - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-2 -mx-4 bg-gray-900 rounded-b-lg shadow-md lg:-mx-8"
        >
          <AnimatePresence mode="wait">
            {/* If loading and no feedback yet, show loading state */}
            {loadingFeedback && !feedback ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col p-4"
              >
                <div className="flex justify-center items-center p-4 space-x-3 bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 border-green-500 animate-spin border-t-transparent"></div>
                  <p className="text-gray-300">Analyzing your solution...</p>
                </div>
              </motion.div>
            ) : feedback && !isOverlayVisible ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col p-4"
              >
                {/* Feedback Header - Redesigned */}
                <div
                  className={`flex items-center p-4 mb-4 rounded-lg ${feedbackCategory.bgColor}`}
                >
                  <span className="flex justify-center items-center mr-3 w-10 h-10 text-xl bg-gray-900 rounded-full">
                    {feedbackCategory.icon}
                  </span>
                  <div className="flex-1">
                    <h2
                      className={`text-lg font-bold ${feedbackCategory.color}`}
                    >
                      {feedbackCategory.heading}
                    </h2>
                    <p className="text-sm text-gray-300">
                      {feedbackCategory.description}
                    </p>
                  </div>
                </div>

                {/* Feedback Content - with LaTeX support */}
                <div
                  className={`p-4  rounded-lg bg-gray-800 border-l-4 ${feedbackCategory.color} shadow-md w-full overflow-x-hidden`}
                >
                  <div className="flex w-full">
                    <SiOpentofu
                      className={`mr-3 w-8 h-8 ${feedbackCategory.color} flex-shrink-0`}
                    />
                    <div className="overflow-x-auto flex-1 min-w-0">
                      {loadingFeedback && feedback === "" ? (
                        <div className="animate-pulse">
                          <div className="mb-2 w-3/4 h-4 bg-gray-700 rounded"></div>
                          <div className="mb-2 h-4 bg-gray-700 rounded"></div>
                          <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                        </div>
                      ) : (
                        <ProcessedText
                          text={feedback}
                          isStreaming={isStreaming}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="instructions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-2"
              >
                <div className="flex flex-col items-center p-6 w-full bg-gray-800 rounded-lg shadow-lg">
                  <div className="flex relative justify-center items-center mb-4">
                    {/* Icon with dynamic color */}
                    <SiOpentofu
                      className={`w-10 h-10 transition-colors duration-300 ${
                        isSubmitting ? "text-blue-400" : "text-gray-400"
                      }`}
                    />
                    {/* Overlay spinner if submitting */}
                    {isSubmitting && (
                      <div className="flex absolute justify-center items-center">
                        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-blue-400 animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-center text-gray-300">
                    {isSubmitting
                      ? "Analyzing your solution..."
                      : "Submit your answer to receive feedback"}
                  </p>
                  {isSubmitting && (
                    <div className="flex mt-3 space-x-1">
                      <span
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProblemCard;
