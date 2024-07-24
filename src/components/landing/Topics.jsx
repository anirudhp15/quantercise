import React, { useEffect } from "react";
import {
  FaCalculator,
  FaCode,
  FaChartLine,
  FaPuzzlePiece,
} from "react-icons/fa";
import "../../index.css";

const categories = [
  {
    name: "MATHEMATICAL FOUNDATIONS",
    icon: <FaCalculator className="text-4xl text-blue-300" />,
    subtopics: [
      "Bayes' Theorem",
      "Probability Distributions",
      "Descriptive Statistics",
      "Inferential Statistics",
      "Matrix Operations",
      "Eigenvalues and Eigenvectors",
      "Multivariable Calculus",
      "Multiple Integrals",
      "Differential Equations",
      "Linear Programming",
    ],
  },
  {
    name: "ALGORITHMS & DATA STRUCTURES",
    icon: <FaCode className="text-4xl text-sky-400" />,
    subtopics: [
      "Arrays",
      "Trees",
      "Graphs",
      "Merge Sort",
      "Quick Sort",
      "Binary Search",
      "Knapsack Problem",
      "Dijkstra Algorithm",
      "Big O Notation",
      "Greedy Algorithms",
      "Dynamic Programming",
      "Hash Tables",
      "Recursion",
      "Breadth-First Search",
      "Depth-First Search",
    ],
  },
  {
    name: "FINANCIAL CONCEPTS",
    icon: <FaChartLine className="text-4xl text-blue-500" />,
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
    icon: <FaPuzzlePiece className="text-4xl text-purple-500" />,
    subtopics: [
      "Deductive Reasoning",
      "Inductive Reasoning",
      "Pattern Recognition",
      "Cryptarithms",
      "Magic Squares",
      "Nash Equilibrium",
      "Monty Hall Problem",
      "Birthday Paradox",
      "Travelling Salesman Problem",
      "Prime Numbers",
      "Combinatorics",
      "Arithmetic Progressions",
      "Geometric Progressions",
    ],
  },
];

const Topics = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      document.querySelectorAll(".marquee").forEach((marquee, index) => {
        const direction = marquee.classList.contains("marquee-left") ? -1 : 1;
        marquee.style.transform = `translateX(${
          scrollPosition * direction * 2
        }px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="concepts" className="w-full min-h-screen py-16 text-gray-300">
      <div className="relative max-w-screen-lg px-4 mx-auto text-center">
        <div className="mx-auto text-center">
          <h2 className="relative pt-4 text-3xl font-bold text-transparent z-2 md:pb-8 sm:text-4xl md:text-5xl bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            Areas of Focus
          </h2>
        </div>
        <p className="mt-4 text-lg font-medium sm:text-xl md:text-2xl">
          Quantercise provides a comprehensive range of topics designed to help
          dedicated students excel in quant finance interviews.
        </p>
      </div>
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
              <span className="ml-2 font-semibold text-center md:text-left">
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
  );
};

export default Topics;
