import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-8 mt-16 text-gray-300 bg-gray-900 border-t border-gray-700">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-center space-y-4 md:items-start md:space-y-0 md:space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-green-400 transition duration-300 hover:text-green-200"
            >
              Quantercise
            </Link>
            <p className="text-sm text-gray-400">
              Condition your quantitative thinking.
            </p>
          </div>

          <div className="flex mt-6 space-x-6 md:mt-0">
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
          </div>

          <div className="flex mt-6 space-x-6 md:mt-0">
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
          </div>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} Quantercise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
