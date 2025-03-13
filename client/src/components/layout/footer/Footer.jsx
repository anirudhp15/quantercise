import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useUser } from "../../../contexts/userContext";

const Footer = () => {
  const { isPro } = useUser();

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
      <div className="px-4 mx-auto max-w-screen-2xl">
        <div className="flex flex-col justify-between items-center lg:flex-row">
          <div className="flex flex-col items-center space-y-4 lg:items-start lg:space-y-0 lg:space-x-8">
            <motion.div variants={linkVariants}>
              <Link
                to="/landing"
                className={`text-xl font-black tracking-tighter text-green-400 transition duration-300 hover:text-green-200`}
              >
                Quantercise
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <p className="text-sm tracking-wider text-gray-400">
                Stay Sharpe.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={linkVariants}
            className="flex mt-6 space-x-6 lg:mt-0"
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
            {/* <Link
              to="/progress"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Progress
            </Link> */}
            <Link
              to="/analytics"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Analytics
            </Link>
            {isPro && (
              <Link
                to="/applications"
                className="text-sm text-gray-300 transition duration-300 hover:text-white"
              >
                Applications
              </Link>
            )}
            <Link
              to="/profile"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              Profile
            </Link>
          </motion.div>

          <motion.div
            variants={linkVariants}
            className="flex mt-6 space-x-6 lg:mt-0"
          >
            <a
              href="https://github.com/anirudhp15"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#181717] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/anirudh-pottammal-01b186216/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A66C2] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF0000] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://www.instagram.com/quantercise/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E4405F] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://x.com/quantercise"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1DA1F2] hover:bg-white rounded-lg p-1 transition-all duration-100 hover:scale-110"
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
