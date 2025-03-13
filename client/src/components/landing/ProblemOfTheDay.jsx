import React, { useState, useEffect, useRef } from "react";

import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import { RxDoubleArrowRight } from "react-icons/rx";
import { ProblemCard } from "../sections/problems";
import { useFetchProblem } from "../../hooks/useFetch/useFetchNewProblem";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const ProblemOfTheDay = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const { isPro } = useUser();
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
        <p className="font-extralight text-gray-400">
          Loading today's problem...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] bg-gray-800">
        <p className="font-extralight text-red-400">{error}</p>
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
      className="relative z-10 flex flex-col-reverse xl:flex-row items-start justify-center min-h-[50vh] py-12 px-4 xl:px-24 text-gray-300 bg-gray-800"
    >
      {/* Problem Demo Section */}
      <div className="w-full xl:w-2/3">
        <ProblemCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          isPro={isPro}
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
          className="block px-6 py-2 mx-auto my-8 w-min font-bold text-black whitespace-nowrap bg-green-500 rounded-lg xl:hidden group hover:bg-green-600"
        >
          Explore More
          <RxDoubleArrowRight className="inline-block mb-[2px] ml-2 group-hover:translate-x-1 transition-all duration-100" />
        </Link>
      </div>
      {/* Text Section */}
      <div className="px-4 pb-8 mx-auto leading-loose text-left xl:my-auto lg:w-1/2 xl:w-1/3 xl:ml-12">
        <motion.h2
          id="concepts-words"
          className="relative pt-2 pb-4 text-4xl font-bold tracking-tighter text-center text-transparent xl:text-left md:pb-8 md:text-5xl gradient-text animate-gradient"
        >
          150+ Problems
        </motion.h2>
        <div className="flex flex-col gap-4 mx-auto w-auto">
          <p className="flex text-base font-medium text-gray-300">
            <SiOpentofu className="mt-1 mr-2 w-5 h-5 text-blue-400 line-clamp-2" />
            Get personalized feedback to learn from common mistakes.
          </p>

          <p className="flex text-base text-gray-300">
            <FaTrophy className="mt-1 mr-2 w-5 h-5 text-yellow-400" />
            High-pressure challenges inspired by real quant interviews.
          </p>

          <p className="flex text-base text-gray-300">
            <FaCheckCircle className="mt-1 mr-2 w-5 h-5 text-green-400" />
            Track your progress and master essential concepts.
          </p>
        </div>

        <Link
          to="/problems"
          className="hidden px-6 py-2 my-8 w-min font-bold text-black whitespace-nowrap bg-green-500 rounded-lg xl:block group hover:bg-green-600"
        >
          Explore More
          <RxDoubleArrowRight className="inline-block mb-[2px] ml-2 group-hover:translate-x-1 transition-all duration-100" />
        </Link>
      </div>
    </div>
  );
};

export default ProblemOfTheDay;
