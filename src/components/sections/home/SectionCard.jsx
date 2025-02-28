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
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
      className={`relative group ${columnSpan}`}
    >
      <div
        className={`relative z-10 h-full p-4 transition-all duration-200 transform rounded-lg shadow-lg bg-gray-800 group-hover:bg-gray-900 sm:p-8`}
      >
        <div
          className={`flex text-xl justify-between flex-row lg:items-start ${textColor}`}
        >
          <h2
            className={` font-extrabold  transition-all duration-200 sm:text-2xl group-hover:animate-pulse `}
          >
            {title}
          </h2>
          <div className="flex items-center justify-center lg:text-2xl">
            {icon}
          </div>
        </div>
        <div className="my-2 border-t-2 border-gray-500 lg:my-4"></div>
        <div className="flex flex-row items-center justify-between gap-4 text-xs sm:text-sm lg:text-xl lg:block ">
          <p className="font-light lg:mt-2">{description}</p>
          <Link
            to={link}
            className={`inline-block whitespace-nowrap px-3 lg:px-4 lg:py-2 py-1 lg:mt-4 font-bold hover:${textColor} text-black hover:bg-gray-950  border-2 ${buttonBorderColor} rounded-lg shadow-sm group/link ${bgColor} ${hoverColor}`}
          >
            {buttonText}
            <FaArrowRightLong className="inline-block ml-2 group-hover:scale-110 group-hover:-rotate-45 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:rotate-45 arrow-animation" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionCard;
