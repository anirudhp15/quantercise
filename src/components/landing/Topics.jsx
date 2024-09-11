import React, { useEffect, useCallback } from "react";
import {
  FaCalculator,
  FaCode,
  FaChartLine,
  FaPuzzlePiece,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { throttle } from "lodash";
import "../../index.css";

const categories = [
  {
    name: "MATHEMATICAL FOUNDATIONS",
    icon: <FaCalculator className="text-xl text-blue-300" />,
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
    ],
  },
  {
    name: "ALGORITHMS & DATA STRUCTURES",
    icon: <FaCode className="text-2xl text-sky-400" />,
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
    ],
  },
  {
    name: "FINANCIAL CONCEPTS",
    icon: <FaChartLine className="text-2xl text-blue-500" />,
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
    ],
  },
  {
    name: "LOGICAL REASONING",
    icon: <FaPuzzlePiece className="text-2xl text-purple-500" />,
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
    ],
  },
];

const Topics = React.memo(() => {
  const controls = useAnimation();

  const handleScroll = useCallback(
    throttle(() => {
      const scrollPosition = window.scrollY;
      const screenWidth = window.innerWidth;
      const multiplier =
        screenWidth < 768 ? 0.25 : screenWidth >= 1280 ? 2 : 1.5;

      document.querySelectorAll(".marquee").forEach((marquee) => {
        const direction = marquee.classList.contains("marquee-left") ? -1 : 1;
        marquee.style.transform = `translateX(${
          scrollPosition * direction * multiplier
        }px)`;

        const element = document.getElementById("concepts-words");
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
          controls.start({ opacity: 1, y: 0 });
        }
      });
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div id="concepts" className="w-full min-h-screen py-16 text-gray-300">
      <div className="relative max-w-screen-lg px-4 mx-auto text-center">
        <div className="mx-auto text-center">
          <motion.h2
            id="concepts-words"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative pt-4 text-3xl font-bold text-transparent z-2 md:pb-8 sm:text-4xl md:text-5xl gradient-text animate-gradient"
          >
            Areas of Focus
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 text-lg font-medium sm:text-xl md:text-2xl"
        >
          Quantercise provides a comprehensive range of topics designed to help
          dedicated students excel in quant finance interviews.
        </motion.p>
      </div>

      <div className="hidden lg:block">
        <div className="relative z-10 w-5/6 p-10 mx-auto mt-8 transition-all duration-200 border-2 border-gray-500 wrapper bg-gray-950 rounded-3xl hover:border-gray-300">
          {categories.map((category, index) => (
            <div key={index} className="category-section">
              <div
                className={`category-label flex items-center justify-center ${
                  index % 2 === 0
                    ? "md:justify-start md:ml-8"
                    : "md:justify-end md:mr-8"
                } mt-4`}
              >
                <span className="hidden md:block">{category.icon}</span>
                <span className="relative ml-2 font-semibold text-center text-transparent md:text-left z-2 gradient-text animate-gradient">
                  {category.name}
                </span>
              </div>
              <div className="marquee-container">
                <div
                  className={`marquee ${
                    index % 2 === 0 ? "marquee-left" : "marquee-right"
                  }`}
                >
                  {category.subtopics
                    .concat(category.subtopics)
                    .map((subtopic, subIndex) => (
                      <div
                        key={subIndex}
                        className={`marquee-item ${
                          index % 2 === 0 ? "left-align" : "right-align"
                        }`}
                      >
                        <p className="font-extralight">{subtopic}</p>
                      </div>
                    ))}
                </div>
              </div>
              {index < categories.length - 1 && <div className="divider"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Mobile View */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 gap-6 mx-4 mt-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative z-10 w-2/3 p-6 mx-auto text-center transition-all duration-200 border-2 border-gray-500 rounded-lg shadow-lg sm:w-1/2 bg-gray-950 hover:border-gray-300"
            >
              <div className="flex justify-center mb-4">
                {/* <span className="mr-2">{category.icon}</span> */}
                <span className="font-semibold text-transparent gradient-text animate-gradient">
                  {category.name}
                </span>
              </div>
              <ul className="ml-4 list-none list-inside">
                {category.subtopics.map((subtopic, subIndex) => (
                  <li key={subIndex} className="text-sm font-light">
                    {subtopic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Topics;
