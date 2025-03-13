import React from "react";
import { FaTrophy, FaFire } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsBank } from "react-icons/bs";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Overview = ({
  startedCount,
  completedCount,
  streakCount,
  timeAgo,
  problem,
  isPro,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="overflow-hidden mt-4 w-full bg-gray-900 rounded-lg shadow-lg"
    >
      <div className="flex flex-col gap-2 justify-between p-4 border-b-2 border-gray-700 lg:flex-row sm:p-6">
        <h3 className="text-2xl font-bold text-gray-200">Overview</h3>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 3 }}
          className="hidden flex-wrap gap-2 justify-center text-xs font-normal lg:justify-end lg:flex"
        >
          <Link
            to="/practice-problems"
            className="flex justify-center items-center px-2 py-1 text-green-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-green-400"
          >
            Practice
            <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          {isPro === true && (
            <Link
              to="/applications"
              className="flex justify-center items-center px-2 py-1 text-sky-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-sky-400"
            >
              Add Application
              <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
          <Link
            to="/profile"
            className="flex justify-center items-center px-2 py-1 text-gray-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-gray-400"
          >
            Profile
            <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
        {/* Stats Card 1 - Problems Completed */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Problems Started
              </p>
              <p className="text-2xl font-bold text-orange-300">
                {startedCount || 0}
              </p>
            </div>
            <div className="p-3 text-green-400 bg-gray-700 rounded-full">
              <FaTrophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="mt-1 text-xs text-green-400">
              {completedCount || 0}{" "}
              <span className="text-gray-400">completed</span>
            </p>
            <div className="overflow-hidden relative mt-2 w-full h-2 bg-gray-900 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-400"
                style={{
                  width: `${Math.min((completedCount || 0) * 2, 100)}%`,
                }}
              ></div>
              <div
                className="absolute top-0 left-0 h-full bg-orange-400 opacity-75"
                style={{
                  width: `${Math.min((startedCount || 0) * 2, 100)}%`,
                }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {completedCount === 0
                ? "Solve problems to build your progress"
                : `You're making great progress!`}
            </p>
          </div>
        </div>

        {/* Stats Card 2 - Current Streak */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-200">
                {streakCount} days
              </p>
            </div>
            <div className="p-3 text-red-400 bg-gray-700 rounded-full">
              <FaFire className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="mt-1 text-xs text-gray-400">Last active: {timeAgo}</p>
            <div className="flex mt-2 space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < 1 ? "bg-red-400" : "bg-gray-700"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Card 3 - Problem of the Day */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-750 sm:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Featured Problem
              </p>
              <p className="text-xl font-bold text-gray-200">
                {problem ? problem.title : "Loading..."}
              </p>
            </div>
            <div className="p-3 text-green-400 bg-gray-700 rounded-full">
              <BsBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center mt-2 space-x-2">
              {problem && (
                <>
                  <span
                    className={`px-2 py-1 text-xs font-medium ${
                      problem.difficulty === "Easy"
                        ? "text-green-400 bg-gray-700"
                        : problem.difficulty === "Medium"
                        ? "text-yellow-400 bg-gray-700"
                        : "text-red-400 bg-gray-700"
                    } rounded`}
                  >
                    {problem.difficulty}
                  </span>
                  {problem.tags?.slice(0, 1).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium text-green-400 bg-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-400">
                {problem ? problem.category : "Loading..."}
              </p>
              <Link
                to="/practice-problems"
                className="flex justify-center items-center px-3 py-1 text-xs text-green-400 bg-gray-700 rounded border border-gray-600 transition-all duration-200 hover:bg-gray-600 hover:border-green-400"
              >
                Solve Now
                <FaArrowRightLong className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
