import React from "react";
import { motion } from "framer-motion";
import practiceProblemsImage from "/Users/anipotts/Desktop/VS Code Projects/quantercise/src/pics/practice_problems.jpg";
import progressImage from "/Users/anipotts/Desktop/VS Code Projects/quantercise/src/pics/progress.jpg";

const Features = () => {
  const featureList = [
    {
      title: "Extensive Question Bank",
      description: `Access over 50 real quant finance interview questions that cover a wide range of topics from probability to financial modeling. Each question is designed to test your understanding and help you practice the types of questions you'll encounter in actual interviews.`,
      color: "text-green-400",
    },
    {
      title: "Detailed Solutions",
      description: `Every question comes with a step-by-step solution, breaking down complex problems into manageable steps. Our detailed explanations help you understand the logic and methods needed to solve each problem, ensuring you grasp the underlying concepts.`,
      color: "text-blue-400",
    },
    {
      title: "Track Your Progress",
      description: `Monitor your progress with our comprehensive tracking tools. See which questions you've completed, track your scores over time, and identify patterns in your performance to help guide your study plan.`,
      color: "text-purple-400",
    },
  ];

  return (
    <div
      id="features"
      className="relative z-10 w-full min-h-screen px-8 pt-24 text-gray-300 md:pt-12"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-screen-lg px-4 mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-green-400 md:mt-16 sm:text-4xl md:text-5xl"
        >
          Why Quantercise?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-lg font-light sm:text-xl md:text-2xl"
        >
          Quantercise offers a unique learning experience designed to help you
          excel in your quant finance interviews with comprehensive practice
          questions and personalized feedback.
        </motion.p>
      </div>
      <div className="relative max-w-screen-lg mx-auto mt-8 text-center">
        <div className="gap-8 md:grid sm:grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto mb-8 overflow-hidden transition-all duration-200 border-2 border-gray-500 rounded-lg md:mb-0 hover:border-gray-300"
          >
            <img
              src={practiceProblemsImage}
              alt="Practice Problems Page"
              className="object-cover w-full h-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto overflow-hidden transition-all duration-200 border-2 border-gray-500 rounded-lg hover:border-gray-300"
          >
            <img
              src={progressImage}
              alt="Progress Page"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
        <div className="grid max-w-screen-lg gap-8 mx-auto mt-8 text-center sm:grid-cols-1 md:grid-cols-3">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative p-6 bg-gray-900 rounded-lg shadow-lg"
            >
              <div className="absolute inset-0 w-full h-full transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg group-hover:-translate-y-1 group-hover:translate-x-1"></div>
              <div className="relative z-10">
                <h3
                  className={`text-xl font-semibold sm:text-2xl ${feature.color}`}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 font-light text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
