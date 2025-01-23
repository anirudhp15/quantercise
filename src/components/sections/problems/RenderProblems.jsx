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
  isPro,
  containerRef,
}) => {
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
        {sortedProblems.map((problem) => (
          <div
            key={problem.id}
            className={`relative z-9 group p-4 shadow-lg rounded-lg bg-gray-700 ${
              !isPro && problem.isPro ? "opacity-100" : ""
            } ${!isPro && problem.isPro ? "cursor-not-allowed" : ""}`}
            onClick={() => handleSolveProblem(problem)}
          >
            {!isPro && problem.isPro && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg pointer-events-none"></div>
            )}
            <div className="flex items-center justify-between">
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
              <button
                className={`p-1 rounded-full transition-transform duration-300 ease-in-out ${
                  bookmarkedProblems.includes(problem.id)
                    ? "text-yellow-500"
                    : "text-gray-400 hover:text-yellow-600"
                } hover:scale-105 group hover:bg-gray-600`}
                onClick={(e) => {
                  e.stopPropagation();
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
            <div className="my-4 border-t-2 border-gray-500"></div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-green-400 truncate text-md lg:text-lg">
                {problem.title}
              </h2>
              <button
                className={`px-3 relative z-10 py-1 flex items-center space-x-2 text-sm font-black ${
                  !isPro && problem.isPro
                    ? "bg-black text-gray-400 cursor-not-allowed"
                    : problem.completed
                    ? "bg-black text-green-400"
                    : "bg-green-400 text-black hover:bg-black hover:text-green-400"
                } rounded-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPro || !problem.isPro) {
                    handleSolveProblem(problem);
                  }
                }}
              >
                {!isPro && problem.isPro ? (
                  <>
                    <span>LOCKED</span>{" "}
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
