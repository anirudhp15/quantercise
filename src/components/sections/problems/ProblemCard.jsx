import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import ProblemTimer from "./ProblemTimer";
import { motion, AnimatePresence } from "framer-motion";
import { ReactTyped } from "react-typed";
import { SiOpentofu } from "react-icons/si";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";
import { useAuth } from "../../../contexts/authContext";
import SquigglyPlaceholder from "../../parts/SquigglyPlaceholder";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// Helper function to process text and render LaTeX
const ProcessedText = ({ text }) => {
  if (!text) return null;

  // Regular expression to find LaTeX expressions
  // Matches both inline $...$ and block $$...$$
  const latexRegex = /(\$\$[\s\S]+?\$\$)|(\$[\s\S]+?\$)/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let index = 0;

  // Find all LaTeX expressions
  while ((match = latexRegex.exec(text)) !== null) {
    // Add text before the LaTeX expression
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
        key: `text-${index}`,
      });
      index++;
    }

    // Add the LaTeX expression
    const isBlock = match[0].startsWith("$$");
    const expression = isBlock
      ? match[0].substring(2, match[0].length - 2)
      : match[0].substring(1, match[0].length - 1);

    parts.push({
      type: isBlock ? "block" : "inline",
      content: expression,
      key: `latex-${index}`,
    });
    index++;

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last LaTeX expression
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex),
      key: `text-${index}`,
    });
  }

  // Render all parts
  return (
    <div className="whitespace-pre-line feedback-content">
      {parts.map((part) => {
        if (part.type === "text") {
          return <span key={part.key}>{part.content}</span>;
        } else if (part.type === "inline") {
          try {
            return <InlineMath key={part.key} math={part.content} />;
          } catch (e) {
            return <span key={part.key}>${part.content}$</span>;
          }
        } else if (part.type === "block") {
          try {
            return <BlockMath key={part.key} math={part.content} />;
          } catch (e) {
            return <span key={part.key}>$${part.content}$$</span>;
          }
        }
        return null;
      })}
    </div>
  );
};

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
  const [timeoutOccurred, setTimeoutOccurred] = useState(false); // Track timeout state
  const { currentUser } = useAuth();
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [feedbackCategory, setFeedbackCategory] = useState({
    heading: "NO FEEDBACK",
    color: "text-gray-400",
    replace: "",
  });

  const handleStartProblem = () => {
    setIsOverlayVisible(false);
  };

  const {
    feedback,
    feedbackCategory: hookFeedbackCategory,
    loading: loadingFeedback,
    isComplete,
    fetchFeedback,
  } = useFeedback();

  // Use the feedbackCategory from the hook instead of local state
  useEffect(() => {
    if (hookFeedbackCategory) {
      setFeedbackCategory(hookFeedbackCategory);
    }
  }, [hookFeedbackCategory]);

  const handleSubmit = () => {
    if (timeoutOccurred) return; // Prevent submission after timeout

    setShowSolution(true);

    if (!userAnswer || userAnswer.trim() === "") {
      // If user hasn't provided an answer
      fetchFeedback(problem.description, "No solution provided", isPro);

      return;
    }

    // Fetch feedback only if an answer is provided
    fetchFeedback(problem.description, userAnswer, isPro);
  };

  const handleTimeout = () => {
    setTimeoutOccurred(true); // Mark timeout as occurred
    setShowSolution(true); // Show solution

    fetchFeedback(problem.description, "No solution provided", isPro);
  };

  const resetQuestion = () => {
    fetchNewProblem();
    setIsOverlayVisible(true);
    setShowSolution(false);
    setTimeoutOccurred(false); // Reset timeout state
    setUserAnswer("");
    setNotes("");
  };

  const handleFetchFeedback = () => {
    fetchFeedback(problem.description, "User solution here", isPro);
  };

  return (
    <div className="p-8 pb-0 w-full bg-gray-600 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-gray-800">
      {/* Skeleton Preview Overlay */}
      {isOverlayVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center w-full"
        >
          {/* Title & Timer Skeleton */}
          <div className="flex justify-between items-center pb-2 mb-4 w-full border-b-4 border-gray-500">
            <div className="flex flex-col w-full lg:w-2/3">
              <h2 className="mb-2 text-xl font-bold tracking-tighter text-green-400 lg:text-3xl">
                {problem.title}
              </h2>

              <p className="text-sm tracking-widest text-gray-400">
                {problem.category}
              </p>

              {/* Tags & Difficulty Skeleton */}
              <div className="flex flex-wrap gap-2 my-4">
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
                className="px-6 py-3 font-bold text-black bg-green-400 rounded-lg border-2 border-green-400 animate-pulse lg:p-6 lg:rounded-full hover:bg-green-500"
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
                  Submit
                </span>
              </div>
              <div className="flex col-span-1 items-center px-2 w-full h-12 rounded-lg cursor-not-allowed md:w-auto bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400 whitespace-nowrap">
                  Reset Question
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
        <div className="flex justify-between items-center">
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
                  className="px-3 py-1 text-sm tracking-wide text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"
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
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your Answer"
              className="p-2 w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={timeoutOccurred || loadingFeedback}
            >
              {loadingFeedback ? "Analyzing..." : "Submit"}
            </button>
            <button
              onClick={resetQuestion}
              className="px-4 py-2 font-semibold text-white whitespace-nowrap bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Reset Question
            </button>
          </div>
        </div>

        {/* Feedback Section - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-4 -mx-8 bg-gray-900 rounded-b-lg shadow-md"
        >
          <AnimatePresence mode="wait">
            {loadingFeedback ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center p-6 space-y-4"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="absolute inset-0 w-full h-full rounded-full border-t-4 border-blue-500"
                  />
                  <SiOpentofu className="absolute inset-0 mx-auto my-auto w-12 h-12 text-blue-400" />
                </div>
                <p className="text-lg font-medium text-blue-300">
                  Analyzing your solution...
                </p>
              </motion.div>
            ) : showSolution ? (
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
                  className={`p-5 rounded-lg bg-gray-800 border-l-4 ${feedbackCategory.color} shadow-md`}
                >
                  <div className="flex mb-4">
                    <SiOpentofu
                      className={`mr-3 w-8 h-8 ${feedbackCategory.color}`}
                    />
                    <div className="flex-1">
                      {isComplete ? (
                        <ProcessedText text={feedback} />
                      ) : (
                        <div className="animate-pulse">
                          <div className="mb-2 w-3/4 h-4 bg-gray-700 rounded"></div>
                          <div className="mb-2 h-4 bg-gray-700 rounded"></div>
                          <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                        </div>
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
                className="flex justify-center items-center p-6"
              >
                <div className="flex items-center p-4 w-full bg-gray-800 rounded-lg">
                  <SiOpentofu className="mr-4 w-10 h-10 text-gray-400" />
                  <p className="text-gray-300">
                    Submit your answer to receive feedback
                  </p>
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
