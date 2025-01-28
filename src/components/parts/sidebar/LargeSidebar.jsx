import React, { useState, useContext } from "react";
import {
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbHome } from "react-icons/tb";
import { TbProgressCheck } from "react-icons/tb";

import { ChevronLast, ChevronFirst } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doSignOut } from "../../../firebase/auth";
import AuthContext from "../../../contexts/authContext";
import Logo from "../../../assets/images/q.jpeg";
import ProLogo from "../../../assets/images/qpro.jpg";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import "../../../index.css";

const LargeSidebar = ({ expanded, setExpanded }) => {
  const { currentUser, isPro } = useContext(AuthContext);
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";

  const logo = isPro ? ProLogo : Logo;

  const handleSignOut = () => {
    doSignOut().then(() => navigate("/login"));
  };

  const menuItems = [
    { icon: <TbHome />, text: "Home", link: "/home" },
    {
      icon: <RiPlayListAddFill />,
      text: "Problems",
      link: "/practice-problems",
    },
    {
      icon: <TbProgressCheck />,
      text: "Progress",
      link: "/progress",
    },
    { icon: <FaClipboardList />, text: "Applications", link: "/applications" },
    { icon: <FaChartBar />, text: "Analytics", link: "/analytics" },
  ];

  return (
    <aside className="relative z-20 hidden h-screen lg:flex">
      <nav
        className={`flex flex-col h-full bg-black border-r-4 border-gray-500 shadow-md transition-all duration-300 ${
          expanded ? "w-64" : "w-16"
        }`}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {/* <img
              src={logo}
              alt="Logo"
              className={`w-8 h-8 mr-2 ${!expanded && "hidden"}`}
            /> */}
            {expanded && (
              <Link
                to="/landing"
                className={`text-2xl tracking-tighter font-black ${colorClass}`}
              >
                Quantercise
              </Link>
            )}
          </div>
          <button
            onClick={toggleLowDetailMode}
            className={`p-2 rounded-lg shadow-lg transition duration-300 flex justify-center items-center ${
              lowDetailMode
                ? "bg-gray-800 text-green-400 hover:bg-gray-700"
                : "bg-gray-800 text-red-400 hover:bg-gray-700"
            } ${!expanded ? "hidden" : ""}`}
          >
            {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
          </button>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="flex flex-col justify-between h-full px-3 ">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index} className="relative ">
                <Link
                  to={item.link}
                  className={`flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {expanded && (
                    <span className="ml-4 text-sm font-semibold">
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </div>
          <div className={` ${!expanded ? "border-t-2 border-gray-700" : ""}`}>
            <button
              onClick={toggleLowDetailMode}
              className={`p-2 mt-4 rounded-lg shadow-lg transition duration-300 ${
                expanded ? "hidden" : ""
              } flex justify-center items-center ${
                lowDetailMode
                  ? "bg-gray-800 text-green-400 hover:bg-gray-700"
                  : "bg-gray-800 text-red-400 hover:bg-gray-700"
              }`}
            >
              {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
            </button>
            <Link
              to="\settings"
              className={`flex items-center p-2 my-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors `}
            >
              <span className="text-xl">
                <FaCog />
              </span>
              {expanded && (
                <span className="ml-4 text-sm font-semibold">Settings</span>
              )}
            </Link>
          </div>
        </ul>

        {/* User Profile and Sign Out */}
        <div className="mt-auto border-t-2 border-gray-700">
          <div className="flex flex-col items-center p-4">
            {currentUser && (
              <div className="flex items-center w-full">
                <img
                  src={currentUser.photoURL || logo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                {expanded && (
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-gray-300">
                      {currentUser.displayName || "User"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {currentUser.email || "user@domain.com"}
                    </p>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={`flex gap-2 text-black items-center w-full p-2 mt-4 text-sm font-medium text-center whitespace-nowrap rounded-lg shadow ${bgColorClass}`}
            >
              <FaSignOutAlt className="relative z-10 text-black" />
              {expanded ? "Sign Out" : null}
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default LargeSidebar;
