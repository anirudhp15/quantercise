import React, { useEffect, useReducer, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaQuestion,
} from "react-icons/fa";

const ProblemTimer = ({ difficulty, onTimeout, feedbackCategory }) => {
  const maxTime =
    difficulty === "Easy" ? 30 : difficulty === "Medium" ? 60 : 120;

  const initialState = {
    timeLeft: maxTime,
    isRunning: true,
  };

  const timerReducer = (state, action) => {
    switch (action.type) {
      case "TICK":
        return {
          ...state,
          timeLeft: Math.max(state.timeLeft - action.delta, 0),
        };
      case "RESET":
        return { timeLeft: maxTime, isRunning: true };
      case "STOP":
        return { ...state, isRunning: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);
  const lastTimestampRef = useRef(null);

  // Initialize/reset timer on difficulty change
  useEffect(() => {
    dispatch({ type: "RESET" });
    lastTimestampRef.current = performance.now(); // Reset timestamp
  }, [difficulty]);

  // Timer countdown logic
  useEffect(() => {
    if (!state.isRunning) return;

    const tick = (timestamp) => {
      if (lastTimestampRef.current !== null) {
        const delta = (timestamp - lastTimestampRef.current) / 1000; // Time in seconds
        if (state.timeLeft > 0) {
          dispatch({ type: "TICK", delta });
        } else {
          dispatch({ type: "STOP" });
          if (onTimeout) onTimeout();
        }
      }
      lastTimestampRef.current = timestamp;
      if (state.timeLeft > 0) requestAnimationFrame(tick);
    };

    const timer = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(timer);
  }, [state.isRunning, state.timeLeft, onTimeout]);

  // Feedback icon logic
  const feedbackIcons = {
    "STRONGLY INCORRECT": <FaTimes className="text-2xl text-red-500" />,
    "SLIGHTLY INCORRECT": (
      <FaExclamationTriangle className="text-2xl text-yellow-500" />
    ),
    "SLIGHTLY CORRECT": <FaQuestion className="text-2xl text-green-300" />,
    "STRONGLY CORRECT": <FaCheckCircle className="text-2xl text-green-500" />,
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      Math.floor(seconds % 60)
    ).padStart(2, "0")}`;

  return (
    <div className="relative w-20 h-20">
      <CircularProgressbar
        role="progressbar"
        aria-valuenow={state.timeLeft}
        aria-valuemin={0}
        aria-valuemax={maxTime}
        value={state.timeLeft}
        maxValue={maxTime}
        text={formatTime(state.timeLeft)}
        styles={buildStyles({
          textColor: feedbackCategory
            ? "#ffffff"
            : state.timeLeft === 0
            ? "#ef4444"
            : "#10b981",
          pathColor: feedbackCategory
            ? "#10b981"
            : state.timeLeft === 0
            ? "#ef4444"
            : "#10b981",
          trailColor: "#374151",
        })}
      />
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
        {feedbackIcons[feedbackCategory] || null}
      </div>
    </div>
  );
};

export default ProblemTimer;
