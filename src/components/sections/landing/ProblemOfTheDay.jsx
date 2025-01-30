import React, { useState, useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import { RxDoubleArrowRight } from "react-icons/rx";
import { ProblemCard, ProblemTimer } from "../problems";
import { useFetchProblem } from "../../../hooks/useFetch/useFetchNewProblem";
import { Link } from "react-router-dom";

const ProblemOfTheDay = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  const [showNotes, setShowNotes] = useState(false);
  const timerRef = useRef(null);
  const { problem, fetchNewProblem, error } = useFetchProblem();

  useEffect(() => {
    if (problem) {
      timerRef.current = setInterval(() => {
        setTimeTaken((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [problem]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    if (problem) {
      localStorage.setItem(`notes_${problem?.id}`, e.target.value);
    }
  };

  const handleSaveNotes = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  if (!problem && !error) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[50vh] bg-gray-800">
        <p className="text-gray-400 font-extralight">
          Loading today's problem...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] bg-gray-800">
        <p className="text-red-400 font-extralight">{error}</p>
        <button
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-400"
          onClick={fetchNewProblem}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="problems"
      className="relative z-10 flex flex-col-reverse lg:flex-row items-start justify-center min-h-[50vh] py-12 px-8 lg:px-24 text-gray-300 bg-gray-800"
    >
      {/* Problem Demo Section */}
      <div className="w-full lg:w-2/3">
        <ProblemCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          notes={notes}
          setNotes={setNotes}
          handleSaveNotes={handleSaveNotes}
          savedMessage={savedMessage}
          toggleNotes={() => setShowNotes(!showNotes)}
          showNotes={showNotes}
          fetchNewProblem={fetchNewProblem}
        />
        <Link
          to="/problems"
          className="block px-6 py-2 mx-auto my-8 font-bold text-white bg-blue-500 rounded-lg whitespace-nowrap w-min lg:hidden group hover:bg-blue-600"
        >
          Explore More
          <RxDoubleArrowRight className="inline-block mb-[2px] ml-2 group-hover:translate-x-1 transition-all duration-100" />
        </Link>
      </div>
      {/* Text Section */}
      <div className="w-5/6 pb-8 mx-auto leading-loose text-left lg:my-auto lg:w-1/3 lg:ml-12">
        <motion.h2
          id="concepts-words"
          className="relative pt-2 pb-4 text-4xl font-black tracking-tighter text-center text-transparent lg:text-left md:pb-8 md:text-5xl gradient-text animate-gradient"
        >
          150+ Real Problems
        </motion.h2>
        <p className="mt-4 text-xl font-bold">
          <SiOpentofu className="inline-block mb-[2px] ml-[-2px] mr-2 text-blue-400" />
          Get personalized feedback on your solutions to learn from your common
          mistakes
        </p>
        <p className="mt-4 text-lg font-medium ">
          <FaTrophy className="inline-block mb-[2px] mr-2 text-yellow-400" />
          Simulate high-pressure challenges inspired by real quant interviews to
          sharpen your problem-solving
        </p>
        <p className="mt-4 font-light text-md">
          <FaCheckCircle className="inline-block mb-[2px] mr-2 text-green-400" />
          Track your progress and master essential concepts with tailored
          feedback for continuous improvement
        </p>
        <Link
          to="/problems"
          className="hidden px-6 py-2 my-8 font-bold text-white bg-blue-500 rounded-lg whitespace-nowrap w-min lg:block group hover:bg-blue-600"
        >
          Explore More
          <RxDoubleArrowRight className="inline-block mb-[2px] ml-2 group-hover:translate-x-1 transition-all duration-100" />
        </Link>
      </div>
    </div>
  );
};

export default ProblemOfTheDay;
