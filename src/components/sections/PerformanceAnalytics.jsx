import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { useLowDetail } from "../../contexts/LowDetailContext";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import AnimatedGrid2 from "./landing/animatedGrid/AnimatedGrid2"; // Import AnimatedGrid2

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const PerformanceAnalytics = () => {
  const [problems, setProblems] = useState([]);
  const { isPro } = useAuth();
  const lowDetailMode = useLowDetail().lowDetailMode;
  const containerRef = useRef(null);

  useEffect(() => {
    const storedProblems = JSON.parse(localStorage.getItem("problems"));
    if (storedProblems) {
      setProblems(storedProblems);
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  const completedProblems = problems.filter((problem) => problem.completed);
  const correctProblems = problems.filter(
    (problem) => problem.correct === true
  );
  const incorrectProblems = problems.filter(
    (problem) => problem.correct === false
  );

  const categories = [
    "Critical Mathematical Foundations",
    "Programming and Algorithmic Thinking",
    "Financial Concepts and Modeling",
    "Brain Teasers and Logical Puzzles",
  ];

  const categoryData = categories.map((category) => ({
    name: category,
    completed: completedProblems.filter(
      (problem) => problem.category === category
    ).length,
    correct: correctProblems.filter((problem) => problem.category === category)
      .length,
    incorrect: incorrectProblems.filter(
      (problem) => problem.category === category
    ).length,
  }));

  const overallData = [
    { name: "Completed", value: completedProblems.length },
    { name: "Correct", value: correctProblems.length },
    { name: "Incorrect", value: incorrectProblems.length },
  ];

  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const difficultyData = difficultyLevels.map((level) => ({
    name: level,
    completed: completedProblems.filter(
      (problem) => problem.difficulty === level
    ).length,
    correct: correctProblems.filter((problem) => problem.difficulty === level)
      .length,
    incorrect: incorrectProblems.filter(
      (problem) => problem.difficulty === level
    ).length,
  }));

  return (
    <div className="relative py-16 text-gray-300">
      {!lowDetailMode && <AnimatedGrid2 />}

      <div
        className="relative z-10 items-center max-w-screen-lg mx-auto"
        ref={containerRef}
      >
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`pt-6 text-4xl font-black ${
            isPro ? "text-blue-400" : "text-green-400"
          }`}
        >
          Performance Analytics
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex justify-start py-4"
        >
          <Link
            to="/home"
            className={`flex items-center px-2 py-1 text-sm font-semibold transition-all duration-150 border-2 rounded-lg group hover:text-black ${
              isPro
                ? "text-blue-400 border-blue-400 hover:bg-blue-300"
                : "text-green-400 border-green-400 hover:bg-green-300"
            }`}
          >
            <FaArrowLeftLong className="mr-2" /> Home
          </Link>
        </motion.div>

        {/* Bento board style layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl text-center ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Overall Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {overallData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 border rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl text-center ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Category Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#00C49F" />
                <Bar dataKey="correct" fill="#FFBB28" />
                <Bar dataKey="incorrect" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 border rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl text-center ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Difficulty Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={difficultyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#00C49F" />
                <Bar dataKey="correct" stackId="a" fill="#FFBB28" />
                <Bar dataKey="incorrect" stackId="a" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
