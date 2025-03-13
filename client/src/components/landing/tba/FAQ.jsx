// src/components/FAQ.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What is Quantercise?",
    answer:
      "Quantercise is a platform designed to help you master your quantitative finance skills through practice questions, detailed feedback, and exclusive resources.",
  },
  {
    question: "How can I sign up?",
    answer:
      "You can sign up by clicking on the 'Sign Up' button at the top of the page and filling in your details on the registration form.",
  },
  {
    question: "What are the pricing plans?",
    answer:
      "We offer a Basic plan for free and a Pro plan for $4.99. The Pro plan includes access to all questions, detailed feedback, unlimited hints, and exclusive resources.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact support by emailing us at info@quantercise.com or through our social media channels on Twitter and Facebook.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative z-10 py-16 text-gray-300">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-screen-xl px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-8">
          {faqData.map((item, index) => (
            <div key={index} className="mb-4 text-left">
              <motion.button
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 font-semibold text-left transition-all duration-200 bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-green-500 hover:ring-green-500 hover:ring-2"
              >
                {item.question}
              </motion.button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 mt-2 text-gray-300 bg-gray-700 rounded-lg">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
