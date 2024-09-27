import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaLightbulb, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const ProblemOfTheDay = () => {
  const [problem, setProblem] = useState(null);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [nextProblemTime, setNextProblemTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [solved, setSolved] = useState(false);
  const problemRef = useRef(null);
  const timerRef = useRef(null);

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchRandomProblem = async () => {
      const lastFetchedTime = localStorage.getItem("lastFetchedTime");
      const now = new Date().getTime();

      if (!lastFetchedTime || now - lastFetchedTime > ONE_DAY_MS) {
        try {
          const response = await axios.get(
            `https://quantercise-api.vercel.app/api/questions/random`
          );
          setProblem(response.data);
          const nextProblem = now + ONE_DAY_MS;
          setNextProblemTime(nextProblem);
          localStorage.setItem("lastFetchedTime", now);
          localStorage.setItem("nextProblemTime", nextProblem);
        } catch (error) {
          console.error("Error fetching the problem of the day:", error);
        }
      } else {
        const nextTime = parseInt(localStorage.getItem("nextProblemTime"));
        setNextProblemTime(nextTime);
      }
    };

    fetchRandomProblem();
  }, []);

  useEffect(() => {
    if (nextProblemTime) {
      timerRef.current = setInterval(() => {
        const now = new Date().getTime();
        const timeRemaining = nextProblemTime - now;

        if (timeRemaining > 0) {
          const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
          const seconds = Math.floor((timeRemaining / 1000) % 60);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          clearInterval(timerRef.current);
          setProblem(null);
        }
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [nextProblemTime]);

  useEffect(() => {
    if (problem) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [problem]);

  const handleShowSolution = () => {
    setSolutionVisible(true);
    setSolved(true);
  };

  if (!problem && countdown) {
    return (
      <div className="flex items-center h-screen">
        <motion.div
          ref={problemRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-screen-xl mx-auto border-2 border-gray-700 rounded-lg shadow-lg bg-gray-950"
        >
          <div className="mx-auto text-center">
            <h2 className="relative p-8 text-4xl font-bold text-gray-300 md:p-12 z-2 md:text-5xl">
              Think{" "}
              <span className="relative text-4xl font-bold text-transparent z-2 md:text-5xl gradient-text animate-gradient">
                deep
              </span>
              , solve{" "}
              <span className="relative text-4xl font-bold text-transparent z-2 md:text-5xl gradient-text animate-gradient">
                fast
              </span>
              .
            </h2>
            <p className="relative max-w-screen-lg p-8 mx-auto text-lg font-normal text-gray-300 z-2 sm:text-xl md:text-2xl">
              Today's problem solved! Come back in{" "}
              <span className="font-black text-white">{countdown}</span> for
              your next chance to test your skills!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!problem) {
    return <p>Loading the problem of the day...</p>;
  }

  return (
    <div id="problems" className="flex items-center h-screen">
      <motion.div
        ref={problemRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-2/3 p-8 mx-auto border-2 border-gray-700 rounded-lg shadow-lg bg-gray-950"
      >
        <div className="mx-auto text-center">
          <h2 className="relative py-8 text-4xl font-bold text-transparent z-2 md:pb-12 md:text-5xl gradient-text animate-gradient">
            Problem of the Day
          </h2>
        </div>

        <p className="mt-4 text-lg text-gray-300">{problem.description}</p>

        <div className="flex items-center justify-between mt-6">
          {!solved && (
            <button
              onClick={handleShowSolution}
              className="px-4 py-2 text-sm text-white transition-transform duration-200 bg-blue-500 rounded hover:bg-blue-600"
            >
              Show Solution
            </button>
          )}
          {solved && (
            <button
              disabled
              className="px-4 py-2 text-sm text-white bg-green-500 rounded"
            >
              Solved!
            </button>
          )}

          <button
            className="p-2 text-gray-400 transition-transform duration-200 hover:scale-110 hover:text-red-500"
            onClick={() => setProblem(null)}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {solutionVisible && (
          <div className="p-4 mt-6 text-gray-300 bg-gray-800 rounded">
            <p>{problem.solution}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProblemOfTheDay;
