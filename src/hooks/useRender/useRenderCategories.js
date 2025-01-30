import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import { MdBookmark, MdBookmarks } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { ImSigma } from "react-icons/im";
import { BsBank } from "react-icons/bs";
import { LuBrainCircuit } from "react-icons/lu";
import { SiLeetcode } from "react-icons/si";
import axios from "axios";
import { ReactTyped } from "react-typed";

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
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
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
    <div ref={containerRef} className="px-4 mx-auto max-w-screen-2xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-between w-full pb-4 sm:flex-row"
      >
        <ReactTyped
          strings={["Topics of Practice"]}
          typeSpeed={80}
          backSpeed={60}
          startDelay={100}
          showCursor={false}
          className="mb-4 text-xl font-bold text-center text-gray-400 trackind-wide sm:mb-0 lg:text-left"
        />

        <div className="flex gap-3 text-xs text-black lg:text-sm lg:gap-4">
          <button
            onClick={handleRefreshAllClick}
            className="flex items-center px-4 py-2 font-semibold transition-colors bg-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-300"
          >
            <FaSyncAlt className="mr-2 transition-transform hover:rotate-180" />
            Refresh
          </button>
          <button
            onClick={handleBookmarkClick}
            className="flex items-center px-4 py-2 font-semibold transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-700 hover:text-yellow-300"
          >
            <MdBookmark className="mr-2 group-hover:hidden" />
            <MdBookmarks className="hidden mr-2 group-hover:inline-block" />
            Bookmarks
          </button>
          <button
            onClick={handleReviewAllClick}
            className="flex items-center px-4 py-2 font-semibold transition-colors bg-green-400 rounded-lg whitespace-nowrap hover:bg-green-700 hover:text-green-300"
          >
            All Problems
            <FaArrowRightLong className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* Category Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2 xl:grid-cols-4"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`relative group 
              ${category.isPro ? "cursor-not-allowed" : ""}`}
          >
            <div className="relative h-full p-6 transition-all duration-200 bg-gray-800 rounded-lg shadow-lg group-hover:bg-gray-900 hover:shadow-xl lg:p-8">
              <div className="flex items-center justify-between lg:items-start">
                {/* Title */}
                <h2 className="pr-12 text-xl font-bold text-left text-gray-200 transition-all duration-200 sm:text-2xl group-hover:animate-pulse lg:text-2xl">
                  {category.name}
                </h2>
                {/* Icon */}
                <div className="flex items-center justify-center p-1 text-xl lg:text-2xl xl:text-2xl">
                  {category.icon}
                </div>
              </div>

              {/* Description */}
              <p className="mt-2 text-sm text-left text-gray-400 lg:text-base">
                {category.description}
              </p>

              {/* Divider */}
              <div className="my-4 border-t-2 border-gray-700" />

              {/* Tags + Button Container */}
              <div className="flex flex-col justify-between lg:gap-4">
                {/* Practice Button */}
                <button
                  onClick={() =>
                    !category.isPro && handleCategoryClick(category.category)
                  }
                  disabled={category.isPro}
                  className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-black transition-transform bg-green-400 border-2 border-green-400 rounded-lg hover:text-green-400 h-min hover:bg-black lg:text-base"
                >
                  Practice
                  <FaArrowRightLong className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:mb-0 lg:flex-1">
                  {category.tags?.slice(0, 4).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium text-gray-200 bg-gray-700 rounded-full whitespace-nowrap lg:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {category.tags?.length > 5 && (
                    <span className="px-3 py-1 text-xs font-medium text-gray-200 bg-gray-700 rounded-full whitespace-nowrap lg:text-sm">
                      + {category.tags.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Pro Overlay */}
              {category.isPro && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/40 backdrop-blur-sm">
                  <SlLock className="mb-2 text-3xl text-gray-400" />
                  <span className="px-4 text-sm text-center text-gray-300 opacity-5 group-hover:opacity-100">
                    Coming soon for{" "}
                    <span className="font-bold text-blue-400 animate-pulse">
                      Pro
                    </span>{" "}
                    users
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
