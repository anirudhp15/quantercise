import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaTimes, FaCheck, FaStar } from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import { Switch } from "antd";
import ProblemTimer from "./ProblemTimer";
import { ReactTyped } from "react-typed";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";

const ProblemSolution = ({
  currentUser,
  selectedProblem,
  hintsVisible,
  currentHintIndex,
  showNextHint,
  setHintsVisible,
  setCurrentHintIndex,
  setSolutionVisible,
  solutionVisible,
  handleCloseModal,
  toggleProblemCompletion,
  toggleState,
  isPro,
  startTime,
  userAnswer,
  setUserAnswer,
  notes,
  setNotes,
  handleSaveNotes,
  savedMessage,
  showNotes,
  toggleNotes,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false); // Track timeout state
  const [feedback, setFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState({
    heading: "",
    color: "",
    replace: "",
  });

  const { fetchFeedback } = useFeedback();

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
    if (timeoutOccurred) return;
    setShowSolution(true);

    if (!userAnswer || userAnswer.trim() === "") {
      fetchFeedback(
        selectedProblem.description,
        "No solution provided",
        categorizeFeedback
      );
      return;
    }

    fetchFeedback(selectedProblem.description, userAnswer, categorizeFeedback);
  };

  const handleTimeout = () => {
    setTimeoutOccurred(true); // Mark timeout as occurred
    setShowSolution(true); // Show solution

    // Set feedback and category for timeout
    setFeedback("No solution was given");
    setFeedbackCategory({
      heading: "NO SOLUTION",
      color: "text-gray-400",
      replace: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center"
    >
      <div className="relative w-full p-8 mx-8 mt-8 bg-gray-800 rounded-lg shadow-2xl max-w-screen-4xl">
        {/* Title and Timer */}
        <button
          onClick={handleCloseModal}
          className="absolute right-0 p-1 text-gray-400 bg-gray-500 border-4 border-gray-700 -top-[68px] hover:bg-gray-600 rounded-xl hover:text-red-500"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-600">
          <div className="flex flex-col">
            <h2 className="mb-2 text-3xl font-bold tracking-tighter text-green-400">
              {selectedProblem.title}
            </h2>
            <p className="text-sm tracking-widest text-gray-400">
              {selectedProblem.category}
            </p>
            {/* Tags and Difficulty */}
            <div className="flex gap-2 my-4">
              <span
                className={`flex items-center tracking-tighter font-black gap-2 px-3 py-1 text-black text-sm rounded-sm ${
                  selectedProblem.difficulty === "Easy"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : selectedProblem.difficulty === "Medium"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
              >
                <FaStar className="w-4 h-4 text-black" />
                {selectedProblem.difficulty.toUpperCase()}
              </span>
              {selectedProblem.tags.map((tag, index) => (
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
            difficulty={selectedProblem.difficulty}
            onTimeout={handleTimeout}
            feedbackCategory={feedbackCategory.heading}
          />
        </div>

        {/* Problem Description */}
        <div className="p-4 mt-4 font-medium bg-gray-700 rounded-lg shadow-sm">
          <p>{selectedProblem.description}</p>
        </div>

        {/* Hints and Notes Section */}
        <div className="flex flex-col h-[300px] gap-4 mt-4 mb-8 lg:flex-row">
          {/* Hints Section */}
          <div
            className={`relative flex-1 p-8 h-full rounded-lg shadow-inner ${
              hintsVisible ? "bg-gray-600" : "bg-gray-900"
            }`}
          >
            <h3 className="text-xl font-semibold text-green-400">Hints</h3>
            {hintsVisible ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex h-4 my-1 overflow-hidden text-xs bg-gray-800 rounded">
                    <div
                      style={{
                        width: `${
                          ((currentHintIndex + 1) /
                            selectedProblem.hints.length) *
                          100
                        }%`,
                      }}
                      className="flex flex-col justify-center text-center text-white transition-all duration-500 ease-in-out bg-green-500 shadow-none progress-bar whitespace-nowrap"
                    ></div>
                  </div>
                  {selectedProblem.hints
                    .slice(0, currentHintIndex + 1)
                    .map((hint, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 my-2 rounded-lg bg-gray-950"
                      >
                        <FaLightbulb className="mr-2 text-yellow-500" />
                        <p className="text-gray-300">{hint}</p>
                      </div>
                    ))}
                </div>
                <div className="pb-4">
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                    {currentHintIndex + 1 < selectedProblem.hints.length ? (
                      <button
                        className="px-3 py-2 font-bold text-white transition-colors duration-300 bg-green-400 rounded shadow-md hover:bg-green-500"
                        onClick={showNextHint}
                      >
                        Next Hint
                      </button>
                    ) : (
                      <p className="font-bold text-gray-400 ">
                        All hints shown!
                      </p>
                    )}
                    <button
                      className="px-3 py-2 font-semibold text-white bg-red-600 rounded shadow-sm hover:bg-red-700"
                      onClick={() => setHintsVisible(false)}
                    >
                      Hide Hints
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full pb-8">
                <p className="text-gray-500">Hints are hidden.</p>
                {!hintsVisible && (
                  <button
                    className="px-4 py-2 font-bold text-black transition-colors duration-300 rounded-lg shadow-md bg-green-400/85 hover:bg-green-300"
                    onClick={() => setHintsVisible(true)}
                  >
                    Show Hint
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div
            className={`relative flex-1 p-8 h-full rounded-lg shadow-inner ${
              showNotes ? "bg-gray-700" : "bg-gray-900"
            }`}
          >
            <h3 className="text-xl font-semibold text-blue-400">Notes</h3>
            {showNotes ? (
              <>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your notes here..."
                  className="w-full p-3 mt-2 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between mt-4 text-sm">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-2 font-semibold text-white bg-blue-500 rounded shadow-md hover:bg-blue-600"
                  >
                    Save Notes
                  </button>
                  {savedMessage && (
                    <p className="text-sm font-semibold text-green-400">
                      Notes saved!
                    </p>
                  )}
                  <button
                    className="px-3 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-800"
                    onClick={toggleNotes}
                  >
                    Hide Notes
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-between h-full pb-8">
                <p className="text-gray-500">Notes are hidden.</p>
                {!showNotes && (
                  <button
                    className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
                    onClick={toggleNotes}
                  >
                    Show Notes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Input */}
        <div className="flex items-center gap-2 my-8">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your Answer"
            className="w-full p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-700 hover:ring-green-600 hover:ring-2"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-[10px] font-bold text-black bg-green-500 rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        </div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="p-8 pt-4 -mx-8 -mb-8 bg-gray-900 rounded-b-lg shadow-md"
        >
          {showSolution && (
            <h2 className={`text-lg py-2 font-bold ${feedbackCategory.color}`}>
              {feedbackCategory.heading}
            </h2>
          )}

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
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProblemSolution;
