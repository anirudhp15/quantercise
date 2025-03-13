import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

const SectionCard = ({
  title,
  icon,
  description,
  buttonText,
  link,
  textColor,
  bgColor,
  hoverColor,
  buttonBorderColor,
  columnSpan,
}) => {
  const isSettings = title === "Profile Settings";
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
      className={`relative group ${columnSpan}`}
    >
      <div
        className={`relative z-10 p-4 h-full sm:p-8 rounded-lg shadow-lg transition-all duration-200 transform group-hover:bg-gray-900 ${
          isSettings ? "bg-gray-900" : "bg-gray-800"
        }`}
      >
        <div
          className={`flex flex-row justify-between text-xl lg:items-start ${textColor}`}
        >
          <h2
            className={`font-extrabold transition-all duration-200 sm:text-2xl group-hover:animate-pulse`}
          >
            {title}
          </h2>
          <div className="flex justify-center items-center p-2 bg-gray-700 rounded-full lg:text-2xl">
            {icon}
          </div>
        </div>
        <div className="my-2 border-t-2 border-gray-500 lg:my-4"></div>
        <div className="flex flex-col gap-4 justify-between items-start text-xs sm:text-sm lg:text-xl">
          <p className="font-light lg:mb-4">{description}</p>
          <Link
            to={link}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${textColor} bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-${buttonBorderColor
              .split("-")
              .pop()} shadow-sm`}
          >
            {buttonText}
            <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionCard;
