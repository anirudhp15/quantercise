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
  {
    id: 18,
    title: "3 Sets Tennis Game",
    description:
      "For a 3 sets tennis game, would you bet on it finishing in 2 sets or 3 sets?",
    solution:
      "Two sets - Let p=prob team 1 wins and q=prob team 2 wins. p^2 + q^2 = probability finish in two sets. 2*p*q = probability finish in three sets. p^2 + q^2 always >= 2*p*q, so the answer is two sets.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 19,
    title: "Dots on a Square",
    description:
      "I have a square, and place three dots along the 4 edges at random. What is the probability that the dots lie on distinct edges?",
    solution:
      "3/8 - Given the edge the first dot is on, the probability the other two dots are on distinct edges is (3/4)*(2/4)",
    category: "Mathematical Foundations",
  },
  {
    id: 20,
    title: "Total Handshakes",
    description:
      "You have 10 people in a room. How many total handshakes if they all shake hands?",
    solution:
      "45 - (10 choose 2) = 45 -- this is the total number of ways two people can shake hands.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 21,
    title: "Deck Choice",
    description:
      "Two decks of cards. One deck has 52 cards, the other has 104. You pick two cards separately from the same pack. If both of two cards are red, you win. Which pack will you choose?",
    solution:
      "104 card pack - (52/104)*(51/103) > (26/52)*(25/51), or 51/103 > 25/51",
    category: "Mathematical Foundations",
  },
  {
    id: 22,
    title: "Simple Multiplication",
    description: "What is 39*41?",
    solution: "1599 - 39*41 = (40-1)*(40+1) = 40*40 - 1 = 1599",
    category: "Mathematical Foundations",
  },
  {
    id: 23,
    title: "Average Salary",
    description:
      "A group of people wants to determine their average salary on the condition that no individual would be able to find out anyone else's salary. Can they accomplish this, and, if so, how?",
    solution:
      "Yes, it’s possible - The first person thinks of a random number, say X. This person adds this number to her salary. The rest of the group simply adds their salary to the initial number. Then, the first person subtracts the random number X and divides the total salary sum by the size of the group to obtain the average.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 24,
    title: "Number of Digits",
    description: "How many digits are in 99 to the 99th power?",
    solution:
      "198 - 99^99 = (100)^(99) * (.99)^99 = (10)^(198) * (.99)^99. You can convince yourself 10^198 has 199 digits, and 0.99^.99 approaches 1/e. Thus, (10)^(198) * (.99)^99 has 198 digits.",
    category: "Mathematical Foundations",
  },
  {
    id: 25,
    title: "Boarding Probability",
    description:
      "A line of 100 passengers is waiting to board a plane. They each hold a ticket to one of the 100 seats on that flight. Unfortunately, the first person in line is crazy, and will ignore the seat number on their ticket, picking a random seat to occupy. All of the other passengers are quite normal, and will go to their proper seat unless it is already occupied. If it is occupied, they will then find a free seat to sit in, at random. What is the probability that the last (100th) person to board the plane will sit in their proper seat (#100)?",
    solution:
      "0.5 - The fate of the last passenger is determined the second either the first or last seat on the plane is taken. This statement is true because the last person will either get the first seat or the last seat. All other seats will necessarily be taken by the time the last passenger gets to pick his/her seat. Since at each choice step, the first or last seat has an equal probability of being taken, the last person will get either the first or last with equal probability: 0.5.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 26,
    title: "Sum of Numbers",
    description: "What is the sum of the numbers one to 100?",
    solution:
      "5050 - Sum of numbers from 1,2....n = n*(n+1)/2. You can also think about this problem by pairing off numbers - 1 and 100, 2 and 99, 3 and 98, 4 and 97, etc. We have 50 of these pairs, and each pair sums up to 101, so the final sum = 50*101 = 5050.",
    category: "Mathematical Foundations",
  },
  {
    id: 27,
    title: "Measuring 4 Gallons",
    description:
      "You have a 3 gallon jug and 5 gallon jug, how do you measure out exactly 4 gallons? Is this possible?",
    solution:
      "Yes, it’s possible - Fill up the 3 gallon jug. Then, pour the liquid into the 5 gallon jug. Fill the 3 gallon jug again, and then fill the 5 gallon jug until it is full. We now have 1 gallon remaining in the 3 gallon jug. We empty the five gallon jug and pour the remaining 1 gallon into our 5 gallon jug. Finally, we fill the 3 gallon jug and add this to the 5 gallon jug (which already had 1 gallon). We are left with 4 gallons in the 5 gallon jug.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 28,
    title: "Coin Flip Probability",
    description:
      "You have 17 coins and I have 16 coins, we flip all coins at the same time. If you have more heads then you win, if we have the same number of heads or if you have less then I win. What's your probability of winning?",
    solution:
      "0.5 - Use recursion - The initial 16 flips have the same probability of everything. Thus, the game completely depends on if the last coin flip is tails or head (50/50 chance of H vs. T).",
    category: "Mathematical Foundations",
  },
  {
    id: 29,
    title: "Drawing Two Cards",
    description:
      "What is the probability you draw two cards of the same color from a standard 52-card deck? You are drawing without replacement.",
    solution:
      "25/51 - You either draw a black or a red card first. Then, there are 51 cards left in the deck and 25 of these cards have the same color. Thus, the probability is 25/51.",
    category: "Mathematical Foundations",
  },
  {
    id: 30,
    title: "Light Switches",
    description:
      "You’re in a room with three light switches, each of which controls one of three light bulbs in the next room. You need to determine which switch controls which bulb. All lights are off to begin, and you can’t see into one room from the other. You can inspect the other room only once. How can you find out which switches are connected to which bulbs? Is this possible?",
    solution:
      "Yes, it’s possible - Leave switch 1 off. Then, turn switch 2 on for ten minutes. After the ten minutes, turn it off and quickly turn on switch 3. Now, go into the room. The currently lit up bulb connects to switch 3. The bulb that off but still warm is from switch 2, and the remaining bulb is from switch 1.",
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 31,
    title: "World Series Odds",
    description:
      "In world series, what are the odds it goes 7 games if each team equal chance of winning?",
    solution:
      "20/64 - Out of the first three games, each team needs to win three. Thus, (6 choose 3)*(.5^6) = 20/64, as each team has a 1/2 probability of winning each game.",
    category: "Mathematical Foundations",
  },
  {
    id: 32,
    title: "Even Number of Heads",
    description:
      "Given 100 coin flips, what is the probability that you get an even number of heads?",
    solution:
      "1/2 - Whether there is an odd or even number of heads is ultimately determined by the final flip (50/50 chance of being heads vs. tails), for any number of flips.",
    category: "Mathematical Foundations",
  },
  {
    id: 33,
    title: "Ball Probability",
    description:
      "There are 5 balls, 3 red, and 2 black. What is the probability that a random ordering of the 5 balls does not have the 2 black balls next to each other?",
    solution:
      "0.6 - Because of repeats of black/red balls, there are 10 combinations of red/black balls: (5 choose 2) or (5 choose 3) spots to put the black or red balls, respectively. There are 4 places that 2 black balls can be next to each other, so the other 6 combinations do NOT have two black balls next to each other.",
    category: "Mathematical Foundations",
  },
  {
    id: 34,
    title: "Least Multiple of 15",
    description:
      "What is the least multiple of 15 whose digits consist only of 1's and 0's?",
    solution:
      "1110 - The last digit must be zero (30, 45, 60, 75, etc.). Multiples of 15 never end in 1. Then, starting checking numbers. 10, 100, 110, 1000, 1100, 1110. You will quickly arrive at the answer if you are good with your mental math.",
    category: "Mathematical Foundations",
  },
  {
    id: 35,
    title: "Is 1027 Prime?",
    description: "Is 1027 a prime number?",
    solution:
      "No - 1027 = 1000 + 27 = 10^3 + 3^3. We know a^3 + b^3 can be factored, so 1027 is NOT prime.",
    category: "Mathematical Foundations",
  },
  {
    id: 36,
    title: "Call Option Price",
    description:
      "Does the price of a call option increase when volatility increases?",
    solution:
      "Yes - sometimes a rare finance question is included in these interviews; remember that both time and volatility increase the prices of both calls and puts",
    category: "Financial Concepts and Modeling",
  },
  {
    id: 37,
    title: "Blue and Red Balls",
    description:
      "2 blue and 2 red balls, in a box, no replacing. Guess the color of the ball, you receive a dollar if you are correct. What is the dollar amount you would pay to play this game?",
    solution:
      "17/6 dollars - You’ll always get the last ball right as your sampling w/o replacement. The first ball you have a 50% chance of getting right. The second ball you have a 2/3 chance of getting right.",
    category: "Mathematical Foundations",
  },
  {
    id: 38,
    title: "Singles Digit",
    description: "What is the singles digit for 2^230?",
    solution: "4 - Repeating patterns -- 2,4,8,6,2 -- follow the pattern.",
    category: "Mathematical Foundations",
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
