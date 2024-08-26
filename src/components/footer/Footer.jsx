import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { motion } from "framer-motion";

const Footer = () => {
  const { isPro } = useAuth();

  // Variants for staggered animation
  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.3, // Stagger the appearance of each child element
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative z-10 py-6 text-gray-300 border-t-4 border-gray-700 shadow-lg bg-gray-950"
    >
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-center space-y-4 md:items-start md:space-y-0 md:space-x-8">
            <motion.div variants={linkVariants}>
              <Link
                to="/landing"
                className={`text-xl font-bold transition duration-300 ${
                  isPro
                    ? "text-blue-400 hover:text-blue-200"
                    : "text-green-400 hover:text-green-200"
                }`}
              >
                Quantercise
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <p className="text-sm text-gray-400">Stay Sharpe.</p>
            </motion.div>
          </div>

          <motion.div
            variants={linkVariants}
            className="flex mt-6 space-x-6 md:mt-0"
          >
            <Link
              to="/home"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/practice-problems"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Practice
            </Link>
            <Link
              to="/progress"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Progress
            </Link>
            <Link
              to="/analytics"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Analytics
            </Link>
            <Link
              to="/profile"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Profile
            </Link>
          </motion.div>

          <motion.div
            variants={linkVariants}
            className="flex mt-6 space-x-6 md:mt-0"
          >
            <a
              href="https://github.com/anirudhp15"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition duration-300 hover:text-white"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/anirudh-pottammal-01b186216/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition duration-300 hover:text-white"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition duration-300 hover:text-white"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://www.instagram.com/anirudhp15/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition duration-300 hover:text-white"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://x.com/quantercise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition duration-300 hover:text-white"
            >
              <FaXTwitter size={24} />
            </a>
          </motion.div>
        </div>

        <motion.div
          variants={linkVariants}
          className="mt-6 text-sm text-center text-gray-500"
        >
          &copy; {new Date().getFullYear()} Quantercise. All rights reserved.
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Footer;
