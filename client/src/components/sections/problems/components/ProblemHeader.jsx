import React from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import ProblemTimer from "./ProblemTimer";

const ProblemHeader = ({
  selectedProblem,
  isTimerStarted,
  handleTimeout,
  feedbackCategory,
}) => {
  return (
    <motion.div
      className="flex flex-col justify-between items-center xl:flex-row"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2 items-center mb-4 xl:items-start xl:mb-0">
        <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          {selectedProblem.title}
        </h1>
        <p className="text-sm tracking-widest text-gray-400">
          {selectedProblem.category}
        </p>
        {/* Tags and Difficulty */}
        <div className="flex flex-wrap gap-2 mt-1">
          <span
            className={`flex items-center tracking-tighter font-black gap-2 px-3 py-1 text-black text-sm rounded-md ${
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
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="flex justify-center items-center px-2 py-1 text-xs tracking-wide text-white whitespace-nowrap bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md xl:px-3 xl:py-1.5"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
      <ProblemTimer
        difficulty={selectedProblem.difficulty}
        onTimeout={handleTimeout}
        feedbackCategory={feedbackCategory?.heading}
        isStarted={isTimerStarted}
      />
    </motion.div>
  );
};

export default ProblemHeader;
