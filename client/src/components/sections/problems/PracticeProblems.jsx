import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";

import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import AuthContext from "../../../contexts/authContext";
import { useFetchProgress } from "../../../hooks/useFetch/useFetchProgress";
import { useUserProgress } from "../../../hooks/useProblems/useUserProgress";
import { useRenderCategories } from "../../../hooks/useRender/useRenderCategories";
import { useRenderProblems } from "../../../hooks/useRender/useRenderProblems";
import useFetchUserData from "../../../hooks/useFetch/useFetchUserData";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import RenderProblems from "./components/RenderProblems";
import ProblemSolution from "./ProblemSolution";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";

const PracticeProblems = React.memo(() => {
  const { currentUser } = useContext(AuthContext);
  const { isPro, mongoId } = useUser();
  const { problemsCompleted } = useFetchUserData(currentUser);
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

  const { problems } = useFetchProgress(mongoId);
  const { startQuestion, submitAttempt, updateProgress } =
    useUserProgress(mongoId);

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

      if (mongoId) {
        startQuestion(problem._id, {
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
        });
      }
    },
    [isPro, mongoId, startQuestion]
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

    submitAttempt(selectedProblem._id, {
      timeSpent,
      language: "text",
      correct: false,
      feedbackCategory: { heading: "INCOMPLETE", color: "text-gray-500" },
    });
  }, [selectedProblem, startTime, problems, mongoId, submitAttempt]);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedProblem(null);
    setSelectedTag("All Tags");
  }, []);

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

      // Replace updateProblemProgress with updateProgress
      updateProgress(problemId, { completed: true, correct: isCorrect });
    },
    [problems, mongoId, updateProgress]
  );

  return (
    <div className="relative w-full text-gray-300 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="flex relative z-10 flex-col justify-start py-24 mx-auto max-w-screen-2xl min-h-screen lg:py-32">
        {/* <div className="pb-4 mx-auto w-full max-w-screen-2xl">
          <Link
            to="/home"
            className={`flex items-center px-2 py-1 w-min text-sm font-semibold text-black bg-green-400 rounded-lg border-2 border-green-400 hover:cursor-pointer group hover:text-green-400 hover:bg-black`}
          >
            <FaArrowLeftLong className="mr-2 ml-1 transition-all duration-200 group-hover:-translate-x-1" />
            Home
          </Link>
        </div> */}

        {!selectedProblem && (
          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex flex-col items-center px-2 py-2 mx-auto w-full max-w-screen-2xl text-4xl font-bold tracking-tight text-center text-white lg:px-4 lg:flex-row lg:justify-between`}
          >
            Practice Problems
            {renderCategories && !selectedCategory && (
              <ReactTyped
                strings={["Topics of Practice"]}
                typeSpeed={80}
                backSpeed={60}
                startDelay={500}
                showCursor={false}
                className="h-4 text-sm font-semibold tracking-wide text-gray-300 lg:h-8 lg:text-2xl lg:ml-8"
              />
            )}
            {selectedCategory && (
              <ReactTyped
                strings={[selectedCategory || " "]}
                typeSpeed={80}
                backSpeed={60}
                startDelay={500}
                showCursor={false}
                className="h-4 text-sm font-semibold tracking-wide text-gray-300 lg:h-8 lg:text-2xl lg:ml-8"
              />
            )}
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
            problemsCompleted={problemsCompleted}
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
