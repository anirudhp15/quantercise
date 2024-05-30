import React, { useState, useEffect } from "react";

const quantPracticeQuestions = [
  {
    id: 1,
    title: "Probability of Coin Toss",
    description:
      "What is the probability of getting exactly 3 heads in 5 tosses of a fair coin?",
    solution:
      "The probability is calculated using the binomial distribution formula: P(X = k) = (n choose k) * (p^k) * ((1-p)^(n-k)), where n = 5, k = 3, p = 0.5. Thus, the probability is 0.3125.",
  },
  {
    id: 2,
    title: "Expected Value of Dice Roll",
    description:
      "What is the expected value of the sum of two fair six-sided dice?",
    solution:
      "The expected value is the sum of the expected values of the two dice. Each die has an expected value of 3.5, so the total expected value is 7.",
  },
  {
    id: 3,
    title: "Normal Distribution",
    description:
      "Given a normally distributed variable with mean 0 and standard deviation 1, what is the probability that the variable takes a value between -1 and 1?",
    solution:
      "The probability is the area under the standard normal curve between -1 and 1, which is approximately 68.27%.",
  },
  {
    id: 4,
    title: "Bayes' Theorem",
    description:
      "A test for a disease is 99% accurate. If 0.5% of the population has the disease, what is the probability that a person who tested positive actually has the disease?",
    solution:
      "Using Bayes' theorem, P(Disease|Positive) = (P(Positive|Disease) * P(Disease)) / P(Positive). This calculates to approximately 33.2%.",
  },
  {
    id: 5,
    title: "Martingale Strategy",
    description:
      "Explain the martingale betting strategy and discuss its potential pitfalls.",
    solution:
      "The martingale strategy involves doubling your bet after every loss, aiming to recover all previous losses with one win. Pitfalls include the potential for significant losses and the limitation of finite bankrolls.",
  },
  {
    id: 6,
    title: "Markov Chains",
    description: "Define a Markov chain and give an example.",
    solution:
      "A Markov chain is a stochastic process where the next state depends only on the current state. Example: A random walk on a number line where you can move one step left or right with equal probability.",
  },
  {
    id: 7,
    title: "Linear Regression",
    description:
      "What is the purpose of linear regression and how is it used in finance?",
    solution:
      "Linear regression models the relationship between a dependent variable and one or more independent variables. In finance, it is used to predict stock prices, returns, and other financial metrics.",
  },
  {
    id: 8,
    title: "Monte Carlo Simulation",
    description:
      "Describe how Monte Carlo simulations are used in risk management.",
    solution:
      "Monte Carlo simulations use random sampling to model the probability of different outcomes in financial processes, helping to assess risk and make informed decisions.",
  },
  {
    id: 9,
    title: "Black-Scholes Model",
    description: "Explain the Black-Scholes model for option pricing.",
    solution:
      "The Black-Scholes model calculates the theoretical price of European-style options using factors such as the stock price, strike price, time to expiration, risk-free rate, and volatility.",
  },
  {
    id: 10,
    title: "Arbitrage",
    description:
      "What is arbitrage and how can it be exploited in financial markets?",
    solution:
      "Arbitrage is the simultaneous purchase and sale of an asset to profit from price differences. It is exploited by identifying mispricings in different markets or instruments.",
  },
];

const PracticeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    setProblems(quantPracticeQuestions);
  }, []);

  const handleSolveProblem = (problem) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  return (
    <div className="bg-gray-900 text-gray-300 p-6 mt-16">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-green-400 py-4">
          Practice Problems
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold text-green-400">
                {problem.title}
              </h2>
              <p className="mt-2">{problem.description}</p>
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={() => handleSolveProblem(problem)}
              >
                Solve Problem
              </button>
            </div>
          ))}
        </div>
        {selectedProblem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-300 max-w-md w-full">
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
        )}
      </div>
    </div>
  );
};

export default PracticeProblems;
