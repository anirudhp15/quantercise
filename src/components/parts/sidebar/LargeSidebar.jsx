import React, { useState, useContext } from "react";
import {
  FaHome,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../../../contexts/authContext";
import Logo from "../../../assets/images/q.jpeg";
import ProLogo from "../../../assets/images/qpro.jpg";
import "../../../index.css";

const LargeSidebar = ({ expanded, setExpanded }) => {
  const { currentUser, isPro } = useContext(AuthContext);
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";

  const logo = isPro ? ProLogo : Logo;

  const handleSignOut = () => {
    // Implement sign-out logic
    navigate("/login");
  };

  const menuItems = [
    { icon: <FaHome />, text: "Home", link: "/home" },
    { icon: <FaClipboardList />, text: "Applications", link: "/applications" },
    { icon: <FaChartBar />, text: "Analytics", link: "/analytics" },
    { icon: <FaCog />, text: "Settings", link: "/settings" },
  ];

  return (
    <aside className="relative z-10 hidden h-screen lg:flex">
      <nav
        className={`flex flex-col h-full bg-black border-r-2 border-gray-400 shadow-md transition-all duration-300 ${
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
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="flex-1 px-3 space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
              <Link
                to={item.link}
                className={`flex items-center py-2 px-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors `}
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
        </ul>

        {/* User Profile and Sign Out */}
        <div className="mt-auto border-t-2 border-gray-700">
          <div className="flex flex-col items-center p-4">
            {currentUser && (
              <div className="flex items-center w-full">
                <img
                  src={currentUser.photoURL || logo}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
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
              className={`flex text-black items-center w-full px-3 py-2 mt-4 text-sm font-medium text-center rounded-lg shadow ${bgColorClass}`}
            >
              <FaSignOutAlt className="mr-2" />
              {expanded ? "Sign Out" : null}
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default LargeSidebar;
