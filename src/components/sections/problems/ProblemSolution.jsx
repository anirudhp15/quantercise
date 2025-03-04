import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb, FaTimes, FaCheck, FaStar, FaPlus } from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import { Switch } from "antd";
import ProblemTimer from "./ProblemTimer";
import { ReactTyped } from "react-typed";
import { useFeedback } from "../../../hooks/useFetch/useFetchFeedback";
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
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const {
    feedback,
    feedbackCategory,
    loading: loadingFeedback,
    isComplete,
    fetchFeedback,
  } = useFeedback();

  const handleStartProblem = () => {
    setIsOverlayVisible(false);
  };

  const handleSubmit = () => {
    if (timeoutOccurred) return;
    setShowSolution(true);

    if (!userAnswer || userAnswer.trim() === "") {
      fetchFeedback(selectedProblem.description, "No solution provided", isPro);
      return;
    }

    fetchFeedback(selectedProblem.description, userAnswer, isPro);
  };

  const handleTimeout = () => {
    setTimeoutOccurred(true);
    setShowSolution(true);
    fetchFeedback(selectedProblem.description, "No solution provided", isPro);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center"
    >
      <div className="relative p-8 mx-4 mt-8 w-full bg-gray-800 rounded-lg shadow-2xl max-w-screen-4xl">
        {/* Title and Timer */}
        <button
          onClick={handleCloseModal}
          className="absolute right-0 p-1 text-gray-400 bg-gray-500 border-4 border-gray-700 -top-[68px] hover:bg-gray-600 rounded-xl hover:text-red-500"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {isOverlayVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center w-full h-min"
          >
            {/* Title Section */}
            <div className="flex justify-between items-center pb-2 mb-4 w-full border-b-4 border-gray-600 h-min">
              <div className="flex flex-col w-full">
                <h2 className="mb-2 text-3xl font-bold tracking-tighter text-green-400">
                  {selectedProblem.title}
                </h2>
                <p className="text-sm tracking-widest text-gray-400">
                  {selectedProblem.category}
                </p>

                {/* Tags & Difficulty Skeleton */}
                <div className="flex gap-2 my-4">
                  <div className="flex gap-2 items-center px-3 py-1 text-sm font-black text-gray-600 rounded-sm bg-gray-700/50">
                    <FaStar className="w-4 h-4 text-gray-600" />
                    {selectedProblem.difficulty.toUpperCase()}
                  </div>
                  {selectedProblem.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 tracking-wide text-gray-400 rounded-full shadow-md bg-gray-700/50"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer Area Skeleton */}
              <div className="flex flex-col justify-center items-center w-32 rounded-full border-2 border-green-400 aspect-square bg-gray-700/50">
                <button
                  onClick={handleStartProblem}
                  className="p-6 font-bold text-black bg-green-400 rounded-full border-2 border-green-400 animate-pulse aspect-square hover:bg-green-500"
                >
                  Begin
                </button>
              </div>
            </div>

            {/* Problem Description Skeleton */}
            <div className="p-4 mt-4 w-full rounded-lg bg-gray-700/50">
              <SquigglyPlaceholder lines={3} />
            </div>

            {/* Input Field Skeleton */}
            <div className="flex gap-2 items-center my-4 w-full">
              <div className="w-full h-12 rounded-lg cursor-not-allowed bg-gray-700/50" />
              <div className="flex items-center w-24 h-12 rounded-lg cursor-not-allowed bg-gray-700/50">
                <span className="w-full font-bold text-center text-gray-400">
                  Submit
                </span>
              </div>
            </div>

            {/* Hints & Notes Section Skeleton */}
            <div className="flex flex-col lg:h-[300px] gap-4 mb-8 lg:flex-row w-full">
              {/* Hints Panel */}
              <div className="relative flex-1 p-8 h-full rounded-lg bg-gray-900/50">
                <div className="mb-4">
                  <SquigglyPlaceholder lines={1} width="60px" />
                </div>
                <div className="my-1 h-4 rounded bg-gray-800/50" />
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="p-4 my-2 rounded-lg bg-gray-800/50"
                  >
                    <SquigglyPlaceholder lines={2} />
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <div className="w-24 h-8 rounded cursor-not-allowed bg-gray-700/50" />
                  <div className="w-24 h-8 rounded cursor-not-allowed bg-gray-700/50" />
                </div>
              </div>

              {/* Notes Panel */}
              <div className="relative flex-1 p-8 h-full rounded-lg bg-gray-900/50">
                <div className="mb-4">
                  <SquigglyPlaceholder lines={1} width="60px" />
                </div>
                <div className="h-32 rounded-lg bg-gray-800/50" />
                <div className="flex gap-2 mt-4">
                  <div className="w-24 h-8 rounded cursor-not-allowed bg-gray-700/50" />
                  <div className="w-24 h-8 rounded cursor-not-allowed bg-gray-700/50" />
                </div>
              </div>
            </div>

            {/* Feedback Section Skeleton */}
            <div className="p-8 pt-4 -mx-8 -mb-8 w-full rounded-b-lg bg-gray-900/50">
              <div className="h-32 rounded-lg bg-gray-800/50" />
            </div>
          </motion.div>
        )}

        {/* Content revealed after starting the problem */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isOverlayVisible ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`transition-all duration-500 ${
            isOverlayVisible ? "bg-black" : "bg-transparent"
          }`}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center pb-2 mb-4 border-b-4 border-gray-600">
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
                      className="px-3 py-1 text-sm tracking-wide text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"
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

            {/* User Input */}
            <div className="flex gap-2 items-center my-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your Answer"
                className="p-3 w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-700 hover:ring-green-600 hover:ring-2"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-[10px] font-bold text-black bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingFeedback || timeoutOccurred}
              >
                {loadingFeedback ? "Analyzing..." : "Submit"}
              </button>
            </div>

            {/* Hints and Notes Section */}
            <div className="flex flex-col lg:h-[300px] gap-4 mb-8 lg:flex-row">
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
                      <div className="flex overflow-hidden my-1 h-4 text-xs bg-gray-800 rounded">
                        <div
                          style={{
                            width: `${
                              ((currentHintIndex + 1) /
                                selectedProblem.hints.length) *
                              100
                            }%`,
                          }}
                          className="flex flex-col justify-center text-center text-white whitespace-nowrap bg-green-500 shadow-none transition-all duration-500 ease-in-out progress-bar"
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
                      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                        {currentHintIndex + 1 < selectedProblem.hints.length ? (
                          <button
                            className="px-3 py-2 font-bold text-white bg-green-400 rounded shadow-md transition-colors duration-300 hover:bg-green-500"
                            onClick={showNextHint}
                          >
                            Next Hint
                          </button>
                        ) : (
                          <p className="font-bold text-gray-400">
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
                  <div className="flex flex-col justify-between pb-8 h-full">
                    <p className="text-gray-500">Hints are hidden.</p>
                    {!hintsVisible && (
                      <button
                        className="px-4 py-2 font-bold text-black rounded-lg shadow-md transition-colors duration-300 bg-green-400/85 hover:bg-green-300"
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
                      className="p-3 mt-2 w-full text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between items-center mt-4 text-sm">
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
                  <div className="flex flex-col justify-between pb-8 h-full">
                    <p className="text-gray-500">Notes are hidden.</p>
                    {!showNotes && (
                      <button
                        className="px-4 py-2 font-bold text-white bg-gray-700 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-600"
                        onClick={toggleNotes}
                      >
                        Show Notes
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Section - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <AnimatePresence mode="wait">
                {loadingFeedback ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center items-center p-6 space-y-4 bg-gray-700 rounded-lg"
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
                    className="overflow-hidden bg-gray-700 rounded-lg"
                  >
                    {/* Feedback Header - Redesigned */}
                    <div
                      className={`flex items-center p-4 ${feedbackCategory.bgColor}`}
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
                    <div className="p-6">
                      <div
                        className={`p-5 rounded-lg bg-gray-800 border-l-4 ${feedbackCategory.color} shadow-md`}
                      >
                        <div className="flex">
                          <SiOpentofu
                            className={`flex-shrink-0 mr-3 w-8 h-8 ${feedbackCategory.color}`}
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
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="instructions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center p-8 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                      <SiOpentofu className="mr-4 w-10 h-10 text-gray-400" />
                      <p className="text-gray-300">
                        Submit your answer to receive feedback
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProblemSolution;
