import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
  FaListAlt,
  FaLock,
} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { Switch, Input, Tooltip, Select } from "antd";
import AuthContext from "../../contexts/authContext";
import AnimatedGrid2 from "../landing/AnimatedGrid2";
import CodeEditor from "./CodeEditor";
import "../../index.css";

// Define your domain
// const YOUR_DOMAIN = process.env.YOUR_DOMAIN;
const YOUR_DOMAIN = "http://localhost:4242";

const { Option } = Select;

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

const PracticeProblems = React.memo(() => {
  const { currentUser, isPro } = useContext(AuthContext);
  const [mongoId, setMongoId] = useState(null);
  const [problems, setProblems] = useState([]);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [toggleState, setToggleState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("Any Difficulty");
  const [selectedLayout, setSelectedLayout] = useState("Layout");

  const containerRef = useRef(null);

  // Fetch the MongoDB ID based on Firebase UID or Google ID
  useEffect(() => {
    const fetchMongoId = async () => {
      console.log("Fetching MongoDB ID for user:", currentUser.uid);
      console.log("Current user:", currentUser);
      try {
        const response = await fetch(
          `http://localhost:4242/api/user/mongoId/${currentUser.uid}`
        );

        // Check if the response is OK and is JSON
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Try parsing the response as JSON
        const data = await response.json();
        setMongoId(data.mongoId);
      } catch (error) {
        console.error("Failed to fetch MongoDB ID:", error);
      }
    };

    if (currentUser) fetchMongoId();
  }, [currentUser]);

  // Fetch problems and user progress from backend
  useEffect(() => {
    const fetchProblemsAndProgress = async () => {
      if (!mongoId) return;
      try {
        const [problemsResponse, progressResponse] = await Promise.all([
          fetch(`${YOUR_DOMAIN}/api/questions`),
          fetch(`${YOUR_DOMAIN}/api/user/progress/${mongoId}`),
        ]);

        console.log("Fetching problems and progress for user:", mongoId);
        console.log("Problems response:", problemsResponse);

        if (!problemsResponse.ok || !progressResponse.ok)
          throw new Error("Error fetching data");

        const problemsData = await problemsResponse.json();
        const progressData = await progressResponse.json();

        const problemsWithProgress = problemsData.map((problem) => {
          const progress = progressData.progress.find(
            (p) => p.questionId === problem._id
          );
          return progress ? { ...problem, ...progress } : problem;
        });

        setProblems(problemsWithProgress);
      } catch (error) {
        console.error("Failed to fetch problems or progress:", error);
      }
    };

    if (mongoId) fetchProblemsAndProgress();
  }, [mongoId]);

  // Update problem progress in the backend
  const updateProblemProgress = async ({ userId, questionId, progress }) => {
    try {
      await fetch("/api/user/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId, progress }),
      });
    } catch (error) {
      console.error("Failed to update problem progress:", error);
    }
  };

  // Handlers
  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedTag("All Tags");
    setSelectedProblem(null);
  }, []);

  const handleReviewAllClick = useCallback(() => {
    setSelectedCategory("All Topics");
    setSelectedTag("All Tags");
    setSelectedProblem(null);
  }, []);

  const handleBookmarkClick = useCallback(() => {
    setSelectedCategory("Bookmarks");
    setSelectedTag("All Tags");
    setSelectedProblem(null);
  }, []);

  const handleRefreshAllClick = useCallback(() => {
    const refreshedProblems = problems.map((problem) => ({
      ...problem,
      visited: false,
      completed: false,
      correct: null,
    }));
    setProblems(refreshedProblems);
  }, [problems]);

  const handleSolveProblem = useCallback(
    (problem) => {
      if (!isPro && problem.isPro) return; // Prevent access to Pro questions for free users
      setSelectedProblem(problem);
      setCurrentHintIndex(0);
      setHintsVisible(false);
      setSolutionVisible(false);
      setStartTime(Date.now());

      if (!problem.visited) {
        updateProblemProgress({
          userId: mongoId,
          questionId: problem._id,
          progress: { visited: true },
        });
      }
    },
    [isPro, mongoId]
  );

  const handleCloseModal = useCallback(() => {
    if (!selectedProblem || !mongoId) return;

    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000; // Calculate time spent in seconds

    const updatedProblems = problems.map((problem) =>
      problem.id === selectedProblem.id
        ? {
            ...problem,
            attempts: (problem.attempts || 0) + 1,
            timeSpent: (problem.timeSpent || 0) + timeSpent,
            visited: true,
          }
        : problem
    );

    setProblems(updatedProblems);
    setSelectedProblem(null);
    setStartTime(null);

    updateProblemProgress({
      userId: mongoId,
      questionId: selectedProblem._id,
      progress: {
        attempts: (selectedProblem.attempts || 0) + 1,
        timeSpent: (selectedProblem.timeSpent || 0) + timeSpent,
        visited: true,
      },
    });
  }, [selectedProblem, startTime, problems, mongoId]);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedProblem(null);
    setSelectedTag("All Tags");
  }, []);

  const toggleProblemCompletion = useCallback(
    (problemId, isCorrect) => {
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

      updateProblemProgress({
        userId: mongoId,
        questionId: problemId,
        progress: { completed: true, correct: isCorrect },
      });
    },
    [problems, mongoId]
  );

  const toggleBookmarkProblem = useCallback(
    (problemId) => {
      const isBookmarked = bookmarkedProblems.includes(problemId);
      const updatedBookmarks = isBookmarked
        ? bookmarkedProblems.filter((id) => id !== problemId)
        : [...bookmarkedProblems, problemId];

      setBookmarkedProblems(updatedBookmarks);
    },
    [bookmarkedProblems]
  );

  const showNextHint = useCallback(() => {
    setCurrentHintIndex((prevIndex) => prevIndex + 1);
    setHintsVisible(true);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }, []);

  const handleTagChange = useCallback((value) => {
    setSelectedTag(value);
  }, []);

  const handleDifficultyChange = useCallback((value) => {
    setSelectedDifficulty(value);
  }, []);

  const handleLayoutChange = useCallback((value) => {
    setSelectedLayout(value);
  }, []);

  // Memoized filtered problems
  const filteredProblems = useMemo(
    () =>
      problems.filter(
        (problem) =>
          (selectedTag === "All Tags" || problem.tags?.includes(selectedTag)) &&
          (selectedDifficulty === "Any Difficulty" ||
            problem.difficulty === selectedDifficulty) &&
          (problem.title.toLowerCase().includes(searchTerm) ||
            (problem.tags &&
              problem.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm)
              )))
      ),
    [problems, searchTerm, selectedTag, selectedDifficulty]
  );

  // Memoized problem list based on selected category
  const problemsToShow = useMemo(() => {
    if (selectedCategory === "Bookmarks") {
      return filteredProblems.filter((problem) =>
        bookmarkedProblems.includes(problem.id)
      );
    }
    return filteredProblems.filter(
      (problem) =>
        selectedCategory === "All Topics" ||
        problem.category === selectedCategory
    );
  }, [filteredProblems, selectedCategory, bookmarkedProblems]);

  const renderCategories = () => (
    <div ref={containerRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex max-w-screen-lg mx-auto my-4"
      >
        <Link
          to="/home"
          className={`flex items-center px-2 py-1 text-sm font-semibold transition-all duration-150 border-2 rounded-lg group hover:text-black ${
            isPro
              ? "text-blue-400 border-blue-400 hover:bg-blue-400"
              : "text-green-400 border-green-400 hover:bg-green-400"
          }`}
        >
          <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />
          Home
        </Link>
      </motion.div>
      <div className="grid max-w-screen-lg grid-cols-1 gap-6 mx-auto md:grid-cols-2">
        {categories.map((category) => (
          <div className="relative group" key={category.name}>
            <button
              className="relative z-10 w-full p-8 font-bold transition-all duration-200 transform border-2 border-gray-500 rounded-lg shadow-lg sm:p-10 bg-gray-950 hover:border-gray-300 group-hover:shadow-2xl"
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
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col justify-center w-1/2 mx-auto mt-8 space-y-4 text-center md:mx-0 md:w-full md:flex-row md:space-y-0 md:space-x-4">
          <button
            className="h-full px-4 py-2 font-bold text-black transition-all duration-200 bg-green-500 rounded-lg hover:text-gray-300 hover:bg-green-400 hover:scale-105"
            onClick={handleReviewAllClick}
          >
            <FaListAlt className="inline-block mr-2" />
            All Problems
          </button>
          <button
            className="h-full px-4 py-2 font-bold text-black transition-all duration-200 bg-blue-500 rounded-lg hover:text-gray-300 hover:bg-blue-400 hover:scale-105"
            onClick={handleBookmarkClick}
          >
            <FaBookmark className="inline-block mr-2" />
            Bookmarks
          </button>
          <button
            className="h-full px-4 py-2 font-bold text-black transition-all duration-200 bg-purple-500 rounded-lg hover:text-gray-300 hover:bg-purple-400 hover:scale-105"
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
    const allTags = Array.from(
      new Set(problemsToShow.flatMap((problem) => problem.tags || []))
    );

    if (problemsToShow.length === 0) {
      return (
        <div className="grid grid-cols-1 gap-6 pb-12 text-center">
          <div className="flex flex-row w-full max-w-screen-lg mx-auto my-4">
            <button
              className={`flex items-center px-2 py-1 text-sm font-semibold transition-all duration-150 border-2 rounded-lg group hover:text-black ${
                isPro
                  ? "text-blue-400 border-blue-400 hover:bg-blue-400"
                  : "text-green-400 border-green-400 hover:bg-green-400"
              }`}
              onClick={handleBackToCategories}
            >
              <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />{" "}
              Categories
            </button>

            <Input
              className="flex w-full ml-4 h-min"
              placeholder="Search for a problem..."
              variant="outlined"
              allowClear
              enterButton
              onChange={handleSearch}
              style={{
                maxHeight: 32,
                border: "2px solid #4ade80",
              }}
            />

            <Select
              value={selectedTag}
              onChange={handleTagChange}
              className="hidden w-auto ml-4 md:block"
              style={{
                maxWidth: 200,
                border: "2px solid #4ade80",
                borderRadius: "0.5rem",
                fontSize: "24px",
              }}
            >
              <Option value="All Tags">All Tags</Option>
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>

            <Select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="hidden w-auto ml-4 lg:block"
              style={{
                maxWidth: 200,
                border: "2px solid #4ade80",
                borderRadius: "0.5rem",
                fontSize: "24px",
              }}
            >
              <Option value="Any Difficulty">Any Difficulty</Option>
              <Option value="Easy">Easy</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Hard">Hard</Option>
            </Select>

            <div className="hidden xl:block">
              <Select
                value={selectedLayout}
                onChange={handleLayoutChange}
                className="w-full ml-4 "
                style={{
                  maxWidth: 200,
                  border: "2px solid #4ade80",
                  borderRadius: "0.5rem",
                  fontSize: "24px",
                }}
              >
                <Option value="Layout">Choose Layout</Option>
                <Option value="1 Column">1 Column</Option>
                <Option value="2 Columns">2 Columns</Option>
                <Option value="3 Columns">3 Columns</Option>
              </Select>
            </div>
          </div>
          <p className="py-12 text-lg font-semibold text-gray-300">
            No problems found.
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

    const gridColumns =
      selectedLayout === "1 Column"
        ? "grid-cols-1"
        : selectedLayout === "2 Columns" || selectedLayout === "Layout"
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

    return (
      <div ref={containerRef}>
        <div className="flex flex-row max-w-screen-lg mx-auto my-4">
          <button
            className={`flex items-center px-2 py-1 text-sm font-semibold transition-all duration-150 border-2 rounded-lg group hover:text-black ${
              isPro
                ? "text-blue-400 border-blue-400 hover:bg-blue-400"
                : "text-green-400 border-green-400 hover:bg-green-400"
            }`}
            onClick={handleBackToCategories}
          >
            <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />{" "}
            Categories
          </button>
          <Input
            className="flex ml-4 h-min"
            placeholder="Search for a problem..."
            variant="outlined"
            allowClear
            enterButton
            onChange={handleSearch}
            style={{
              maxHeight: 32,
              border: "2px solid #4ade80",
            }}
          />

          <Select
            value={selectedTag}
            onChange={handleTagChange}
            className="hidden w-auto ml-4 md:block"
            style={{
              maxWidth: 200,
              border: "2px solid #4ade80",
              borderRadius: "0.5rem",
              fontSize: "24px",
            }}
          >
            <Option value="All Tags">All Tags</Option>
            {allTags.map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="hidden w-auto ml-4 lg:block"
            style={{
              maxWidth: 200,
              border: "2px solid #4ade80",
              borderRadius: "0.5rem",
              fontSize: "24px",
            }}
          >
            <Option value="Any Difficulty">Any Difficulty</Option>
            <Option value="Easy">Easy</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Hard">Hard</Option>
          </Select>

          <div className="hidden xl:block">
            <Select
              value={selectedLayout}
              onChange={handleLayoutChange}
              className="w-auto ml-4"
              style={{
                maxWidth: 400,
                border: "2px solid #4ade80",
                borderRadius: "0.5rem",
                fontSize: "24px",
              }}
            >
              <Option value="Layout">Choose Layout</Option>
              <Option value="1 Column">1 Column</Option>
              <Option value="2 Columns">2 Columns</Option>
              <Option value="3 Columns">3 Columns</Option>
            </Select>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`grid ${gridColumns} gap-6 pb-12 mx-auto`}
        >
          {sortedProblems.map((problem) => (
            <div
              key={problem.id}
              className={`relative group p-4 ${
                !problem.visited && !problem.completed
                  ? "border border-green-400"
                  : "border border-gray-700"
              } shadow-lg rounded-lg bg-gray-900 ${
                !isPro && problem.isPro ? "relative opacity-100" : ""
              } hover:translate-x-1 hover:-translate-y-1 transition-transform duration-300 ${
                !isPro && problem.isPro ? "cursor-not-allowed" : ""
              }`}
              onClick={() => handleSolveProblem(problem)}
            >
              {!isPro && problem.isPro && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
                  <FaLock className="text-4xl text-white" />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs text-black font-bold rounded ${
                      problem.difficulty === "Easy"
                        ? "bg-green-500"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {problem.difficulty.toUpperCase()}
                  </span>
                  {problem.tags?.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {problem.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-bold text-black bg-gray-500 rounded-full whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 2 && (
                        <Tooltip
                          className="transition duration-300 hover:bg-gray-700 hover:cursor-default"
                          title={problem.tags.slice(2).join(", ")}
                        >
                          <span className="px-2 py-1 text-xs font-bold text-black bg-gray-500 rounded-full whitespace-nowrap">
                            +{problem.tags.length - 2} more
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>
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
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-green-400 truncate text-md">
                  {problem.title}
                </h2>
                <button
                  className={`px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    problem.completed
                      ? "bg-green-400 text-black"
                      : "bg-gray-950 text-green-400 border border-green-400 hover:bg-green-400 hover:text-black"
                  } rounded-lg`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSolveProblem(problem);
                  }}
                >
                  {problem.completed ? (
                    <span>
                      Solved <FaCheck className="inline-block" />
                    </span>
                  ) : (
                    <span>Solve</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  const renderProblemSolution = () => {
    const isAlgorithmicCategory =
      selectedCategory === "Programming and Algorithmic Thinking";

    const calculateTimeSpent = () => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000; // Calculate time spent in seconds
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = Math.floor(timeElapsed % 60);
      return `${minutes}m ${seconds}s`;
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 "
      >
        <div className="w-full p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-screen-4xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-700">
            <h2 className="text-3xl font-bold text-green-400">
              {selectedProblem.title}
            </h2>
            <button
              className="p-2 text-gray-400 transition-all duration-200 transform hover:scale-110 hover:text-red-500"
              onClick={handleCloseModal}
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="w-full pb-4">
              <div className="mb-6">
                <p className="text-lg leading-relaxed text-gray-300">
                  {selectedProblem.description}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-green-400">Hints:</h3>
                {hintsVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 mt-4 bg-gray-800 rounded-lg shadow-inner"
                  >
                    {selectedProblem.hints
                      .slice(0, currentHintIndex + 1)
                      .map((hint, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <FaLightbulb className="mr-2 text-yellow-500" />
                          <p className="text-gray-300">{hint}</p>
                        </div>
                      ))}
                    <div className="relative mt-6">
                      <div className="flex h-2 overflow-hidden text-xs bg-gray-700 rounded">
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
                          className="px-4 py-2 mt-4 font-bold text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                          onClick={showNextHint}
                        >
                          Next Hint
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 mt-4 font-bold text-white transition-colors duration-300 bg-red-600 rounded-lg shadow-md hover:bg-red-700"
                          onClick={() => setHintsVisible(false)}
                        >
                          Close Hints
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
                {!hintsVisible && (
                  <button
                    className="px-4 py-2 mt-4 font-bold text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
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
              <div className="flex items-center justify-between mb-6 space-x-4">
                <div className="flex items-center space-x-4">
                  <label className="font-bold text-gray-400 text-md">
                    Mark Correct
                  </label>
                  <Switch
                    checked={toggleState[selectedProblem.id] === "correct"}
                    onChange={() => {
                      setToggleState((prev) => ({
                        ...prev,
                        [selectedProblem.id]:
                          prev[selectedProblem.id] === "correct"
                            ? null
                            : "correct",
                      }));
                      toggleProblemCompletion(selectedProblem.id, true);
                    }}
                    checkedChildren={
                      <FaCheck className="mt-1 mr-1 text-white" />
                    }
                    className={`${
                      toggleState[selectedProblem.id] === "correct"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="font-bold text-gray-400 text-md">
                    Mark Incorrect
                  </label>
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
                    checkedChildren={
                      <FaTimes className="mt-1 mr-1 text-white" />
                    }
                    className={`${
                      toggleState[selectedProblem.id] === "incorrect"
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      <strong>Current Time Spent on Problem:</strong>{" "}
                      {calculateTimeSpent()}
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Total Time on Problem:</strong>{" "}
                      {Math.floor(selectedProblem.timeSpent / 60)}m{" "}
                      {Math.floor(selectedProblem.timeSpent % 60)}s
                    </p>
                  </div>
                  <div>
                    <button
                      className="px-4 py-2 font-bold text-gray-900 transition-colors duration-300 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500"
                      onClick={() => toggleBookmarkProblem(selectedProblem.id)}
                    >
                      {bookmarkedProblems.includes(selectedProblem.id)
                        ? "Remove Bookmark"
                        : "Bookmark"}
                    </button>
                  </div>
                </div>
              </div>

              {!solutionVisible && (
                <button
                  className="px-4 py-2 mt-6 font-bold text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 mt-6 bg-gray-800 rounded-lg shadow-inner"
                >
                  <h3 className="text-xl font-semibold text-green-400">
                    Solution:
                  </h3>
                  <p className="mt-4 text-lg text-gray-200">
                    {selectedProblem.solution}
                  </p>
                </motion.div>
              )}
            </div>

            {isAlgorithmicCategory && (
              <div className="pt-8 mx-auto border-t border-gray-700">
                <div>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CodeEditor />
                  </React.Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative py-16 text-gray-300">
      <React.Suspense fallback={<div>Loading Grid...</div>}>
        <AnimatedGrid2 />
      </React.Suspense>
      <div className="relative z-10 w-full max-w-screen-xl p-8 mx-auto">
        {!selectedProblem && (
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`text-4xl max-w-screen-lg mx-auto font-bold ${
              isPro ? "text-blue-400" : "text-green-400"
            }`}
          >
            Practice Problems
            <ReactTyped
              strings={[selectedCategory || ""]}
              typeSpeed={80}
              backSpeed={60}
              startDelay={500}
              showCursor={false}
              className="mb-2 ml-8 text-2xl font-light text-gray-300"
            />
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
});

export default PracticeProblems;
