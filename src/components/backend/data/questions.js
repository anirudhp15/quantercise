export const quantPracticeQuestions = [
  {
    id: 1,
    title: "Probability of Coin Toss",
    difficulty: "Easy",
    description:
      "What is the probability of getting exactly 3 heads in 5 tosses of a fair coin?",
    solution:
      "The probability is calculated using the binomial distribution formula: P(X = k) = (n choose k) * (p^k) * ((1-p)^(n-k)), where n = 5, k = 3, p = 0.5. Thus, the probability is 0.3125.",
    hints: [
      "Use the binomial distribution formula",
      "Consider n = 5, k = 3, p = 0.5",
    ],
    completed: false,
    correct: null, // null, true, false
    attempts: 0,
    timeSpent: 0, // Time in seconds
    category: "Critical Mathematical Foundations",
  },
  {
    id: 2,
    title: "Expected Value of Dice Roll",
    difficulty: "Easy",
    description:
      "What is the expected value of the sum of two fair six-sided dice?",
    solution:
      "The expected value is the sum of the expected values of the two dice. Each die has an expected value of 3.5, so the total expected value is 7.",
    hints: [
      "Calculate the expected value of one die",
      "Sum the expected values of both dice",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 3,
    title: "Normal Distribution",
    difficulty: "Medium",
    description:
      "Given a normally distributed variable with mean 0 and standard deviation 1, what is the probability that the variable takes a value between -1 and 1?",
    solution:
      "The probability is the area under the standard normal curve between -1 and 1, which is approximately 68.27%.",
    hints: [
      "Consider the properties of the standard normal distribution",
      "Look up the 68-95-99.7 rule",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 4,
    title: "Bayes' Theorem",
    difficulty: "Hard",
    description:
      "A test for a disease is 99% accurate. If 0.5% of the population has the disease, what is the probability that a person who tested positive actually has the disease?",
    solution:
      "Using Bayes' theorem, P(Disease|Positive) = (P(Positive|Disease) * P(Disease)) / P(Positive). This calculates to approximately 33.2%.",
    hints: [
      "Use Bayes' theorem formula",
      "Consider the accuracy of the test and the base rate of the disease",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 5,
    title: "Martingale Strategy",
    difficulty: "Medium",
    description:
      "Explain the martingale betting strategy and discuss its potential pitfalls.",
    solution:
      "The martingale strategy involves doubling your bet after every loss, aiming to recover all previous losses with one win. Pitfalls include the potential for significant losses and the limitation of finite bankrolls.",
    hints: [
      "Think about the doubling mechanism",
      "Consider the practical limitations",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 6,
    title: "Markov Chains",
    difficulty: "Medium",
    description: "Define a Markov chain and give an example.",
    solution:
      "A Markov chain is a stochastic process where the next state depends only on the current state. Example: A random walk on a number line where you can move one step left or right with equal probability.",
    hints: [
      "Focus on the memoryless property",
      "Consider simple examples like random walks",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 7,
    title: "Linear Regression",
    difficulty: "Medium",
    description:
      "What is the purpose of linear regression and how is it used in finance?",
    solution:
      "Linear regression models the relationship between a dependent variable and one or more independent variables. In finance, it is used to predict stock prices, returns, and other financial metrics.",
    hints: [
      "Think about the relationship between variables",
      "Consider applications in finance",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 8,
    title: "Monte Carlo Simulation",
    difficulty: "Hard",
    description:
      "Describe how Monte Carlo simulations are used in risk management.",
    solution:
      "Monte Carlo simulations use random sampling to model the probability of different outcomes in financial processes, helping to assess risk and make informed decisions.",
    hints: [
      "Focus on random sampling",
      "Consider its applications in modeling uncertainty",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 9,
    title: "Black-Scholes Model",
    difficulty: "Hard",
    description: "Explain the Black-Scholes model for option pricing.",
    solution:
      "The Black-Scholes model calculates the theoretical price of European-style options using factors such as the stock price, strike price, time to expiration, risk-free rate, and volatility.",
    hints: [
      "Understand the factors involved in the model",
      "Consider how these factors impact the option price",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 10,
    title: "Arbitrage",
    difficulty: "Medium",
    description:
      "What is arbitrage and how can it be exploited in financial markets?",
    solution:
      "Arbitrage is the simultaneous purchase and sale of an asset to profit from price differences. It is exploited by identifying mispricings in different markets or instruments.",
    hints: [
      "Think about price differences in markets",
      "Consider the mechanism of simultaneous buying and selling",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 11,
    title: "Programming Logic",
    difficulty: "Medium",
    description:
      "Write a function to find the maximum sum of a contiguous subarray.",
    solution:
      "This is solved using Kadane's Algorithm. Initialize max_sum and current_sum to the first element. Traverse the array, updating current_sum to the maximum of the current element and current_sum + current element, and updating max_sum to the maximum of max_sum and current_sum.",
    hints: ["Use Kadane's Algorithm", "Keep track of current and maximum sums"],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 12,
    title: "Data Structures",
    difficulty: "Easy",
    description:
      "Explain the difference between a stack and a queue, and provide use cases for each.",
    solution:
      "A stack is a LIFO (Last In First Out) data structure, used for tasks like reversing a string. A queue is a FIFO (First In First Out) data structure, used for tasks like task scheduling.",
    hints: [
      "Focus on the order of operations",
      "Consider practical use cases for each",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 13,
    title: "Binary Search",
    difficulty: "Medium",
    description:
      "Implement binary search on a sorted array and explain its time complexity.",
    solution:
      "Binary search repeatedly divides the search interval in half. If the target value is less than the middle element, search the left half; otherwise, search the right half. Its time complexity is O(log n).",
    hints: [
      "Divide and conquer approach",
      "Understand the logarithmic time complexity",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Programming and Algorithmic Thinking",
  },
  {
    id: 14,
    title: "Fermat's Last Theorem",
    difficulty: "Hard",
    description:
      "State Fermat's Last Theorem and discuss its significance in mathematics.",
    solution:
      "Fermat's Last Theorem states that there are no whole number solutions to the equation x^n + y^n = z^n for n > 2. It remained unproven for centuries and was finally proven by Andrew Wiles in 1994.",
    hints: [
      "Focus on the equation x^n + y^n = z^n",
      "Consider the historical significance of the proof",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 15,
    title: "Bridge Crossing Puzzle",
    difficulty: "Medium",
    description:
      "Describe the solution to the problem where four people must cross a bridge at night with one flashlight and various crossing times.",
    solution:
      "The optimal solution involves minimizing the total crossing time by always having the two fastest cross together whenever possible and strategically returning the flashlight.",
    hints: [
      "Think about minimizing the total crossing time",
      "Strategize the use of the flashlight",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 16,
    title: "Logic Gates",
    difficulty: "Medium",
    description:
      "Explain how a full adder circuit is constructed using basic logic gates.",
    solution:
      "A full adder can be constructed using two half adders and an OR gate. The first half adder adds the input bits, the second half adder adds the carry bit, and the OR gate combines the carry outputs.",
    hints: [
      "Understand the function of half adders",
      "Consider the role of the OR gate",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 17,
    title: "The Monty Hall Problem",
    difficulty: "Hard",
    description:
      "Explain the Monty Hall problem and the reasoning behind the optimal strategy.",
    solution:
      "The Monty Hall problem is a probability puzzle where switching doors after one is revealed increases the probability of winning from 1/3 to 2/3.",
    hints: [
      "Focus on the probability change after one door is revealed",
      "Understand the initial probabilities",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 18,
    title: "3 Sets Tennis Game",
    difficulty: "Medium",
    description:
      "For a 3 sets tennis game, would you bet on it finishing in 2 sets or 3 sets?",
    solution:
      "Two sets - Let p=prob team 1 wins and q=prob team 2 wins. p^2 + q^2 = probability finish in two sets. 2*p*q = probability finish in three sets. p^2 + q^2 always >= 2*p*q, so the answer is two sets.",
    hints: [
      "Consider the probabilities of winning for each team",
      "Understand the conditions for finishing in two or three sets",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 19,
    title: "Dots on a Square",
    difficulty: "Medium",
    description:
      "I have a square, and place three dots along the 4 edges at random. What is the probability that the dots lie on distinct edges?",
    solution:
      "3/8 - Given the edge the first dot is on, the probability the other two dots are on distinct edges is (3/4)*(2/4)",
    hints: [
      "Think about the placement of each dot",
      "Consider the remaining edges for each subsequent dot",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 20,
    title: "Total Handshakes",
    difficulty: "Easy",
    description:
      "You have 10 people in a room. How many total handshakes if they all shake hands?",
    solution:
      "45 - (10 choose 2) = 45 -- this is the total number of ways two people can shake hands.",
    hints: [
      "Use the combination formula",
      "Think about how each pair shakes hands",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 21,
    title: "Deck Choice",
    difficulty: "Medium",
    description:
      "Two decks of cards. One deck has 52 cards, the other has 104. You pick two cards separately from the same pack. If both of two cards are red, you win. Which pack will you choose?",
    solution:
      "104 card pack - (52/104)*(51/103) > (26/52)*(25/51), or 51/103 > 25/51",
    hints: [
      "Compare the probabilities for each deck",
      "Consider the total number of cards and red cards",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 22,
    title: "Simple Multiplication",
    difficulty: "Easy",
    description: "What is 39*41?",
    solution: "1599 - 39*41 = (40-1)*(40+1) = 40*40 - 1 = 1599",
    hints: [
      "Use the difference of squares formula",
      "Think about the factors (40-1) and (40+1)",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 23,
    title: "Average Salary",
    difficulty: "Medium",
    description:
      "A group of people wants to determine their average salary on the condition that no individual would be able to find out anyone else's salary. Can they accomplish this, and, if so, how?",
    solution:
      "Yes, it’s possible - The first person thinks of a random number, say X. This person adds this number to her salary. The rest of the group simply adds their salary to the initial number. Then, the first person subtracts the random number X and divides the total salary sum by the size of the group to obtain the average.",
    hints: [
      "Consider using a random number",
      "Ensure privacy by using a sum of salaries",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 24,
    title: "Number of Digits",
    difficulty: "Hard",
    description: "How many digits are in 99 to the 99th power?",
    solution:
      "198 - 99^99 = (100)^(99) * (.99)^99 = (10)^(198) * (.99)^99. You can convince yourself 10^198 has 199 digits, and 0.99^.99 approaches 1/e. Thus, (10)^(198) * (.99)^99 has 198 digits.",
    hints: [
      "Use logarithms to estimate the number of digits",
      "Consider the properties of powers and logarithms",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 25,
    title: "Boarding Probability",
    difficulty: "Medium",
    description:
      "A line of 100 passengers is waiting to board a plane. They each hold a ticket to one of the 100 seats on that flight. Unfortunately, the first person in line is crazy, and will ignore the seat number on their ticket, picking a random seat to occupy. All of the other passengers are quite normal, and will go to their proper seat unless it is already occupied. If it is occupied, they will then find a free seat to sit in, at random. What is the probability that the last (100th) person to board the plane will sit in their proper seat (#100)?",
    solution:
      "0.5 - The fate of the last passenger is determined the second either the first or last seat on the plane is taken. This statement is true because the last person will either get the first seat or the last seat. All other seats will necessarily be taken by the time the last passenger gets to pick his/her seat. Since at each choice step, the first or last seat has an equal probability of being taken, the last person will get either the first or last with equal probability: 0.5.",
    hints: [
      "Consider the probabilities of the first and last seat being taken",
      "Think about the process for the last passenger",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 26,
    title: "Sum of Numbers",
    difficulty: "Easy",
    description: "What is the sum of the numbers one to 100?",
    solution:
      "5050 - Sum of numbers from 1,2....n = n*(n+1)/2. You can also think about this problem by pairing off numbers - 1 and 100, 2 and 99, 3 and 98, 4 and 97, etc. We have 50 of these pairs, and each pair sums up to 101, so the final sum = 50*101 = 5050.",
    hints: [
      "Use the sum formula for the first n natural numbers",
      "Consider pairing the numbers to find the sum",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 27,
    title: "Measuring 4 Gallons",
    difficulty: "Medium",
    description:
      "You have a 3 gallon jug and 5 gallon jug, how do you measure out exactly 4 gallons? Is this possible?",
    solution:
      "Yes, it’s possible - Fill up the 3 gallon jug. Then, pour the liquid into the 5 gallon jug. Fill the 3 gallon jug again, and then fill the 5 gallon jug until it is full. We now have 1 gallon remaining in the 3 gallon jug. We empty the five gallon jug and pour the remaining 1 gallon into our 5 gallon jug. Finally, we fill the 3 gallon jug and add this to the 5 gallon jug (which already had 1 gallon). We are left with 4 gallons in the 5 gallon jug.",
    hints: [
      "Consider the steps to measure using both jugs",
      "Think about transferring water between the jugs",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 28,
    title: "Coin Flip Probability",
    difficulty: "Medium",
    description:
      "You have 17 coins and I have 16 coins, we flip all coins at the same time. If you have more heads then you win, if we have the same number of heads or if you have less then I win. What's your probability of winning?",
    solution:
      "0.5 - Use recursion - The initial 16 flips have the same probability of everything. Thus, the game completely depends on if the last coin flip is tails or head (50/50 chance of H vs. T).",
    hints: [
      "Focus on the probability of the final flip",
      "Consider the initial 16 flips and their probabilities",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 29,
    title: "Drawing Two Cards",
    difficulty: "Medium",
    description:
      "What is the probability you draw two cards of the same color from a standard 52-card deck? You are drawing without replacement.",
    solution:
      "25/51 - You either draw a black or a red card first. Then, there are 51 cards left in the deck and 25 of these cards have the same color. Thus, the probability is 25/51.",
    hints: [
      "Consider the probabilities after drawing the first card",
      "Think about the remaining cards and their colors",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 30,
    title: "Light Switches",
    difficulty: "Medium",
    description:
      "You’re in a room with three light switches, each of which controls one of three light bulbs in the next room. You need to determine which switch controls which bulb. All lights are off to begin, and you can’t see into one room from the other. You can inspect the other room only once. How can you find out which switches are connected to which bulbs? Is this possible?",
    solution:
      "Yes, it’s possible - Leave switch 1 off. Then, turn switch 2 on for ten minutes. After the ten minutes, turn it off and quickly turn on switch 3. Now, go into the room. The currently lit up bulb connects to switch 3. The bulb that off but still warm is from switch 2, and the remaining bulb is from switch 1.",
    hints: [
      "Consider the states of the bulbs when you enter the room",
      "Think about the effects of time on the bulbs",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Brain Teasers and Logical Puzzles",
  },
  {
    id: 31,
    title: "World Series Odds",
    difficulty: "Medium",
    description:
      "In world series, what are the odds it goes 7 games if each team equal chance of winning?",
    solution:
      "20/64 - Out of the first three games, each team needs to win three. Thus, (6 choose 3)*(.5^6) = 20/64, as each team has a 1/2 probability of winning each game.",
    hints: [
      "Use the combination formula for the first three games",
      "Consider the probabilities of each game being won",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 32,
    title: "Even Number of Heads",
    difficulty: "Medium",
    description:
      "Given 100 coin flips, what is the probability that you get an even number of heads?",
    solution:
      "1/2 - Whether there is an odd or even number of heads is ultimately determined by the final flip (50/50 chance of being heads vs. tails), for any number of flips.",
    hints: [
      "Focus on the probability of the final flip",
      "Consider the total number of flips and their probabilities",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 33,
    title: "Ball Probability",
    difficulty: "Medium",
    description:
      "There are 5 balls, 3 red, and 2 black. What is the probability that a random ordering of the 5 balls does not have the 2 black balls next to each other?",
    solution:
      "0.6 - Because of repeats of black/red balls, there are 10 combinations of red/black balls: (5 choose 2) or (5 choose 3) spots to put the black or red balls, respectively. There are 4 places that 2 black balls can be next to each other, so the other 6 combinations do NOT have two black balls next to each other.",
    hints: [
      "Use the combination formula for the ball positions",
      "Consider the probability of the black balls being next to each other",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 34,
    title: "Least Multiple of 15",
    difficulty: "Medium",
    description:
      "What is the least multiple of 15 whose digits consist only of 1's and 0's?",
    solution:
      "1110 - The last digit must be zero (30, 45, 60, 75, etc.). Multiples of 15 never end in 1. Then, starting checking numbers. 10, 100, 110, 1000, 1100, 1110. You will quickly arrive at the answer if you are good with your mental math.",
    hints: [
      "Consider the properties of multiples of 15",
      "Think about the digits being 1's and 0's",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 35,
    title: "Is 1027 Prime?",
    difficulty: "Medium",
    description: "Is 1027 a prime number?",
    solution:
      "No - 1027 = 1000 + 27 = 10^3 + 3^3. We know a^3 + b^3 can be factored, so 1027 is NOT prime.",
    hints: [
      "Consider the factorization of 1027",
      "Think about the properties of prime numbers",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 36,
    title: "Call Option Price",
    difficulty: "Hard",
    description:
      "Does the price of a call option increase when volatility increases?",
    solution:
      "Yes - sometimes a rare finance question is included in these interviews; remember that both time and volatility increase the prices of both calls and puts",
    hints: [
      "Consider the factors affecting option prices",
      "Think about the impact of volatility",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Financial Concepts and Modeling",
  },
  {
    id: 37,
    title: "Blue and Red Balls",
    difficulty: "Medium",
    description:
      "2 blue and 2 red balls, in a box, no replacing. Guess the color of the ball, you receive a dollar if you are correct. What is the dollar amount you would pay to play this game?",
    solution:
      "17/6 dollars - You’ll always get the last ball right as your sampling w/o replacement. The first ball you have a 50% chance of getting right. The second ball you have a 2/3 chance of getting right.",
    hints: [
      "Consider the probabilities of each draw",
      "Think about the expected value of the game",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
  {
    id: 38,
    title: "Singles Digit",
    difficulty: "Medium",
    description: "What is the singles digit for 2^230?",
    solution: "4 - Repeating patterns -- 2,4,8,6,2 -- follow the pattern.",
    hints: [
      "Look for repeating patterns in powers of 2",
      "Consider the properties of single digits",
    ],
    completed: false,
    correct: null,
    attempts: 0,
    timeSpent: 0,
    category: "Critical Mathematical Foundations",
  },
];
