import React from "react";
import { TbMathMax } from "react-icons/tb";
import { AiOutlineCode } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { LiaBrainSolid } from "react-icons/lia";
import { motion } from "framer-motion";
import "../../../index.css";

const categories = [
  {
    name: "Mathematical Foundations",
    icon: <TbMathMax className="w-12 h-12 text-gray-400" />,
    subtopics: [
      "Bayesian Statistics",
      "Probability Distributions",
      "Frequentist Statistics",
      "Markov Chains",
      "Matrix Operations",
      "Eigenvalues and Eigenvectors",
      "Multivariable Calculus",
      "Combinatorics",
      "Multiple Integrals",
      "Differential Equations",
      "Linear Algebra",
      "Fourier Transforms",
      "Stochastic Calculus",
    ],
  },
  {
    name: "Algorithms & Data Structures",
    icon: <AiOutlineCode className="w-12 h-12 text-gray-400" />,
    subtopics: [
      "Arrays",
      "Trees",
      "Graphs",
      "Sorting Algorithms",
      "Searching Algorithms",
      "Knapsack Problem",
      "Dijkstra Algorithm",
      "Big O Notation",
      "Greedy Algorithms",
      "Dynamic Programming",
      "Hash Tables",
      "Recursion",
      "BFS & DFS",
      "Linked Lists",
      "Stacks & Queues",
      "Heaps",
      "Tries",
      "Segment Trees",
    ],
  },
  {
    name: "Financial Concepts",
    icon: <BsBank className="w-12 h-12 text-gray-400" />,
    subtopics: [
      "Black-Scholes Model",
      "Binomial Models",
      "Value at Risk (VaR)",
      "Stress Testing",
      "CAPM",
      "Bond Pricing",
      "Yield Curves",
      "Monte Carlo Simulation",
      "Fama-French Model",
      "Markowitz Portfolio Theory",
      "Options & Futures",
      "Derivatives Pricing",
      "Factor Investing",
      "Risk Management",
      "Financial Statements",
      "Corporate Finance",
    ],
  },
  {
    name: "Logical Reasoning",
    icon: <LiaBrainSolid className="w-12 h-12 text-gray-400" />,
    subtopics: [
      "Deductive Reasoning",
      "Inductive Reasoning",
      "Pattern Recognition",
      "Cryptarithms",
      "Number Theory",
      "Nash Equilibrium",
      "Birthday Paradox",
      "Prime Numbers",
      "Arithmetic Progressions",
      "Geometric Progressions",
      "Game Theory",
      "Puzzles",
      "Riddles",
      "Brain Teasers",
      "Logic Gates",
      "Boolean Algebra",
      "Truth Tables",
    ],
  },
];

const Category = ({ name, icon, subtopics }) => (
  <div className="flex flex-col items-center px-2 text-center">
    <div className="my-8 lg:mt-0">{icon}</div>
    <h3 className="py-2 text-xl font-extrabold tracking-tight text-gray-200 sm:text-2xl md:text-3xl xl:text-4xl w-[80%]">
      {name}
    </h3>
    <div className="mt-8 space-y-4 text-sm leading-relaxed tracking-wide text-gray-400 sm:text-lg">
      {subtopics.map((subtopic, index) => (
        <p key={index}>{subtopic}</p>
      ))}
    </div>
  </div>
);

const Topics = () => {
  return (
    <div
      id="concepts"
      className="relative py-32 w-full min-h-[150vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-800 to-black"
    >
      <div className="relative z-10 custom-shape-divider-top-1733168917">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <div className="relative px-8 mx-auto text-center max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tighter text-transparent md:text-5xl gradient-text animate-gradient">
            Explore Topics
          </h2>
          <p className="block mt-4 text-lg font-medium text-gray-300 sm:text-xl md:text-2xl lg:hidden">
            Dive deep into the concepts essential for success in quant
            interviews.
          </p>
          <p className="hidden mt-4 text-lg font-medium text-gray-300 sm:text-xl md:text-2xl lg:block">
            Dive deep into the foundational areas essential for success in quant
            finance interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 mt-12 divide-y-4 divide-gray-500 gap-y-8 lg:divide-x-4 lg:divide-y-0 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Category key={index} {...category} />
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-12 custom-shape-divider-bottom-1733342128">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Topics;
