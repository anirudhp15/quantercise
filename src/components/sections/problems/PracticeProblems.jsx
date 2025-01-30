import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaLightbulb, FaTimes } from "react-icons/fa";
import { ImSigma } from "react-icons/im";
import { BsBank } from "react-icons/bs";
import { LuBrainCircuit } from "react-icons/lu";
import { SiLeetcode } from "react-icons/si";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { Switch, Input, Tooltip, Select } from "antd";
import AuthContext from "../../../contexts/authContext";
import { useFetchMongoId } from "../../../hooks/useFetch/useFetchMongoId";
import { useFetchProgress } from "../../../hooks/useFetch/useFetchProgress";
import { useBookmarkManagement } from "../../../hooks/useBookmarks/useBookmarkManagement";
import { useProblemHandlers } from "../../../hooks/useProblems/useProblemHandlers";
import { useProblemFilters } from "../../../hooks/useProblems/useProblemFilters";
import { useRenderCategories } from "../../../hooks/useRender/useRenderCategories";
import { useUpdateProblemProgress } from "../../../hooks/useFetch/useUpdateProgress";
import { useRenderProblems } from "../../../hooks/useRender/useRenderProblems";
import { useHints } from "../../../hooks/useUI/useHints";
import { useSolution } from "../../../hooks/useUI/useSolution";
import CodeEditor from "./CodeEditor";
import ProblemCard from "./ProblemCard";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import RenderProblems from "./RenderProblems";
import ProblemSolution from "./ProblemSolution";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";

const PracticeProblems = React.memo(() => {
  const { currentUser } = useContext(AuthContext);
  const { isPro } = useUser();
  const [mongoId, setMongoId] = useState(null);
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
  const { isLowDetail } = useLowDetail();
  const [userAnswer, setUserAnswer] = useState("");
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const containerRef = useRef(null);

  useFetchMongoId(currentUser, setMongoId);
  const { problems, loading, error } = useFetchProgress(mongoId);
  const updateProblemProgress = useUpdateProblemProgress();

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
    // setProblems(refreshedProblems);
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

    // setProblems(updatedProblems);
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

      // setProblems(updatedProblems);
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

  const handleSaveNotes = useCallback(() => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  }, []);

  const toggleNotes = useCallback(() => {
    setShowNotes((prev) => !prev);
  }, []);

  const problemsToShow = useRenderProblems({
    problems,
    filters: {
      searchTerm,
      selectedTag,
      selectedDifficulty,
      selectedCategory,
    },
    bookmarkedProblems,
    isPro,
  });

  // Render categories and problems
  const renderCategories = useRenderCategories(
    problems,
    handleCategoryClick,
    handleReviewAllClick,
    handleBookmarkClick,
    handleRefreshAllClick,
    containerRef
  );

  return (
    <div className="relative w-full text-gray-300 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative z-10 flex flex-col justify-start min-h-screen py-24 mx-auto max-w-screen-2xl lg:py-32">
        <div className="w-full px-4 mx-auto max-w-screen-2xl ">
          <Link
            to="/home"
            className={`flex w-min hover:cursor-pointer items-center px-2 py-1 text-sm font-semibold border-2 rounded-lg group text-black hover:text-green-400 border-green-400 hover:bg-black bg-green-400`}
          >
            <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />
            Home
          </Link>
        </div>

        {!selectedProblem && (
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex flex-col tracking-tighter items-center py-2 px-4 lg:flex-row text-4xl max-w-screen-2xl mx-auto w-full text-center lg:justify-between font-black text-green-400`}
          >
            Practice Problems
            <ReactTyped
              strings={[selectedCategory || " "]}
              typeSpeed={80}
              backSpeed={60}
              startDelay={500}
              showCursor={false}
              className="h-8 text-2xl font-bold tracking-wide text-gray-400 lg:ml-8"
            />
          </motion.h1>
        )}
        {selectedProblem ? (
          <ProblemSolution
            currentUser={currentUser}
            selectedProblem={selectedProblem}
            hintsVisible={hintsVisible}
            currentHintIndex={currentHintIndex}
            showNextHint={() => setCurrentHintIndex((prev) => prev + 1)}
            setHintsVisible={setHintsVisible}
            setCurrentHintIndex={setCurrentHintIndex}
            setSolutionVisible={setSolutionVisible}
            solutionVisible={solutionVisible}
            handleCloseModal={handleCloseModal}
            toggleProblemCompletion={() => {}}
            toggleState={{}}
            isPro={isPro}
            startTime={startTime}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            notes={notes}
            setNotes={setNotes}
            handleSaveNotes={handleSaveNotes}
            savedMessage={savedMessage}
            showNotes={showNotes}
            toggleNotes={toggleNotes}
          />
        ) : selectedCategory ? (
          <RenderProblems
            problemsToShow={problemsToShow}
            selectedTag={selectedTag}
            handleTagChange={handleTagChange}
            selectedDifficulty={selectedDifficulty}
            handleDifficultyChange={handleDifficultyChange}
            selectedLayout={selectedLayout}
            handleLayoutChange={handleLayoutChange}
            handleBackToCategories={handleBackToCategories}
            handleSearch={handleSearch}
            handleSolveProblem={handleSolveProblem}
            toggleBookmarkProblem={toggleBookmarkProblem}
            bookmarkedProblems={bookmarkedProblems}
            isPro={isPro}
            containerRef={containerRef}
          />
        ) : (
          renderCategories
        )}
      </div>
    </div>
  );
});

export default PracticeProblems;
