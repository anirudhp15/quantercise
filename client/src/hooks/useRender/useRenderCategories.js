import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRightLong, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaSyncAlt } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { ImSigma } from "react-icons/im";
import { BsBank } from "react-icons/bs";
import { LuBrainCircuit } from "react-icons/lu";
import { SiLeetcode } from "react-icons/si";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

export const useRenderCategories = (
  problems,
  handleCategoryClick,
  handleReviewAllClick,
  handleBookmarkClick,
  handleRefreshAllClick,
  containerRef
) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const initialCategories = [
    {
      name: "Mathematical Literacy",
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
        const response = await fetch(`${BACKEND_DOMAIN}/api/questions/tags`);
        const tagsData = await response.json();
        setCategories(
          initialCategories.map((category) => ({
            ...category,
            tags: tagsData[category.category] || [],
          }))
        );
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div ref={containerRef} className="px-2 mx-auto max-w-screen-2xl lg:px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-between items-center pb-2 w-full text-xs lg:pb-4 sm:flex-row"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center mb-2 text-sm lg:mt-1 sm:mb-0"
        >
          <Link to="/dashboard" className="text-gray-400 hover:text-green-400">
            Home
          </Link>
          <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
          <span className="text-green-400">Categories</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex gap-4 text-xs lg:text-sm lg:gap-4"
        >
          <button
            onClick={handleRefreshAllClick}
            className="flex items-center px-4 py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <FaSyncAlt className="mr-2 transition-transform hover:rotate-180" />
            Refresh
          </button>
          <button
            onClick={handleBookmarkClick}
            className="flex items-center px-4 py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <MdBookmark className="mr-2" />
            Bookmarks
          </button>
          <button
            onClick={handleReviewAllClick}
            className="flex items-center px-4 py-2 font-medium text-white whitespace-nowrap bg-green-500 rounded-md shadow-sm transition-all hover:bg-green-600"
          >
            All Problems
            <FaArrowRightLong className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>

      {/* Category Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`relative group 
              ${category.isPro ? "cursor-not-allowed" : ""}`}
          >
            <div className="relative p-6 h-full bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 group-hover:shadow-md lg:p-6">
              <div className="flex justify-between items-center lg:items-start">
                {/* Title */}
                <h2 className="pr-12 text-lg font-semibold text-left text-gray-800 transition-all duration-200 dark:text-gray-100 sm:text-xl lg:text-xl">
                  {category.name}
                </h2>
                {/* Icon */}
                <div className="flex justify-center items-center p-1 text-xl text-green-500 dark:text-green-400 lg:text-2xl">
                  {category.icon}
                </div>
              </div>

              {/* Description */}
              <p className="mt-2 text-sm text-left text-gray-600 dark:text-gray-400 lg:text-base">
                {category.description}
              </p>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

              {/* Tags + Button Container */}
              <div className="flex flex-col justify-between lg:gap-4">
                {/* Practice Button */}
                <button
                  onClick={() =>
                    !category.isPro && handleCategoryClick(category.category)
                  }
                  disabled={category.isPro}
                  className="flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md transition-all hover:bg-green-600 h-min lg:text-base"
                >
                  Practice
                  <FaArrowRightLong className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 my-4 lg:mt-3 lg:mb-0 lg:flex-1">
                  {category.tags?.slice(0, 4).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium text-gray-600 whitespace-nowrap bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 lg:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {category.tags?.length > 5 && (
                    <span className="px-3 py-1 text-xs font-medium text-gray-600 whitespace-nowrap bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 lg:text-sm">
                      + {category.tags.length - 5} more
                    </span>
                  )}
                </div>
                {/* 3 Featured Problems Section */}
                {/* 3 Featured Problems Section */}

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex justify-between items-center w-full text-xl font-bold text-gray-400 focus:outline-none"
                >
                  Featured Problems
                  {isOpen ? (
                    <FaChevronUp className="text-gray-500 hover:text-gray-300" />
                  ) : (
                    <FaChevronDown className="text-gray-500 hover:text-gray-300" />
                  )}
                </button>

                {isOpen && (
                  <div className="space-y-4 transition-all duration-300 ease-in-out">
                    {problems
                      .filter(
                        (problem) => problem.category === category.category
                      )
                      .slice(0, 3)
                      .map((problem, index) => (
                        <div
                          key={index}
                          className="relative px-2 pt-2 pb-6 bg-gray-700 rounded-lg border border-gray-600 shadow-md transition duration-300 cursor-pointer group hover:border-green-400"
                        >
                          {/* Difficulty and Tags */}
                          <div className="flex justify-between items-center mb-2">
                            <span
                              className={`flex items-center px-2 py-0.5 text-xs font-semibold rounded-sm uppercase ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-500 text-black"
                                  : problem.difficulty === "Medium"
                                  ? "bg-yellow-500 text-black"
                                  : "bg-red-500 text-black"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                            <div className="flex gap-2 items-center">
                              {problem.tags.slice(0, 1).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-0.5 text-xs text-white whitespace-nowrap rounded-full bg-blue-500/70"
                                >
                                  {tag}
                                </span>
                              ))}
                              {problem.tags.length > 1 && (
                                <span className="px-2 py-0.5 text-xs text-gray-300 bg-gray-600 rounded-full">
                                  +{problem.tags.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-lg font-semibold text-green-300 truncate">
                            {problem.title}
                          </h4>

                          {/* Description Preview (2 lines) */}
                          <kbd className="mt-1 text-sm text-gray-300 line-clamp-2">
                            {problem.description}
                          </kbd>

                          {/* Hover action indicator */}
                          <div className="flex absolute right-0 bottom-0 justify-center items-center w-8 h-8 opacity-0 transition duration-300 group-hover:opacity-100">
                            <FaArrowRightLong className="text-green-400" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Pro Overlay */}
              {category.isPro && (
                <div className="flex absolute inset-0 flex-col justify-center items-center rounded-lg backdrop-blur-xs bg-gray-900/70">
                  <SlLock className="mb-2 text-3xl text-gray-300" />
                  <span className="px-4 text-sm text-center text-gray-200 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    Coming soon for{" "}
                    <span className="font-bold text-green-400">Pro</span> users
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
