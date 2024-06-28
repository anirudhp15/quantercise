import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaCalculator,
  FaCode,
  FaCheck,
  FaChartLine,
  FaPuzzlePiece,
  FaBookmark,
  FaSyncAlt,
  FaLightbulb,
  FaTimes,
} from "react-icons/fa";
import { quantPracticeQuestions } from "../data/questions";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Switch } from "antd";

const categories = [
  {
    name: "Critical Mathematical Foundations",
    icon: <FaCalculator className="text-4xl text-blue-300" />,
    description: "Fundamental math concepts for quant interviews.",
  },
  {
    name: "Programming and Algorithmic Thinking",
    icon: <FaCode className="text-4xl text-sky-400" />,
    description: "Coding technicals and algorithmic problem solving.",
  },
  {
    name: "Financial Concepts and Modeling",
    icon: <FaChartLine className="text-4xl text-blue-500" />,
    description: "Financial ideas, theories and quantitative modeling.",
  },
  {
    name: "Brain Teasers and Logical Puzzles",
    icon: <FaPuzzlePiece className="text-4xl text-purple-500" />,
    description: "Puzzles and brain teasers to challenge your logic.",
  },
];

const PracticeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [toggleState, setToggleState] = useState({});

  const containerRef = useRef(null);

  useEffect(() => {
    const storedProblems = JSON.parse(localStorage.getItem("problems"));
    const storedToggleState = JSON.parse(localStorage.getItem("toggleState"));

    if (storedProblems && storedProblems.length > 0) {
      setProblems(storedProblems);
    } else {
      setProblems(quantPracticeQuestions);
    }

    if (storedToggleState) {
      setToggleState(storedToggleState);
    }
  }, []);

  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem("problems", JSON.stringify(problems));
    }
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("toggleState", JSON.stringify(toggleState));
  }, [toggleState]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProblem(null);
  };

  const handleReviewAllClick = () => {
    setSelectedCategory("All Topics");
    setSelectedProblem(null);
  };

  const handleBookmarkClick = () => {
    setSelectedCategory("Bookmarks");
    setSelectedProblem(null);
  };

  const handleRefreshAllClick = () => {
    const refreshedProblems = problems.map((problem) => ({
      ...problem,
      visited: false,
      completed: false,
      correct: null,
    }));
    setProblems(refreshedProblems);
  };

  const handleSolveProblem = (problem) => {
    setSelectedProblem(problem);
    setCurrentHintIndex(0);
    setHintsVisible(false);
    setStartTime(Date.now());
  };

  const handleCloseModal = () => {
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000;

    const updatedProblems = problems.map((problem) =>
      problem.id === selectedProblem.id
        ? {
            ...problem,
            attempts: problem.attempts + 1,
            timeSpent: problem.timeSpent + timeSpent,
            visited: true,
          }
        : problem
    );
    setProblems(updatedProblems);
    setSelectedProblem(null);
    setStartTime(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProblem(null);
  };

  const toggleProblemCompletion = (problemId, isCorrect) => {
    const updatedProblems = problems.map((problem) =>
      problem.id === problemId
        ? {
            ...problem,
            completed: true,
            correct: isCorrect,
          }
        : problem
    );
    setProblems(updatedProblems);

    setToggleState((prev) => ({
      ...prev,
      [problemId]: isCorrect ? "correct" : "incorrect",
    }));
  };

  const toggleBookmarkProblem = (problemId) => {
    const isBookmarked = bookmarkedProblems.includes(problemId);
    const updatedBookmarks = isBookmarked
      ? bookmarkedProblems.filter((id) => id !== problemId)
      : [...bookmarkedProblems, problemId];

    setBookmarkedProblems(updatedBookmarks);
  };

  const showNextHint = () => {
    setCurrentHintIndex((prevIndex) => prevIndex + 1);
    setHintsVisible(true);
  };

  const renderCategories = () => (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          to="/"
          className="p-4 font-bold text-center text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg md:col-span-2 hover:bg-gray-700"
        >
          Back to Home
        </Link>
        {categories.map((category) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <button
              className="relative z-10 w-full p-8 font-bold transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-10 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="flex items-center justify-start space-x-4">
                {category.icon}
                <div>
                  <h2 className="text-2xl">{category.name}</h2>
                  <p className="mt-2 font-thin text-gray-300">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col justify-center w-1/2 mx-auto mt-8 space-y-4 text-center md:mx-0 md:w-full md:flex-row md:space-y-0 md:space-x-4">
        <button
          className="h-full px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700"
          onClick={handleReviewAllClick}
        >
          All Problems
        </button>
        <button
          className="h-full px-4 py-2 font-bold text-white transition duration-300 bg-yellow-600 rounded hover:bg-yellow-700"
          onClick={handleBookmarkClick}
        >
          Bookmarks
        </button>
        <button
          className="h-full px-4 py-2 font-bold text-white transition duration-300 bg-red-600 rounded hover:bg-red-700"
          onClick={handleRefreshAllClick}
        >
          <FaSyncAlt className="inline-block mr-2" />
          Refresh All Problems
        </button>
      </div>
    </div>
  );

  const renderProblems = () => {
    const problemsToShow =
      selectedCategory === "Bookmarks"
        ? problems.filter((problem) => bookmarkedProblems.includes(problem.id))
        : problems.filter(
            (problem) =>
              selectedCategory === "All Topics" ||
              problem.category === selectedCategory
          );

    if (problemsToShow.length === 0) {
      return (
        <div className="w-full text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full p-4 mb-4 font-bold text-green-400 transition duration-300 transform bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Back to Home
          </Link>
          <p className="text-lg font-semibold text-gray-300">
            No problems available for this category.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 pb-12">
        <button
          className="p-4 font-bold text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 hover:text-white hover:scale-105"
          onClick={handleBackToCategories}
        >
          Back to Categories
        </button>
        {problemsToShow.map((problem) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative group p-6 bg-gray-800 shadow-lg rounded-xl ${
              !problem.visited ? "border border-green-400" : "opacity-50"
            }`}
          >
            <h2 className="text-xl font-semibold text-green-400">
              {problem.title}
            </h2>
            <p className="mt-2 text-gray-300">{problem.description}</p>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span
                  className={`inline-block px-2 py-1 text-sm font-bold rounded-full ${
                    problem.difficulty === "Easy"
                      ? "bg-green-600"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
                {problem.completed && (
                  <span
                    className={`ml-2 inline-block px-2 py-1 text-sm font-bold rounded ${
                      problem.correct ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {problem.correct ? "Correct" : "Incorrect"}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700"
                  onClick={() => handleSolveProblem(problem)}
                >
                  Solve Problem
                </button>
                <button
                  className={`p-2 rounded-full ${
                    bookmarkedProblems.includes(problem.id)
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => toggleBookmarkProblem(problem.id)}
                >
                  <FaBookmark
                    size={20}
                    className="transition-all duration-200 hover:text-yellow-400"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProblemSolution = () => (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-xl p-8 text-gray-300 bg-gray-800 shadow-xl rounded-xl"
      >
        <button
          className="absolute p-2 text-red-400 transition-all duration-200 transform top-2 right-2 hover:scale-110 hover:text-red-600"
          onClick={handleCloseModal}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-3xl font-bold text-green-400">
          {selectedProblem.title}
        </h2>
        <p className="mt-4 text-lg">{selectedProblem.solution}</p>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-400">Hint:</h3>
          {hintsVisible && (
            <div>
              {selectedProblem.hints
                .slice(0, currentHintIndex + 1)
                .map((hint, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <FaLightbulb className="mr-2 text-yellow-400" />
                    <p>{hint}</p>
                  </div>
                ))}
              <div className="relative mt-4">
                <div className="flex h-2 overflow-hidden text-xs bg-green-200 rounded">
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
                {currentHintIndex + 1 < selectedProblem.hints.length ? (
                  <button
                    className="px-4 py-2 mt-2 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
                    onClick={showNextHint}
                  >
                    Next Hint
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 mt-2 font-bold text-white transition duration-300 bg-red-600 rounded hover:bg-red-700"
                    onClick={() => setHintsVisible(false)}
                  >
                    Close Hints
                  </button>
                )}
              </div>
            </div>
          )}
          {!hintsVisible && (
            <button
              className="px-4 py-2 mt-2 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => {
                setHintsVisible(true);
                setCurrentHintIndex(0);
              }}
            >
              Show Hint
            </button>
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm">
            <strong>Attempts:</strong> {selectedProblem.attempts}
          </p>
          <p className="text-sm">
            <strong>Time Spent:</strong> {Math.round(selectedProblem.timeSpent)}{" "}
            seconds
          </p>
        </div>

        <div className="flex justify-between mt-8 space-x-4">
          <div className="flex items-center space-x-4">
            <label className="font-bold text-md">Mark Correct</label>
            <Switch
              checked={toggleState[selectedProblem.id] === "correct"}
              onChange={() => {
                setToggleState((prev) => ({
                  ...prev,
                  [selectedProblem.id]:
                    prev[selectedProblem.id] === "correct" ? null : "correct",
                }));
                toggleProblemCompletion(selectedProblem.id, true);
              }}
              checkedChildren={<FaCheck className="mt-1 mr-1 text-white" />}
              className={`${
                toggleState[selectedProblem.id] === "correct"
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="font-bold text-md">Mark Incorrect</label>
            <Switch
              checked={toggleState[selectedProblem.id] === "incorrect"}
              onChange={() => {
                setToggleState((prev) => ({
                  ...prev,
                  [selectedProblem.id]:
                    prev[selectedProblem.id] === "incorrect"
                      ? null
                      : "incorrect",
                }));
                toggleProblemCompletion(selectedProblem.id, false);
              }}
              checkedChildren={<FaTimes className="mt-1 mr-1 text-white" />}
              className={`${
                toggleState[selectedProblem.id] === "incorrect"
                  ? "bg-red-600"
                  : "bg-gray-600"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 mt-16 text-gray-300 bg-gray-900">
      <div className="max-w-screen-lg mx-auto">
        {!selectedProblem && (
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-4 text-4xl font-bold text-green-400"
          >
            Practice Problems
          </motion.h1>
        )}
        {selectedProblem
          ? renderProblemSolution()
          : selectedCategory
          ? renderProblems()
          : renderCategories()}
      </div>
    </div>
  );
};

export default PracticeProblems;
