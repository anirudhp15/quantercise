import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import ProblemTimer from "./ProblemTimer";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { SiOpentofu } from "react-icons/si";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";

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

  const { feedback, feedbackCategory, fetchFeedback } = useFeedback();

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
    setShowSolution(false);
    setTimeoutOccurred(false); // Reset timeout state
    setUserAnswer("");
    setNotes("");
  };

  return (
    <div className="w-full p-8 pb-0 bg-gray-600 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-gray-800">
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
      <div className="py-8">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your Answer"
            className="w-full p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-[10px] font-bold text-black bg-green-500 rounded-lg hover:bg-green-600"
            disabled={timeoutOccurred} // Disable button after timeout
          >
            Submit
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={toggleNotes}
            className="px-4 py-2 font-semibold text-white bg-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-800"
          >
            {showNotes ? "Hide Notes" : "Add Notes"}
          </button>
          <button
            onClick={resetQuestion}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg whitespace-nowrap hover:bg-blue-600"
          >
            Reset Question
          </button>
        </div>
      </div>

      {/* Notes */}
      {showNotes && (
        <div className="mt-4">
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full p-3 mt-1 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-row items-center justify-between mt-2">
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded shadow-sm hover:shadow-lg hover:bg-blue-600"
            >
              Save Notes
            </button>

            {savedMessage && (
              <p className="text-sm font-semibold text-green-400">
                Notes saved!
              </p>
            )}
            <div className="mt-1 text-sm text-gray-400">
              {notes.length} / 500 characters
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {showSolution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-8 pt-4 -mx-8 bg-gray-900 rounded-b-lg shadow-md"
        >
          <h2 className={`text-lg py-2 font-bold ${feedbackCategory.color}`}>
            {feedbackCategory.heading}
          </h2>
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
              className="p-4 mt-4 bg-gray-700 rounded-lg shadow-md"
            >
              <SiOpentofu className="inline-block mr-4 text-4xl text-blue-400" />
              <ReactTyped
                strings={[
                  feedback.replace(feedbackCategory.heading, "").trim(),
                ]}
                typeSpeed={1}
                className="mt-2 text-sm leading-[3rem] text-gray-300"
                loop={false}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProblemCard;
