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
} from "recharts";
import { motion } from "framer-motion";
import { gsap } from "gsap";

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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
