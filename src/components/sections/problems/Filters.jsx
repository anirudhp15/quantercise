import React from "react";
import { Input } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbColumns1, TbColumns2, TbColumns3 } from "react-icons/tb";

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
    <div className="grid grid-cols-1 gap-6 px-4 text-center">
      <div className="flex flex-row w-full mx-auto mb-4 max-w-screen-2xl">
        {/* Back to Categories Button */}
        <button
          className={`flex w-min items-center hover:cursor-pointer px-2 py-1 text-sm text-black border-gray-400 hover:bg-black bg-gray-400 font-semibold border-2 rounded-lg group hover:text-gray-400`}
          onClick={handleBackToCategories}
        >
          <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />
          Categories
        </button>

        {/* Search Bar */}
        <Input
          className="flex w-full ml-4 h-min"
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
          className="hidden w-auto px-2 py-1 ml-4 text-black border-2 border-gray-400 rounded-lg md:block"
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
          className="hidden w-auto px-2 py-1 ml-4 text-black border-2 border-gray-400 rounded-lg lg:block"
        >
          <option value="Any Difficulty">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Layout Tabs */}
        <div className="flex items-center justify-center gap-4 ml-4">
          {/* Tab 1 */}
          <button
            onClick={() => handleLayoutChange("1 Column")}
            className={`flex flex-row items-center justify-center px-2 whitespace-nowrap py-1 border-2 rounded-lg transition-all ${
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
            className={`flex flex-col items-center justify-center px-2 whitespace-nowrap py-1 border-2 rounded-lg transition-all ${
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
            className={`flex flex-col items-center justify-center px-2 whitespace-nowrap py-1 border-2 rounded-lg transition-all ${
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
  );
};

export default Filters;
