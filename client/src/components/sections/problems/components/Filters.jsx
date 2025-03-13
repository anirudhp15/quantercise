import React from "react";
import { Input } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbColumns1, TbColumns2, TbColumns3 } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Filters = ({
  problemsToShow,
  selectedTag,
  handleTagChange,
  selectedDifficulty,
  handleDifficultyChange,
  selectedLayout,
  handleLayoutChange,
  handleBackToCategories,
  handleSearch,
}) => {
  const allTags = Array.from(
    new Set(problemsToShow.flatMap((problem) => problem.tags || []))
  );

  return (
    <div className="grid grid-cols-1 gap-6 px-2 text-center lg:px-4">
      <div className="flex flex-col items-center mx-auto mb-2 w-full max-w-screen-2xl text-xs lgmb-4 lg:flex-row">
        {/* Back to Categories Button */}
        <div className="flex items-center mb-4 text-sm lg:mb-0">
          <Link to="/dashboard" className="text-gray-400 hover:text-green-400">
            Home
          </Link>
          <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
          <span
            onClick={handleBackToCategories}
            className="text-gray-400 hover:text-green-400"
          >
            Categories
          </span>
          <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
          <span className="text-green-400 whitespace-nowrap">Problems</span>
        </div>

        <div className="flex flex-row items-center w-full">
          {/* Search Bar */}
          <Input
            className="flex w-full lg:ml-4 h-min"
            placeholder="Search for a problem..."
            variant="outlined"
            allowClear
            enterButton
            onChange={handleSearch}
            style={{
              maxHeight: 40,
              height: 36,
              border: "2px solid #9ca3af",
            }}
          />

          {/* Tags Select */}
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="hidden px-2 py-1 ml-4 w-auto text-black rounded-lg border-2 border-gray-400 md:block"
            style={{
              maxHeight: 40,
              height: 36,
              border: "2px solid #9ca3af",
            }}
          >
            <option value="All Tags">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Difficulty Select */}
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="hidden px-2 py-1 ml-4 w-auto text-black rounded-lg border-2 border-gray-400 md:block"
            style={{
              maxHeight: 40,
              height: 36,
              border: "2px solid #9ca3af",
            }}
          >
            <option value="Any Difficulty">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Layout Tabs */}
          <div className="hidden justify-center items-center ml-4 md:flex">
            {/* Tab 1 */}
            <button
              onClick={() => handleLayoutChange("1 Column")}
              className={`flex flex-row items-center justify-center px-2 whitespace-nowrap py-1 border-2 rounded-l-lg  transition-all ${
                selectedLayout === "1 Column"
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-gray-400 text-gray-500 hover:border-green-400 hover:text-green-400"
              }`}
            >
              <TbColumns1 size={24} />
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => handleLayoutChange("2 Columns")}
              className={`flex flex-col items-center justify-center px-2 whitespace-nowrap py-1 border-2 border-x-0 transition-all ${
                selectedLayout === "2 Columns"
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-gray-400 text-gray-500 hover:border-green-400 hover:text-green-400"
              }`}
            >
              <TbColumns2 size={24} />
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => handleLayoutChange("3 Columns")}
              className={`flex flex-col items-center justify-center px-2 whitespace-nowrap py-1 border-2 rounded-r-lg transition-all ${
                selectedLayout === "3 Columns"
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-gray-400 text-gray-500 hover:border-green-400 hover:text-green-400"
              }`}
            >
              <TbColumns3 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
