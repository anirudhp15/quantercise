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
import { motion } from "framer-motion";
import { gsap } from "gsap";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const ProgressTracker = () => {
  const [problems, setProblems] = useState([]);
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

  // const progressOverTime = problems.map((problem) => ({
  //   date: new Date(problem.date).toLocaleDateString(),
  //   correct: problem.correct ? 1 : 0,
  // }));

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
    <div className="min-h-screen p-6 mt-16 text-gray-300 bg-gray-900">
      <div className="max-w-screen-lg mx-auto" ref={containerRef}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-4 text-4xl font-bold text-green-400"
        >
          Progress Tracker
        </motion.h1>
        <Link
          to="/"
          className="block p-4 mb-4 font-bold text-center text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700"
        >
          Back to Home
        </Link>
        <div className="mt-4">
          <h2 className="p-4 text-2xl text-center text-green-400">
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
        <div className="mt-8">
          <h2 className="p-4 text-2xl text-center text-green-400">
            Category Performance
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categoryData.map((category) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-4 bg-gray-800 rounded-lg shadow-lg"
              >
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
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <h3 className="text-xl font-bold text-green-400">
                  {category.category}
                </h3>
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
        <div className="mt-8">
          <h2 className="p-4 text-2xl text-center text-green-400">
            Time Spent Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Time Spent" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="mt-8">
          <h2 className="p-4 text-2xl text-center text-green-400">
            Improvement Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="correct" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
        <div className="mt-8">
          <h2 className="p-4 text-2xl text-center text-green-400">
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
                <h3 className="text-xl font-bold text-green-400">
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
