import { useState, useCallback, useEffect } from "react";

export const useProblemState = (isPro) => {
  // Timer state
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 30); // 30 minutes default

  // Problem state
  const [showSolution, setShowSolution] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [attemptCount, setAttemptCount] = useState(1);
  const [inputType, setInputType] = useState("answer");
  const [problem, setProblem] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  // Determine user plan type
  const isProSharpe = isPro === null; // Sharpe plan
  const userPlan = isProSharpe ? "sharpe" : isPro ? "pro" : "free";

  // Get time limit based on difficulty
  const getTimeLimit = useCallback((difficulty) => {
    const timeLimits = {
      Easy: 20, // 20 minutes
      Medium: 30, // 30 minutes
      Hard: 45, // 45 minutes
      Expert: 60, // 60 minutes
    };
    return (timeLimits[difficulty] || 30) * 60; // Convert to seconds, default to 30 minutes
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Timer-related functions
  const toggleTimer = useCallback(() => {
    setIsTimerEnabled((prev) => !prev);
    if (!isTimerEnabled) {
      setIsTimerStarted(true);
    }
  }, [isTimerEnabled]);

  const handleTimeout = useCallback(() => {
    setTimeoutOccurred(true);
    setShowSolution(true);
  }, []);

  // State management for problem interaction
  const startProblem = useCallback(
    (difficulty) => {
      setIsWorking(true);
      setIsCompleted(false);
      setTimeTaken(0);
      if (isTimerEnabled) {
        setTimeRemaining(getTimeLimit(difficulty));
        setIsTimerStarted(true);
      }
      setIsOverlayVisible(false);
    },
    [isTimerEnabled, getTimeLimit]
  );

  const completeProblem = useCallback((time) => {
    setIsWorking(false);
    setIsCompleted(true);
    setTimeTaken(time);
    setIsTimerStarted(false);
  }, []);

  const tryAgain = useCallback(
    (setUserAnswer, resetExplanation) => {
      setShowSolution(false);
      setTimeoutOccurred(false);
      setAttemptCount((prev) => prev + 1);
      setInputType("answer");
      if (setUserAnswer) setUserAnswer("");
      if (resetExplanation) resetExplanation();
      if (isTimerEnabled) {
        setTimeRemaining(getTimeLimit(problem?.difficulty));
        setIsTimerStarted(true);
      }
    },
    [isTimerEnabled, getTimeLimit, problem]
  );

  const resetProblem = useCallback(() => {
    setIsWorking(false);
    setIsCompleted(false);
    setTimeTaken(0);
    setShowSolution(false);
    setTimeoutOccurred(false);
    setIsTimerStarted(false);
    setAttemptCount(1);
    setInputType("answer");
    setTimeRemaining(getTimeLimit(problem?.difficulty));
    setIsOverlayVisible(true);
  }, [getTimeLimit, problem]);

  const updateProblem = useCallback(
    (newProblem) => {
      setProblem(newProblem);
      resetProblem();
    },
    [resetProblem]
  );

  return {
    // State
    problem,
    isWorking,
    isCompleted,
    timeTaken,
    showSolution,
    setShowSolution,
    timeoutOccurred,
    isTimerEnabled,
    isTimerStarted,
    timeRemaining,
    setTimeRemaining,
    isOverlayVisible,
    setIsOverlayVisible,
    attemptCount,
    inputType,
    setInputType,
    userPlan,
    isProSharpe,

    // Functions
    toggleTimer,
    startProblem,
    completeProblem,
    handleTimeout,
    tryAgain,
    resetProblem,
    updateProblem,
    getTimeLimit,
    formatTime,
  };
};

export default useProblemState;
