import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const LandingFooter = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="relative bottom-0 z-30 w-full py-8 overflow-y-hidden text-gray-300 border-t border-gray-700 shadow-lg bg-gray-950"
    >
      <div
        id="landingfooter"
        className="flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={footerVariants}
          className="flex flex-col items-center space-y-4 md:items-start md:space-y-0 md:space-x-8"
        >
          <Link
            to="/landing"
            className="text-xl font-bold text-green-400 transition duration-300 hover:text-green-200"
          >
            Quantercise
          </Link>
          <p className="text-sm text-gray-400">
            Condition your quantitative thinking.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={footerVariants}
          className="flex flex-col items-center mt-4 space-y-4 md:items-end md:mt-0 md:space-y-0"
        >
          <div className="flex space-x-4">
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
          </div>
          <div className="flex items-center pt-2 space-x-2">
            <MdOutgoingMail size={20} className="mt-[2px] text-gray-300" />
            <a
              href="mailto:quantercise@gmail.com"
              className="text-sm text-gray-300 transition duration-300 hover:text-white"
            >
              quantercise@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingFooter;
