import React, { useReducer, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock } from "react-icons/fa";

const ProblemTimer = ({
  difficulty,
  onTimeout,
  feedbackCategory,
  isStarted = false,
}) => {
  const maxTime =
    difficulty === "Easy" ? 300 : difficulty === "Medium" ? 600 : 900;

  const initialState = {
    timeLeft: maxTime,
    isRunning: false,
    progress: 1, // 1 = full, 0 = empty
    isComplete: false,
  };

  const timerReducer = (state, action) => {
    switch (action.type) {
      case "TICK":
        // Calculate new time and progress
        const newTimeLeft = Math.max(state.timeLeft - action.delta, 0);
        const newProgress = newTimeLeft / maxTime;

        // Check if timer just reached 0
        if (newTimeLeft === 0 && state.timeLeft > 0) {
          onTimeout();
          return {
            timeLeft: 0,
            isRunning: false,
            progress: 0,
            isComplete: true,
          };
        }

        return {
          ...state,
          timeLeft: newTimeLeft,
          progress: newProgress,
        };
      case "RESET":
        return {
          timeLeft: maxTime,
          isRunning: false,
          progress: 1,
          isComplete: false,
        };
      case "START":
        return { ...state, isRunning: true };
      case "STOP":
        return { ...state, isRunning: false };
      case "COMPLETE":
        return { ...state, isRunning: false, isComplete: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);
  const lastTimestampRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize/reset timer on difficulty change
  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [difficulty]);

  // Start/stop timer based on isStarted prop
  useEffect(() => {
    if (isStarted && !state.isComplete) {
      dispatch({ type: "START" });
    } else {
      dispatch({ type: "STOP" });
    }
  }, [isStarted, state.isComplete]);

  // Stop timer when feedback is received
  useEffect(() => {
    if (feedbackCategory) {
      dispatch({ type: "STOP" });
    }
  }, [feedbackCategory]);

  // RAF timer loop
  useEffect(() => {
    if (!state.isRunning) {
      lastTimestampRef.current = null;
      return;
    }

    const tick = (timestamp) => {
      if (!state.isRunning) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      dispatch({ type: "TICK", delta });

      if (state.timeLeft <= 0) {
        onTimeout();
        return;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isRunning, state.timeLeft, onTimeout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getColor = () => {
    const percentage = state.progress * 100;
    if (percentage > 50) return "#10b981"; // Green for > 50%
    if (percentage > 20) return "#f59e0b"; // Yellow for 20-50%
    return "#ef4444"; // Red for < 20%
  };

  // Calculate stroke dash values for SVG circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - state.progress);

  return (
    <motion.div
      className="flex relative z-50 flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Center display */}
        <div className="flex absolute inset-0 justify-center items-center">
          <AnimatePresence mode="wait">
            {state.isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-red-500"
              >
                <FaClock className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span
                  className={`font-mono text-lg font-bold ${
                    state.progress < 0.2 ? "text-red-500" : "text-gray-200"
                  }`}
                >
                  {formatTime(state.timeLeft)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status text below the timer */}
      <AnimatePresence>
        {state.isRunning && (
          <motion.div
            className="px-3 py-1.5 mt-2 text-xs whitespace-nowrap font-medium text-gray-300 bg-gray-800/80 rounded-lg shadow-md backdrop-blur-sm border border-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {state.timeLeft <= 60 ? "Time's almost up!" : "Time remaining"}
          </motion.div>
        )}
        {state.isComplete && (
          <motion.div
            className="px-3 py-1.5 mt-2 text-xs font-medium text-red-300 bg-gray-800/80 rounded-lg shadow-md backdrop-blur-sm border border-red-900/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Time's up!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProblemTimer;
