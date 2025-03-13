import React from "react";
import { motion } from "framer-motion";
import Filters from "./Filters";
import { MdBookmark, MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { Tooltip } from "antd";
import { FaStar, FaCheck, FaLock, FaArrowRight } from "react-icons/fa";
import {
  TbPencilPlus,
  TbPencilCode,
  TbPencilDollar,
  TbPencilCog,
} from "react-icons/tb";

const RenderProblems = ({
  problemsToShow,
  problemsCompleted,
  selectedTag,
  handleTagChange,
  selectedDifficulty,
  handleDifficultyChange,
  selectedLayout,
  handleLayoutChange,
  handleBackToCategories,
  handleSearch,
  handleSolveProblem,
  toggleBookmarkProblem,
  bookmarkedProblems,
  isPro, // can be null (free), false (Sharpe), or true (Pro)
  containerRef,
}) => {
  // 1) Early return if no problems
  if (problemsToShow.length === 0) {
    return (
      <div>
        <Filters
          problemsToShow={problemsToShow}
          selectedTag={selectedTag}
          handleTagChange={handleTagChange}
          selectedDifficulty={selectedDifficulty}
          handleDifficultyChange={handleDifficultyChange}
          selectedLayout={selectedLayout}
          handleLayoutChange={handleLayoutChange}
          handleBackToCategories={handleBackToCategories}
          handleSearch={handleSearch}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-12 text-lg font-semibold text-center text-gray-300"
        >
          No problems found.
        </motion.p>
      </div>
    );
  }

  /**
   * 2) Filter logic:
   *    - If the user is free (isPro === null), only show problems where problem.isPro === false
   *    - If the user is Sharpe (isPro === false) or Pro (isPro === true), show all problems
   */
  const filteredProblems =
    isPro === null
      ? problemsToShow.filter((p) => p.isPro === false)
      : problemsToShow; // user can see everything if isPro is false or true

  // 3) Optional: sort or further transform the filtered problems
  // For simplicity, we'll skip re-sorting. Just use `filteredProblems` directly.
  const gridColumns =
    selectedLayout === "1 Column"
      ? "grid-cols-1"
      : selectedLayout === "2 Columns" || selectedLayout === "Layout"
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div ref={containerRef}>
      <Filters
        problemsToShow={problemsToShow}
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        selectedDifficulty={selectedDifficulty}
        handleDifficultyChange={handleDifficultyChange}
        selectedLayout={selectedLayout}
        handleLayoutChange={handleLayoutChange}
        handleBackToCategories={handleBackToCategories}
        handleSearch={handleSearch}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`grid gap-4 px-2 pb-12 mx-auto max-w-screen-2xl lg:px-4 ${gridColumns}`}
      >
        {filteredProblems.map((problem) => (
          <motion.div
            key={problem.id}
            variants={itemVariants}
            // Basic styling
            className={`relative p-4 bg-gray-700 rounded-lg border border-gray-600 shadow-lg transition-all duration-300 group hover:border-gray-500`}
            // The entire card is clickable if the user can solve the problem
            onClick={() => {
              // Only allow solving if user isPro (false or true) OR the problem is free (problem.isPro === false)
              if (isPro !== null || !problem.isPro) {
                handleSolveProblem(problem);
              }
            }}
          >
            {/* If user is free and the problem is isPro: true, overlay a lock or overlay */}
            {isPro === null && problem.isPro && (
              <div className="flex absolute inset-0 z-10 flex-col justify-center items-center rounded-lg backdrop-blur-sm bg-gray-900/80">
                <FaLock className="mb-2 text-3xl text-gray-300" />
                <span className="px-4 text-sm text-center text-gray-200">
                  Available for{" "}
                  <span className="font-bold text-green-400">Pro</span> users
                </span>
              </div>
            )}

            {/* Top section: tags, bookmark icon */}
            <div className="flex justify-between items-center">
              {/* Difficulty + some tags */}
              <div className="flex items-center space-x-2">
                <span
                  className={`flex flex-row tracking-tighter px-2 py-1 text-xs lg:text-sm text-black font-black rounded-sm ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  <FaStar className="mr-2 w-4 h-4 text-black" />
                  {problem.difficulty.toUpperCase()}
                </span>

                {/* Show up to 2 tags, with a tooltip for the rest */}
                {problem.tags?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {problem.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs tracking-tighter text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg lg:tracking-wide lg:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 2 && (
                      <Tooltip
                        className="transition duration-300 hover:bg-gray-700 hover:cursor-default"
                        title={problem.tags.slice(2).join(", ")}
                      >
                        <span className="px-2 py-1 text-xs font-bold text-black whitespace-nowrap bg-gray-500 rounded-full">
                          +{problem.tags.length - 2} more
                        </span>
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>

              {/* Bookmark Button */}
              <button
                className={`p-1 rounded-full transition-transform duration-300 ease-in-out ${
                  bookmarkedProblems.includes(problem.id)
                    ? "text-yellow-500"
                    : "text-gray-400 hover:text-yellow-600"
                } hover:scale-105 group hover:bg-gray-600`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  toggleBookmarkProblem(problem.id);
                }}
                aria-label={
                  bookmarkedProblems.includes(problem.id)
                    ? "Remove bookmark"
                    : "Add bookmark"
                }
              >
                {bookmarkedProblems.includes(problem.id) ? (
                  <MdBookmarkAdded size={24} />
                ) : (
                  <>
                    <MdBookmark
                      className="block group-hover:hidden text-24"
                      size={24}
                    />
                    <MdBookmarkAdd
                      className="hidden group-hover:block text-24"
                      size={24}
                    />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 border-t-2 border-gray-500" />

            {/* Bottom section: problem title and Solve/Locked button */}
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-green-400 truncate text-md lg:text-lg">
                {problem.title}
              </h2>
              {problem.isNew && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-black bg-green-400 rounded-sm">
                  NEW
                </span>
              )}

              <button
                className={`px-3 py-1 relative z-10 flex items-center space-x-2 text-sm font-black rounded-md transition-all duration-200 ${
                  // If user is free & problem.isPro => locked
                  isPro === null && problem.isPro
                    ? "bg-black text-gray-400 cursor-not-allowed"
                    : problem.completed
                    ? "bg-black text-green-400"
                    : "bg-green-400 text-black hover:bg-black hover:text-green-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  if (isPro !== null || !problem.isPro) {
                    handleSolveProblem(problem);
                  }
                }}
                aria-label={
                  isPro === null && problem.isPro
                    ? "Locked problem"
                    : problem.completed
                    ? "Solved problem"
                    : "Solve problem"
                }
              >
                {isPro === null && problem.isPro ? (
                  <>
                    <span>LOCKED</span>
                    <FaLock className="inline-block ml-2 w-4 h-4" />
                  </>
                ) : problem.completed ? (
                  <span>
                    SOLVED <FaCheck className="inline-block ml-2 w-4 h-4" />
                  </span>
                ) : (
                  <>
                    <span>SOLVE</span>
                    <span className="ml-2">
                      {problem.category ===
                        "Critical Mathematical Foundations" && (
                        <TbPencilPlus className="inline-block w-4 h-4" />
                      )}
                      {problem.category ===
                        "Programming and Algorithmic Thinking" && (
                        <TbPencilCode className="inline-block w-4 h-4" />
                      )}
                      {problem.category ===
                        "Financial Concepts and Modeling" && (
                        <TbPencilDollar className="inline-block w-4 h-4" />
                      )}
                      {problem.category ===
                        "Brain Teasers and Logical Puzzles" && (
                        <TbPencilCog className="inline-block w-4 h-4" />
                      )}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Optional completion status indicator */}
            {problem.completed && (
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-green-500 border-l-[24px] border-l-transparent" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RenderProblems;
