import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdBookmark, MdBookmarks } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { ImSigma } from "react-icons/im";
import { BsBank } from "react-icons/bs";
import { LuBrainCircuit } from "react-icons/lu";
import { SiLeetcode } from "react-icons/si";

/**
 * A custom hook to manage and render categories with animations.
 * @param {Array} problemsToShow - The array of problems to display.
 * @param {boolean} isPro - Whether the user is a Pro user.
 * @param {function} handleCategoryClick - Function to handle category selection.
 * @param {function} handleReviewAllClick - Function to show all problems.
 * @param {function} handleBookmarkClick - Function to show bookmarked problems.
 * @param {function} handleRefreshAllClick - Function to refresh problems.
 * @param {object} containerRef - Ref for the category container.
 * @returns {JSX.Element} - Rendered categories and action buttons.
 */
export const useRenderCategories = (
  problems,
  handleCategoryClick,
  handleReviewAllClick,
  handleBookmarkClick,
  handleRefreshAllClick,
  containerRef
) => {
  const [categories, setCategories] = useState([]);

  // Define initial categories without tags
  const initialCategories = [
    {
      name: "Mathematical Skills",
      category: "Critical Mathematical Foundations",
      icon: <ImSigma />,
      description: "Fundamental math concepts for quantitative roles",
      isPro: false,
    },
    {
      name: "Finance Fundamentals",
      category: "Financial Concepts and Modeling",
      icon: <BsBank />,
      description:
        "Financial derivatives, portfolio theory, and valuation models",
      isPro: false,
    },
    {
      name: "Logic and Reasoning",
      category: "Brain Teasers and Logical Puzzles",
      icon: <LuBrainCircuit />,
      description:
        "Puzzles and brain teasers to challenge your logic and intuition",
      isPro: false,
    },
    {
      name: "Programming Questions",
      category: "Programming and Algorithmic Thinking",
      icon: <SiLeetcode />,
      description: "Coding technicals and algorithmic problem solving",
      isPro: true,
    },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "https://quantercise-api.vercel.app/api/questions/tags"
        );
        console.log(response);
        const tagsData = await response.json();

        // Map tags to the corresponding categories
        const updatedCategories = initialCategories.map((category) => ({
          ...category,
          tags: tagsData[category.category] || [], // Attach tags based on category name
        }));

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  return (
    <div ref={containerRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex flex-col items-center justify-between px-8 pb-2 mx-auto max-w-screen-2xl lg:flex-row"
      >
        {/* Left-aligned Topics of Practice */}
        <div className="mb-2 -mt-10 text-xl font-bold text-center lg:mt-0 text-gray-300/75 lg:text-left lg:mb-0">
          Topics of Practice
        </div>

        {/* Right-aligned Buttons */}
        <div className="flex flex-row items-center gap-2 lg:gap-4 ">
          <button
            className="h-full px-2 py-1 mb-1 font-semibold text-black bg-gray-400 border-2 border-gray-400 rounded-md whitespace-nowrap group hover:text-gray-400 hover:bg-black"
            onClick={handleRefreshAllClick}
          >
            <FaSyncAlt className="inline-block mr-2 transition-all duration-300 group-hover:rotate-180" />
            Refresh Problems
          </button>
          <button
            className="h-full px-2 py-1 mb-1 font-semibold text-black bg-yellow-400 border-2 border-yellow-400 rounded-md whitespace-nowrap group hover:text-yellow-400 hover:bg-black"
            onClick={handleBookmarkClick}
          >
            <>
              <MdBookmark
                className="inline-block mr-2 group-hover:hidden"
                size={24}
              />
              <MdBookmarks
                className="hidden mr-2 group-hover:inline-block"
                size={24}
              />
            </>
            Bookmarks
          </button>
          <button
            className="flex items-center px-2 py-1 mb-1 font-semibold text-black bg-green-400 border-2 border-green-400 rounded-md whitespace-nowrap group hover:text-green-400 hover:bg-black"
            onClick={handleReviewAllClick}
          >
            All Problems
            <FaArrowRightLong className="ml-2 mr-1 transition-all duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid w-full grid-cols-1 gap-8 px-4 mx-auto max-w-screen-2xl lg:grid-cols-2 xl:grid-cols-4"
      >
        {categories.map((category, index) => (
          //  display category name

          <motion.div
            key={index} // Ensure unique keys for each category
            variants={itemVariants}
            className={`relative group ${
              category.isPro ? "cursor-not-allowed" : ""
            }`}
          >
            <button
              className="relative z-10 w-full p-8 font-bold transition-all duration-200 transform bg-gray-800 rounded-md shadow-lg min-h-auto group-hover:shadow-2xl"
              onClick={() =>
                category.isPro ? null : handleCategoryClick(category.category)
              }
              disabled={category.isPro}
            >
              <div className={`flex items-center justify-evenly space-x-4`}>
                {/* {category.icon} */}
                <div className="grid grid-cols-2 xl:flex xl:flex-col">
                  <div className="flex flex-col items-center justify-between ">
                    <div className="pb-2 rounded-lg text-7xl w-max h-max">
                      {category.icon}
                    </div>
                    <h2 className="w-56 p-2 text-2xl transition-all duration-200 group-hover/link:text-center">
                      {category.name}
                    </h2>
                    <button
                      onClick={() =>
                        category.isPro
                          ? null
                          : handleCategoryClick(category.category)
                      }
                      disabled={category.isPro}
                      className="flex items-center px-3 py-1 my-2 font-bold text-black bg-green-400 border-2 border-green-400 rounded-md whitespace-nowrap group hover:text-green-400 hover:bg-black"
                    >
                      Practice <FaArrowRightLong className="ml-2" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center space-x-4">
                    {/* <div className="w-full h-full py-2 border-r-4 border-gray-500 lg:border-b-4 lg:border-r-0 opacity-70"></div> */}

                    <p className="mt-2 font-light text-left text-gray-300 xl:text-center text-md">
                      {category.description}
                    </p>

                    <div className="flex flex-row flex-wrap w-full gap-2 mt-4 lg:flex-col">
                      {category.tags &&
                        category.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs font-normal tracking-wide text-white bg-gray-700 rounded-full shadow-lg whitespace-nowrap w-min lg:text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {category.isPro && (
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-100 rounded-md group ">
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md group-hover:bg-opacity-90 opacity-90"></div>
                  <SlLock className="z-10 block text-4xl text-white transition-all duration-100 shadow-xl group-hover:hidden" />
                  <span className="absolute hidden font-semibold text-white transition-all duration-200 text-md group-hover:block">
                    Coming Soon for{" "}
                    <span className="font-black text-blue-400 animate-pulse">
                      Pro
                    </span>{" "}
                    users!
                  </span>
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
