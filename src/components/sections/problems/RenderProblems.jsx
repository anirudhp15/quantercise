import React from "react";
import { motion } from "framer-motion";
import Filters from "./Filters";
import { MdBookmark, MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { Tooltip } from "antd";
import { FaStar, FaCheck, FaLock } from "react-icons/fa";
import {
  TbPencilPlus,
  TbPencilCode,
  TbPencilDollar,
  TbPencilCog,
} from "react-icons/tb";

const RenderProblems = ({
  problemsToShow,
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
        <p className="py-12 text-lg font-semibold text-center text-gray-300">
          No problems found.
        </p>
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
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`grid ${gridColumns} max-w-screen-2xl gap-6 pb-12 px-4 mx-auto`}
      >
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            // Basic styling
            className={`relative group p-4 shadow-lg rounded-lg bg-gray-700`}
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
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg pointer-events-none" />
            )}

            {/* Top section: tags, bookmark icon */}
            <div className="flex items-center justify-between">
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
                  <FaStar className="w-4 h-4 mr-2 text-black" />
                  {problem.difficulty.toUpperCase()}
                </span>

                {/* Show up to 2 tags, with a tooltip for the rest */}
                {problem.tags?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {problem.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs tracking-wide text-white rounded-full shadow-lg lg:text-sm bg-gradient-to-r from-blue-500 to-indigo-500"
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
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-green-400 truncate text-md lg:text-lg">
                {problem.title}
              </h2>
              <button
                className={`px-3 py-1 relative z-10 flex items-center space-x-2 text-sm font-black rounded-md ${
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
              >
                {isPro === null && problem.isPro ? (
                  <>
                    <span>LOCKED</span>
                    <FaLock className="inline-block w-4 h-4" />
                  </>
                ) : problem.completed ? (
                  <span>
                    SOLVED <FaCheck className="inline-block w-4 h-4" />
                  </span>
                ) : (
                  <>
                    <span>SOLVE</span>
                    {problem.category ===
                      "Critical Mathematical Foundations" && (
                      <TbPencilPlus className="inline-block w-4 h-4" />
                    )}
                    {problem.category ===
                      "Programming and Algorithmic Thinking" && (
                      <TbPencilCode className="inline-block w-4 h-4" />
                    )}
                    {problem.category === "Financial Concepts and Modeling" && (
                      <TbPencilDollar className="inline-block w-4 h-4" />
                    )}
                    {problem.category ===
                      "Brain Teasers and Logical Puzzles" && (
                      <TbPencilCog className="inline-block w-4 h-4" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default RenderProblems;
