import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-700 mt-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <Link
              to="/"
              className="text-xl text-green-400 font-bold hover:text-green-200 transition duration-300"
            >
              Quantercise
            </Link>
            <p className="text-sm text-gray-400">
              Enhance your quantitative finance skills with us.
            </p>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link
              to="/home"
              className="text-sm text-gray-300 hover:text-white transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/practice-problems"
              className="text-sm text-gray-300 hover:text-white transition duration-300"
            >
              Practice
            </Link>
            <Link
              to="/resources"
              className="text-sm text-gray-300 hover:text-white transition duration-300"
            >
              Resources
            </Link>
            <Link
              to="/events"
              className="text-sm text-gray-300 hover:text-white transition duration-300"
            >
              Events
            </Link>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0">
            <a
              href="https://github.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://twitter.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} Quantercise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
