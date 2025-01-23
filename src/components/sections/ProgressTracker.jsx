import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { useLowDetail } from "../../contexts/LowDetailContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import AnimatedGrid2 from "./landing/animatedGrid/AnimatedGrid2";

const ProgressTracker = () => {
  const [problems, setProblems] = useState([]);
  const lowDetailMode = useLowDetail().lowDetailMode;
  const { currentUser, isPro } = useAuth();
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

  const data = [
    {
      name: "Completed",
      count: problems.filter((problem) => problem.completed).length,
    },
    {
      name: "Correct",
      count: problems.filter((problem) => problem.correct === true).length,
    },
    {
      name: "Incorrect",
      count: problems.filter((problem) => problem.correct === false).length,
    },
  ];

  return (
    <div className="relative w-full max-w-screen-xl mx-auto text-gray-300 z-1">
      <div
        className="relative z-10 flex flex-col justify-center max-w-screen-lg min-h-screen mx-auto"
        ref={containerRef}
      >
        <Link
          to="/home"
          className={`flex w-min items-center px-2 py-1 text-sm font-semibold border-2 rounded-lg group text-black ${
            isPro
              ? "hover:text-blue-400 border-blue-400 bg-blue-400 hover:bg-black"
              : "hover:text-green-400 border-green-400 bg-green-400 hover:bg-black"
          }`}
        >
          <FaArrowLeftLong className="ml-1 mr-2 transition-all duration-200 group-hover:-translate-x-1" />{" "}
          Home
        </Link>
        {/* Title with ReactTyped */}
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-4xl font-black text-left py-4 ${
            isPro ? "text-blue-400" : "text-green-400"
          }`}
        >
          Progress
        </motion.h1>

        {/* Overall Progress and Time Spent Analysis */}
        <div className="grid grid-cols-1 gap-8 p-4 bg-gray-800 rounded-lg md:grid-cols-2">
          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-900">
            <h2
              className={`text-2xl mb-2 text-center font-semibold ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Overall Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl mb-2 text-center font-semibold ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Time Spent Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="timeSpent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
