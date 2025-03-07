import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuth } from "../../../contexts/authContext";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useUser } from "../../../contexts/userContext";

const ProgressTracker = () => {
  const [problems, setProblems] = useState([]);
  const lowDetailMode = useLowDetail().lowDetailMode;
  const { currentUser } = useAuth();
  const { isPro } = useUser();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `/api/progress/${currentUser.uid}/progress`
        );
        setProblems(response.data.progress);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    if (currentUser) {
      fetchProgress();
    }
  }, [currentUser]);

  // Aggregate Data for Visuals
  const overallProgress = [
    {
      name: "Completed",
      value: problems.filter((problem) => problem.completed).length,
    },
    {
      name: "Correct",
      value: problems.filter((problem) => problem.correct === true).length,
    },
    {
      name: "Incorrect",
      value: problems.filter((problem) => problem.correct === false).length,
    },
  ];

  const colors = ["#82ca9d", "#8884d8", "#ff7300"];

  // Progress per category
  const categories = Array.from(
    new Set(problems.map((problem) => problem.category))
  );

  const categoryProgress = categories.map((category) => {
    const categoryProblems = problems.filter(
      (problem) => problem.category === category
    );
    const completedCount = categoryProblems.filter(
      (problem) => problem.completed
    ).length;
    return {
      name: category,
      completed: (completedCount / categoryProblems.length) * 100 || 0,
    };
  });

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl text-gray-300 z-1">
      <div
        className="flex relative z-10 flex-col justify-center px-4 py-24 mx-auto max-w-screen-2xl min-h-screen"
        ref={containerRef}
      >
        <Link
          to="/home"
          className={`flex w-min items-center px-2 py-1 text-sm font-semibold border-2 rounded-lg group text-black ${
            isPro
              ? "bg-blue-400 border-blue-400 hover:text-blue-400 hover:bg-black"
              : "bg-green-400 border-green-400 hover:text-green-400 hover:bg-black"
          }`}
        >
          <FaArrowLeftLong className="mr-2 ml-1 transition-all duration-200 group-hover:-translate-x-1" />{" "}
          Home
        </Link>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-3xl font-black text-left py-4 ${
            isPro ? "text-blue-400" : "text-green-400"
          }`}
        >
          Progress
        </motion.h1>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 gap-8 p-4 bg-gray-800 rounded-lg md:grid-cols-2">
          <div className="p-4 rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl mb-2 text-center font-semibold ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Overall Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overallProgress}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {overallProgress.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progress per Category */}
          <div className="p-4 rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl mb-2 text-center font-semibold ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Progress by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
