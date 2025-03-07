import React, { useState, useContext } from "react";
import {
  FaClipboardList,
  FaSignOutAlt,
  FaCog,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
} from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbHome } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doSignOut } from "../../../firebase/auth";
import AuthContext from "../../../contexts/authContext";
import Logo from "../../../assets/images/q.jpeg";
import ProLogo from "../../../assets/images/qpro.jpg";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";

const SmallSidebar = ({ expanded, setExpanded }) => {
  const { currentUser } = useContext(AuthContext);
  const { isPro } = useUser();
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";

  const logo = isPro ? ProLogo : Logo;

  const menuItems = [
    { icon: <TbHome />, text: "Home", link: "/home" },
    {
      icon: <RiPlayListAddFill />,
      text: "Problems",
      link: "/practice-problems",
    },
    { icon: <FaClipboardList />, text: "Applications", link: "/applications" },
  ];

  const handleSignOut = () => {
    doSignOut().then(() => navigate("/login"));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setExpanded(false)}
      />

      {/* Sidebar */}
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-[85vw] max-w-[300px] h-full bg-black border-r-4 border-gray-500 shadow-lg flex flex-col"
      >
        {/* Header with logo and close button */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-700">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="mr-2 w-8 h-8" />
            <Link
              to="/landing"
              className={`text-xl font-black tracking-tighter ${colorClass}`}
            >
              Quantercise
            </Link>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="p-2 text-gray-400 rounded-lg transition-colors hover:text-white hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="overflow-y-auto flex-1 py-2">
          <div className="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Main Navigation
          </div>
          <ul className="px-3 space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="flex items-center p-3 text-gray-300 rounded-lg transition-colors hover:bg-gray-700"
                  onClick={() => setExpanded(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="ml-4 text-sm font-semibold">
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 py-2 mt-6 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Preferences
          </div>
          <ul className="px-3 space-y-1">
            <li>
              <button
                onClick={toggleLowDetailMode}
                className="flex items-center p-3 w-full text-gray-300 rounded-lg transition-colors hover:bg-gray-700"
              >
                <span className="text-xl">
                  {lowDetailMode ? (
                    <FaToggleOn className="text-green-400" />
                  ) : (
                    <FaToggleOff className="text-red-400" />
                  )}
                </span>
                <span className="ml-4 text-sm font-semibold">
                  {lowDetailMode
                    ? "Low Detail Mode: On"
                    : "Low Detail Mode: Off"}
                </span>
              </button>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center p-3 text-gray-300 rounded-lg transition-colors hover:bg-gray-700"
                onClick={() => setExpanded(false)}
              >
                <span className="text-xl">
                  <FaCog />
                </span>
                <span className="ml-4 text-sm font-semibold">Settings</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* User Profile and Sign Out */}
        <div className="p-4 border-t-2 border-gray-700">
          <div className="px-1 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Account
          </div>
          {currentUser && (
            <div className="flex items-center mt-2 mb-4">
              <img
                src={currentUser.photoURL || logo}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <h4 className="text-sm font-bold text-gray-300">
                  {currentUser.displayName || "User"}
                </h4>
                <p className="text-xs text-gray-500">
                  {currentUser.email || "user@domain.com"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`flex gap-2 justify-center items-center p-3 w-full font-medium text-black rounded-lg shadow ${bgColorClass}`}
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </motion.nav>
    </div>
  );
};

export default SmallSidebar;
