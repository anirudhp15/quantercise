import React, { useState, useEffect } from "react";
import {
  FaCalculator,
  FaCode,
  FaChartLine,
  FaPuzzlePiece,
} from "react-icons/fa"; // Using FontAwesome icons

const quantPracticeQuestions = [
  {
    id: 1,
    title: "Probability of Coin Toss",
    description:
      "What is the probability of getting exactly 3 heads in 5 tosses of a fair coin?",
    solution:
      "The probability is calculated using the binomial distribution formula: P(X = k) = (n choose k) * (p^k) * ((1-p)^(n-k)), where n = 5, k = 3, p = 0.5. Thus, the probability is 0.3125.",
    category: "Mathematical Foundations",
  },
  {
    id: 2,
    title: "Expected Value of Dice Roll",
    description:
      "What is the expected value of the sum of two fair six-sided dice?",
    solution:
      "The expected value is the sum of the expected values of the two dice. Each die has an expected value of 3.5, so the total expected value is 7.",
    category: "Mathematical Foundations",
  },
  {
    id: 3,
    title: "Normal Distribution",
    description:
      "Given a normally distributed variable with mean 0 and standard deviation 1, what is the probability that the variable takes a value between -1 and 1?",
    solution:
      "The probability is the area under the standard normal curve between -1 and 1, which is approximately 68.27%.",
    category: "Mathematical Foundations",
  },
  {
    id: 4,
    title: "Bayes' Theorem",
    description:
      "A test for a disease is 99% accurate. If 0.5% of the population has the disease, what is the probability that a person who tested positive actually has the disease?",
    solution:
      "Using Bayes' theorem, P(Disease|Positive) = (P(Positive|Disease) * P(Disease)) / P(Positive). This calculates to approximately 33.2%.",
    category: "Mathematical Foundations",
  },
  {
    id: 5,
    title: "Martingale Strategy",
    description:
      "Explain the martingale betting strategy and discuss its potential pitfalls.",
    solution:
      "The martingale strategy involves doubling your bet after every loss, aiming to recover all previous losses with one win. Pitfalls include the potential for significant losses and the limitation of finite bankrolls.",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 6,
    title: "Markov Chains",
    description: "Define a Markov chain and give an example.",
    solution:
      "A Markov chain is a stochastic process where the next state depends only on the current state. Example: A random walk on a number line where you can move one step left or right with equal probability.",
    category: "Mathematical Foundations",
  },
  {
    id: 7,
    title: "Linear Regression",
    description:
      "What is the purpose of linear regression and how is it used in finance?",
    solution:
      "Linear regression models the relationship between a dependent variable and one or more independent variables. In finance, it is used to predict stock prices, returns, and other financial metrics.",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 8,
    title: "Monte Carlo Simulation",
    description:
      "Describe how Monte Carlo simulations are used in risk management.",
    solution:
      "Monte Carlo simulations use random sampling to model the probability of different outcomes in financial processes, helping to assess risk and make informed decisions.",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 9,
    title: "Black-Scholes Model",
    description: "Explain the Black-Scholes model for option pricing.",
    solution:
      "The Black-Scholes model calculates the theoretical price of European-style options using factors such as the stock price, strike price, time to expiration, risk-free rate, and volatility.",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 10,
    title: "Arbitrage",
    description:
      "What is arbitrage and how can it be exploited in financial markets?",
    solution:
      "Arbitrage is the simultaneous purchase and sale of an asset to profit from price differences. It is exploited by identifying mispricings in different markets or instruments.",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 11,
    title: "Programming Logic",
    description:
      "Write a function to find the maximum sum of a contiguous subarray.",
    solution:
      "This is solved using Kadane's Algorithm. Initialize max_sum and current_sum to the first element. Traverse the array, updating current_sum to the maximum of the current element and current_sum + current element, and updating max_sum to the maximum of max_sum and current_sum.",
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 12,
    title: "Data Structures",
    description:
      "Explain the difference between a stack and a queue, and provide use cases for each.",
    solution:
      "A stack is a LIFO (Last In First Out) data structure, used for tasks like reversing a string. A queue is a FIFO (First In First Out) data structure, used for tasks like task scheduling.",
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 13,
    title: "Binary Search",
    description:
      "Implement binary search on a sorted array and explain its time complexity.",
    solution:
      "Binary search repeatedly divides the search interval in half. If the target value is less than the middle element, search the left half; otherwise, search the right half. Its time complexity is O(log n).",
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 14,
    title: "Fermat's Last Theorem",
    description:
      "State Fermat's Last Theorem and discuss its significance in mathematics.",
    solution:
      "Fermat's Last Theorem states that there are no whole number solutions to the equation x^n + y^n = z^n for n > 2. It remained unproven for centuries and was finally proven by Andrew Wiles in 1994.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 15,
    title: "Bridge Crossing Puzzle",
    description:
      "Describe the solution to the problem where four people must cross a bridge at night with one flashlight and various crossing times.",
    solution:
      "The optimal solution involves minimizing the total crossing time by always having the two fastest cross together whenever possible and strategically returning the flashlight.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 16,
    title: "Logic Gates",
    description:
      "Explain how a full adder circuit is constructed using basic logic gates.",
    solution:
      "A full adder can be constructed using two half adders and an OR gate. The first half adder adds the input bits, the second half adder adds the carry bit, and the OR gate combines the carry outputs.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 17,
    title: "The Monty Hall Problem",
    description:
      "Explain the Monty Hall problem and the reasoning behind the optimal strategy.",
    solution:
      "The Monty Hall problem is a probability puzzle where switching doors after one is revealed increases the probability of winning from 1/3 to 2/3.",
    category: "Brain Teasers and Logical Puzzles",
  },
];
const categories = [
  {
    name: "Mathematical Foundations",
    icon: <FaCalculator className="text-4xl text-green-400" />,
    description: "Fundamental math concepts for quant interviews.",
  },
  {
    name: "Programming and Algorithmic Thinking",
    icon: <FaCode className="text-4xl text-green-400" />,
    description: "Coding skills and algorithmic problem solving.",
  },
  {
    name: "Financial Concepts and Modeling",
    icon: <FaChartLine className="text-4xl text-green-400" />,
    description: "Financial theories and quantitative modeling.",
  },
  {
    name: "Brain Teasers and Logical Puzzles",
    icon: <FaPuzzlePiece className="text-4xl text-green-400" />,
    description: "Puzzles and brain teasers to challenge your logic.",
  },
];

const PracticeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    setProblems(quantPracticeQuestions);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProblem(null); // Reset selected problem when changing category
  };

  const handleReviewAllClick = () => {
    setSelectedCategory("All Topics");
    setSelectedProblem(null); // Reset selected problem when changing category
  };

  const handleSolveProblem = (problem) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProblem(null);
  };

  const renderCategories = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            className="relative bg-gray-800 p-8 rounded-xl shadow-lg text-green-400 font-bold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="flex items-center justify-start space-x-4">
              {category.icon}
              <div>
                <h2 className="text-2xl">{category.name}</h2>
                <p className="mt-2 text-gray-300">{category.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={handleReviewAllClick}
        >
          Complete Review of All Topics
        </button>
      </div>
    </div>
  );

  const renderProblems = () => (
    <div className="grid grid-cols-1 gap-6 pb-12">
      <button
        className="bg-gray-800 p-4 rounded-lg shadow-lg text-green-400 font-bold hover:bg-gray-700 transition duration-300"
        onClick={handleBackToCategories}
      >
        Back to Categories
      </button>
      {problems
        .filter(
          (problem) =>
            selectedCategory === "All Topics" ||
            problem.category === selectedCategory
        )
        .map((problem) => (
          <div
            key={problem.id}
            className="bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-green-400">
              {problem.title}
            </h2>
            <p className="mt-2 text-gray-300">{problem.description}</p>
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={() => handleSolveProblem(problem)}
            >
              Solve Problem
            </button>
          </div>
        ))}
    </div>
  );

  const renderProblemSolution = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-gray-300 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-green-400">
          {selectedProblem.title}
        </h2>
        <p className="mt-4">{selectedProblem.solution}</p>
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 p-6 mt-16">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold text-green-400 py-4">
          Practice Problems
        </h1>
        {selectedProblem
          ? renderProblemSolution()
          : selectedCategory
          ? renderProblems()
          : renderCategories()}
      </div>
    </div>
  );
};

export default PracticeProblems;
