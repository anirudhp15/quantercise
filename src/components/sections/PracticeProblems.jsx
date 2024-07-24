import React, { useState, useEffect, useRef, useContext } from "react";
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
  FaLock,
} from "react-icons/fa";
import {
  quantPracticeQuestions,
  quantQuestionsVersion,
} from "../data/quant_questions";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Switch, Rate, Input, Tooltip } from "antd";
import AuthContext from "../../contexts/authContext";
import AnimatedGrid from "../landing/AnimatedGrid";

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

const calculateAverageDifficulty = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return (sum / ratings.length).toFixed(2);
};

const PracticeProblems = () => {
  const { currentUser, isPro } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [toggleState, setToggleState] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [comments, setComments] = useState([]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const storedVersion = localStorage.getItem("quantQuestionsVersion");
    const storedProblems = JSON.parse(localStorage.getItem("problems"));

    if (
      storedVersion !== quantQuestionsVersion.toString() ||
      !storedProblems ||
      storedProblems.length === 0
    ) {
      localStorage.removeItem("problems");
      localStorage.setItem(
        "quantQuestionsVersion",
        quantQuestionsVersion.toString()
      );
      localStorage.setItem("problems", JSON.stringify(quantPracticeQuestions));
      setProblems(quantPracticeQuestions);
    } else {
      const initializedProblems = storedProblems.map((problem) => ({
        ...problem,
        userDifficultyRatings: problem.userDifficultyRatings || [],
        difficultyScore: problem.difficultyScore,
        difficulty: problem.difficulty,
      }));
      setProblems(initializedProblems);
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
    if (!isPro && problem.isPro) {
      return; // Prevent access to Pro questions for free users
    }
    setSelectedProblem(problem);
    setCurrentHintIndex(0);
    setHintsVisible(false);
    setSolutionVisible(false);
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

  const submitRating = (value) => {
    const updatedProblems = problems.map((problem) => {
      if (problem.id === selectedProblem.id) {
        const newRatings = [...(problem.userDifficultyRatings || []), value];
        const averageRating =
          newRatings.reduce((acc, rating) => acc + rating, 0) /
          newRatings.length;
        return {
          ...problem,
          difficultyScore: problem.difficultyScore,
          userDifficultyRatings: newRatings,
          averageDifficulty: averageRating.toFixed(2), // Keeping two decimals for average
        };
      }
      return problem;
    });
    setProblems(updatedProblems);
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 1000); // Reset after 1s
  };

  const submitFeedback = () => {
    setComments((prevComments) => [
      ...prevComments,
      { problemId: selectedProblem.id, feedback },
    ]);
    setFeedback("");
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
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
      </motion.div>
    </div>
  );

  const renderProblems = () => {
    const filteredProblems = problems; // Show all problems regardless of Pro status

    const problemsToShow =
      selectedCategory === "Bookmarks"
        ? filteredProblems.filter((problem) =>
            bookmarkedProblems.includes(problem.id)
          )
        : filteredProblems.filter(
            (problem) =>
              selectedCategory === "All Topics" ||
              problem.category === selectedCategory
          );

    if (problemsToShow.length === 0) {
      return (
        <div className="grid grid-cols-1 gap-6 pb-12 text-center">
          <button
            className="p-4 font-bold text-center text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg md:col-span-2 hover:bg-gray-700"
            onClick={handleBackToCategories}
          >
            Back to Categories
          </button>
          <p className="text-lg font-semibold text-gray-300">
            No problems available for this category.
          </p>
        </div>
      );
    }

    const sortedProblems = problemsToShow.sort((a, b) => {
      if (!isPro) {
        return a.isPro === b.isPro ? 0 : a.isPro ? 1 : -1;
      }
      return 0;
    });

    return (
      <div className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        <button
          className="p-4 mb-2 font-bold text-center text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg md:col-span-full hover:bg-gray-700"
          onClick={handleBackToCategories}
        >
          Back to Categories
        </button>
        {sortedProblems.map((problem) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative group p-4 bg-gray-800 shadow-lg rounded-lg ${
              !problem.visited && !problem.completed
                ? "border border-green-400"
                : "border border-gray-700"
            } hover:scale-105 transition-transform duration-300 ${
              !isPro && problem.isPro ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSolveProblem(problem)}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-green-400 truncate text-md">
                {problem.title}
              </h2>
              <button
                className={`p-1 rounded-full ${
                  bookmarkedProblems.includes(problem.id)
                    ? "text-yellow-500"
                    : "text-gray-400"
                } hover:text-yellow-600 transition-all hover:scale-105 duration-300`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmarkProblem(problem.id);
                }}
              >
                <FaBookmark size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between my-2 text-black">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  problem.difficulty === "Easy"
                    ? "bg-green-500"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {problem.difficulty.toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 text-xs font-bold rounded ${
                  problem.completed
                    ? problem.correct
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {problem.completed
                  ? problem.correct
                    ? "Correct"
                    : "Incorrect"
                  : "Unattempted"}
              </span>
            </div>
            {!isPro && problem.isPro && (
              <Tooltip title="Upgrade to Quantercise Pro to access this question">
                <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg bg-opacity-70">
                  <FaLock className="text-2xl text-white" />
                </div>
              </Tooltip>
            )}
            <button
              className="block w-1/4 px-4 py-2 mx-auto text-xs font-bold text-black transition-all duration-300 bg-green-500 rounded-sm hover:rounded-2xl hover:bg-green-600 hover:text-white hover:w-1/2"
              onClick={() => handleSolveProblem(problem)}
            >
              Solve
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProblemSolution = () => (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-green-400">
            {selectedProblem.title}
          </h2>
          <button
            className="p-2 text-red-400 transition-all duration-200 transform hover:scale-110 hover:text-red-600"
            onClick={() => setSelectedProblem(null)}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-lg">{selectedProblem.description}</p>
          {!solutionVisible && (
            <button
              className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => {
                if (isPro || !selectedProblem.isPro) {
                  setSolutionVisible(true);
                } else {
                  alert("Upgrade to Pro to see the solution.");
                }
              }}
            >
              Show Solution
            </button>
          )}
          {solutionVisible && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-green-400">
                Solution:
              </h3>
              <p className="mt-2 text-lg">{selectedProblem.solution}</p>
            </div>
          )}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400">Hints:</h3>
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
                    className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
                    onClick={showNextHint}
                  >
                    Next Hint
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-red-600 rounded hover:bg-red-700"
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
              className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => {
                if (isPro || !selectedProblem.isPro) {
                  setHintsVisible(true);
                  setCurrentHintIndex(0);
                } else {
                  alert("Upgrade to Pro to see the hints.");
                }
              }}
            >
              Show Hint
            </button>
          )}
        </div>
        <div className="mb-6">
          <p className="text-sm">
            <strong>Attempts:</strong> {selectedProblem.attempts}
          </p>
          <p className="text-sm">
            <strong>Time Spent:</strong> {Math.round(selectedProblem.timeSpent)}{" "}
            seconds
          </p>
        </div>
        <div className="flex justify-between mb-6 space-x-4">
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400">
            Rate Difficulty
          </h3>
          <Rate
            allowHalf
            defaultValue={userRating}
            onChange={(value) => setUserRating(value)}
            style={{ color: "#fadb14" }}
          />
          <button
            className="px-4 py-2 mx-4 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => submitRating(userRating)}
          >
            Submit Rating
          </button>
          <div className={`notification ${ratingSubmitted ? "fade-in" : ""}`}>
            Rating submitted!
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400">
            Leave Feedback
          </h3>
          <Input.TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Enter your feedback"
            className="mt-2"
          />
          <button
            className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-700"
            onClick={submitFeedback}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen p-6 mt-16 text-gray-300 bg-gray-900">
      <div className="fixed inset-0 top-0 w-screen h-screen bg-black opacity-50"></div>
      <AnimatedGrid /> {/* Add the AnimatedGrid component here */}
      <div className="relative z-10 max-w-screen-lg mx-auto">
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
