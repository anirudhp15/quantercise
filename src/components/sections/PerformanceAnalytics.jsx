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
import { motion } from "framer-motion";
import { gsap } from "gsap";

const PerformanceAnalytics = () => {
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

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen p-6 mt-16 text-gray-300 bg-gray-900">
      <div className="max-w-screen-lg mx-auto" ref={containerRef}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-4 text-4xl font-bold text-green-400"
        >
          Performance Analytics
        </motion.h1>
        <Link
          to="/"
          className="block p-4 mb-4 font-bold text-center text-green-400 transition duration-300 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700"
        >
          Back to Home
        </Link>
        <div className="mt-4">
          <h2 className="p-4 text-2xl text-center text-green-400">
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
        <div className="mt-8">
          <h2 className="p-4 text-2xl text-center text-green-400">
            Category Performance
          </h2>
          <ResponsiveContainer width="100%" height={400}>
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
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
