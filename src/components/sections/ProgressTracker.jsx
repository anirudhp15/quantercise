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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { useLowDetail } from "../../contexts/LowDetailContext";
import AnimatedGrid2 from "../landing/AnimatedGrid2";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const ProgressTracker = () => {
  const [problems, setProblems] = useState([]);
  const lowDetailMode = useLowDetail().lowDetailMode;
  const { isPro } = useAuth();
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

  const data = [
    { name: "Completed", count: completedProblems.length },
    { name: "Correct", count: correctProblems.length },
    { name: "Incorrect", count: incorrectProblems.length },
  ];

  const categoryData = [
    {
      category: "Critical Mathematical Foundations",
      completed: completedProblems.filter(
        (problem) => problem.category === "Critical Mathematical Foundations"
      ).length,
      correct: correctProblems.filter(
        (problem) => problem.category === "Critical Mathematical Foundations"
      ).length,
      incorrect: incorrectProblems.filter(
        (problem) => problem.category === "Critical Mathematical Foundations"
      ).length,
      timeSpent: completedProblems
        .filter(
          (problem) => problem.category === "Critical Mathematical Foundations"
        )
        .reduce((total, problem) => total + problem.timeSpent, 0),
    },
    {
      category: "Programming and Algorithmic Thinking",
      completed: completedProblems.filter(
        (problem) => problem.category === "Programming and Algorithmic Thinking"
      ).length,
      correct: correctProblems.filter(
        (problem) => problem.category === "Programming and Algorithmic Thinking"
      ).length,
      incorrect: incorrectProblems.filter(
        (problem) => problem.category === "Programming and Algorithmic Thinking"
      ).length,
      timeSpent: completedProblems
        .filter(
          (problem) =>
            problem.category === "Programming and Algorithmic Thinking"
        )
        .reduce((total, problem) => total + problem.timeSpent, 0),
    },
    {
      category: "Financial Concepts and Modeling",
      completed: completedProblems.filter(
        (problem) => problem.category === "Financial Concepts and Modeling"
      ).length,
      correct: correctProblems.filter(
        (problem) => problem.category === "Financial Concepts and Modeling"
      ).length,
      incorrect: incorrectProblems.filter(
        (problem) => problem.category === "Financial Concepts and Modeling"
      ).length,
      timeSpent: completedProblems
        .filter(
          (problem) => problem.category === "Financial Concepts and Modeling"
        )
        .reduce((total, problem) => total + problem.timeSpent, 0),
    },
    {
      category: "Brain Teasers and Logical Puzzles",
      completed: completedProblems.filter(
        (problem) => problem.category === "Brain Teasers and Logical Puzzles"
      ).length,
      correct: correctProblems.filter(
        (problem) => problem.category === "Brain Teasers and Logical Puzzles"
      ).length,
      incorrect: incorrectProblems.filter(
        (problem) => problem.category === "Brain Teasers and Logical Puzzles"
      ).length,
      timeSpent: completedProblems
        .filter(
          (problem) => problem.category === "Brain Teasers and Logical Puzzles"
        )
        .reduce((total, problem) => total + problem.timeSpent, 0),
    },
  ];

  const milestoneData = [
    {
      milestone: "10 Problems Solved",
      achieved: completedProblems.length >= 10,
    },
    {
      milestone: "20 Correct Answers",
      achieved: correctProblems.length >= 20,
    },
    {
      milestone: "50 Problems Attempted",
      achieved: problems.length >= 50,
    },
  ];

  return (
    <div className="relative py-16 text-gray-300">
      {!lowDetailMode && <AnimatedGrid2 />}

      <div className="relative z-10 max-w-screen-lg mx-auto" ref={containerRef}>
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`pt-6 text-4xl font-bold ${
            isPro ? "text-blue-400" : "text-green-400"
          }`}
        >
          Progress Tracker
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
                ? "text-blue-400 border-blue-400 hover:bg-blue-400"
                : "text-green-400 border-green-400 hover:bg-green-400"
            }`}
          >
            <FaArrowLeftLong className="mr-2" /> Home
          </Link>
        </motion.div>

        {/* Overall Progress and Time Spent Analysis Side by Side */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-4 border rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl text-center ${
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

          <div className="p-4 border rounded-lg shadow-lg bg-gray-950">
            <h2
              className={`text-2xl text-center ${
                isPro ? "text-blue-400" : "text-green-400"
              }`}
            >
              Time Spent Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
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

        {/* Detailed Category Insights */}
        <div className="mt-8">
          <h2
            className={`p-4 md:pl-0 font-semibold text-2xl text-center md:text-left ${
              isPro ? "text-blue-400" : "text-green-400"
            }`}
          >
            Detailed Category Insights
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categoryData.map((category) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-4 border rounded-lg shadow-lg bg-gray-950"
              >
                <h3
                  className={`text-xl font-normal ${
                    isPro ? "text-blue-400" : "text-green-400"
                  }`}
                >
                  {category.category}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      isAnimationActive={false}
                      data={[
                        { name: "Completed", value: category.completed },
                        { name: "Correct", value: category.correct },
                        { name: "Incorrect", value: category.incorrect },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {[
                        { name: "Completed", value: category.completed },
                        { name: "Correct", value: category.correct },
                        { name: "Incorrect", value: category.incorrect },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <p className="mt-2">
                  <span className="font-bold">Completed: </span>
                  {category.completed}
                </p>
                <p>
                  <span className="font-bold">Correct: </span>
                  {category.correct}
                </p>
                <p>
                  <span className="font-bold">Incorrect: </span>
                  {category.incorrect}
                </p>
                <p>
                  <span className="font-bold">Time Spent: </span>
                  {Math.round(category.timeSpent / 60)} mins
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestones & Achievements */}
        <div className="mt-8">
          <h2
            className={`p-4 md:pl-0 font-semibold text-2xl text-center md:text-left ${
              isPro ? "text-blue-400" : "text-green-400"
            }`}
          >
            Milestones & Achievements
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {milestoneData.map((milestone) => (
              <motion.div
                key={milestone.milestone}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`p-4 rounded-lg shadow-lg ${
                  milestone.achieved ? "bg-green-800" : "bg-gray-800"
                }`}
              >
                <h3
                  className={`text-xl font-bold ${
                    isPro ? "text-blue-400" : "text-green-400"
                  }`}
                >
                  {milestone.milestone}
                </h3>
                <p className="mt-2">
                  {milestone.achieved ? "Achieved" : "Not Achieved"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
