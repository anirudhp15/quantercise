import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaLightbulb, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

// Define your domain
const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

const ProblemOfTheDay = () => {
  const [problem, setProblem] = useState(null);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0); // Track time spent
  const problemRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch a random problem from MongoDB every 24 hours
  useEffect(() => {
    const fetchRandomProblem = async () => {
      try {
        const response = await axios.get(
          `https://quantercise-api.vercel.app/api/questions/random`
        );
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching the problem of the day:", error);
      }
    };

    fetchRandomProblem();
  }, []);

  // Start the timer when the component mounts and stop it when it unmounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current); // Cleanup timer when the component unmounts
    };
  }, []);

  const showNextHint = () => {
    if (currentHintIndex + 1 < problem.hints.length) {
      setCurrentHintIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (!problem) {
    return <p>Loading the problem of the day...</p>;
  }

  return (
    <motion.div
      ref={problemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-green-400">
          Problem of the Day
        </h2>
        <button
          className="p-2 text-gray-400 transition-transform duration-200 hover:scale-110 hover:text-red-500"
          onClick={() => setProblem(null)}
        >
          <FaTimes size={24} />
        </button>
      </div>

      <p className="mt-4 text-lg text-gray-300">{problem.description}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-green-400">Hints:</h3>
        {hintsVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 mt-4 bg-gray-800 rounded-lg"
          >
            {problem.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
              <div key={index} className="flex items-center mt-2">
                <FaLightbulb className="mr-2 text-yellow-500" />
                <p className="text-gray-300">{hint}</p>
              </div>
            ))}
            {currentHintIndex + 1 < problem.hints.length ? (
              <button
                className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={showNextHint}
              >
                Show Next Hint
              </button>
            ) : (
              <button
                className="px-4 py-2 mt-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={() => setHintsVisible(false)}
              >
                Close Hints
              </button>
            )}
          </motion.div>
        ) : (
          <button
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => setHintsVisible(true)}
          >
            Show Hint
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-green-400">Solution:</h3>
        {solutionVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 mt-4 bg-gray-800 rounded-lg"
          >
            <p className="text-lg text-gray-300">{problem.solution}</p>
          </motion.div>
        ) : (
          <button
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => setSolutionVisible(true)}
          >
            Show Solution
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-400">
          Time Spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </h3>
      </div>
    </motion.div>
  );
};

export default ProblemOfTheDay;
