import React, { useState } from "react";
import {
  FaSignOutAlt,
  FaCog,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
  FaChartLine,
  FaUserCircle,
  FaHistory,
  FaPlusCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbHome } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { doSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import Logo from "../../../assets/images/q.jpeg";
import ProLogo from "../../../assets/images/qpro.jpg";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";
import useRecentConversations from "../../../hooks/useRecentConversations";

const SmallSidebar = ({ expanded, setExpanded }) => {
  const { currentUser } = useAuth();
  const { isPro } = useUser();
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch recent conversations
  const { conversations, loading, error } = useRecentConversations(currentUser);

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";

  const logo = isPro ? ProLogo : Logo;

  // Define menu items based on user Pro status
  const menuItems = [
    {
      icon: <TbHome />,
      text: "Home",
      link: "/home",
      isActive: location.pathname === "/home",
    },
    {
      icon: <RiPlayListAddFill />,
      text: "Problems",
      link: "/practice-problems",
      isActive: location.pathname === "/practice-problems",
    },
    ...(isPro
      ? [
          {
            icon: <FaChartLine />,
            text: "Applications",
            link: "/applications",
            isActive: location.pathname === "/applications",
          },
          {
            icon: <FaChartLine />,
            text: "Analytics",
            link: "/analytics",
            isActive: location.pathname === "/analytics",
          },
        ]
      : []),
    {
      icon: <FaUserCircle />,
      text: "Profile",
      link: "/profile",
      isActive:
        location.pathname === "/profile" ||
        location.pathname === "/edit-profile",
    },
  ];

  const handleSignOut = () => {
    doSignOut().then(() => navigate("/login"));
  };

  const handleNewProblem = () => {
    navigate("/practice-problems");
    setExpanded(false);
  };

  return (
    <>
      {/* Backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          expanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full bg-black border-r-4 border-gray-800 shadow-xl">
          {/* Logo and Close */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <Link
              to="/landing"
              className={`text-2xl font-black tracking-tighter truncate ${colorClass} hover:opacity-80 transition-opacity`}
            >
              Quantercise
            </Link>
            <button
              onClick={() => setExpanded(false)}
              className="p-2 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105"
            >
              <FaTimes />
            </button>
          </div>

          {/* New Problem Button */}
          <div className="p-3">
            <button
              onClick={handleNewProblem}
              className={`flex items-center justify-center w-full p-2 rounded-lg transition-all duration-300 ${bgColorClass} text-black font-medium hover:scale-[1.02] shadow-md`}
            >
              <FaPlusCircle className="text-black mr-2" />
              <span>New Problem</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <ul className="flex flex-col justify-between px-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="space-y-2 py-4">
              <div className="px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Main
              </div>
              {menuItems.map((item, index) => (
                <li key={index} className="relative">
                  <Link
                    to={item.link}
                    onClick={() => setExpanded(false)}
                    className={`flex items-center p-2 rounded-lg transition-all duration-200
                    ${
                      item.isActive
                        ? isPro
                          ? "bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/10"
                          : "bg-green-500/20 text-green-400 shadow-sm shadow-green-500/10"
                        : "text-gray-300 hover:bg-gray-800"
                    } hover:scale-[1.02]`}
                  >
                    <span
                      className={`text-xl transition-transform duration-200 ${
                        item.isActive ? "scale-110" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="ml-4 text-sm font-semibold truncate">
                      {item.text}
                    </span>
                  </Link>
                </li>
              ))}

              {/* Recent Chats Section */}
              <div className="mt-6">
                <div className="px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase flex items-center">
                  <FaHistory className="mr-1" /> Recent Chats
                </div>

                {loading ? (
                  // Loading state
                  <div className="flex justify-center items-center py-2">
                    <FaSpinner className="animate-spin text-gray-400" />
                  </div>
                ) : error ? (
                  // Error state
                  <div className="flex items-center py-2 px-2 text-red-400">
                    <FaExclamationCircle className="mr-2" />
                    <span className="text-xs">Error loading</span>
                  </div>
                ) : conversations.length === 0 ? (
                  // Empty state
                  <div className="py-2 px-2 text-gray-500 text-xs">
                    No recent chats
                  </div>
                ) : (
                  // Conversations list
                  <ul className="mt-1 space-y-1">
                    {conversations.map((convo) => (
                      <li key={convo._id}>
                        <Link
                          to={`/practice-problems/${convo.problemId}`}
                          onClick={() => setExpanded(false)}
                          className={`flex items-center p-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:scale-[1.02]`}
                        >
                          <span className="text-xl">
                            <RiPlayListAddFill />
                          </span>
                          <span className="ml-4 text-sm truncate">
                            {convo.problemTitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="py-4">
              <div className="px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Preferences
              </div>
              <button
                onClick={toggleLowDetailMode}
                className={`flex items-center p-2 mt-2 w-full rounded-lg shadow-lg transition-all duration-300 ${
                  lowDetailMode
                    ? "text-green-400 bg-gray-800 hover:bg-gray-700"
                    : "text-red-400 bg-gray-800 hover:bg-gray-700"
                } hover:scale-105`}
              >
                <span className="text-xl">
                  {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
                </span>
                <span className="ml-4 text-sm font-semibold">
                  {lowDetailMode ? "Low Detail On" : "Low Detail Off"}
                </span>
              </button>
            </div>
          </ul>

          {/* User Profile and Sign Out */}
          <div className="mt-auto border-t border-gray-800">
            <div className="px-4 pt-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Account
            </div>
            <div className="flex flex-col items-center p-4">
              {currentUser && (
                <div className="flex items-center w-full mb-3">
                  <div className="relative">
                    <img
                      src={currentUser.photoURL || logo}
                      className="w-8 h-8 rounded-full ring-2 ring-gray-800"
                      alt="User"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="ml-3 min-w-0">
                    <h4 className="text-sm font-bold text-gray-300 truncate">
                      {currentUser.displayName || "User"}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email || "user@domain.com"}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className={`flex gap-2 items-center justify-center p-2 w-full text-sm font-medium text-center text-black whitespace-nowrap rounded-lg shadow transition-all duration-300 ${bgColorClass} hover:scale-[1.02]`}
              >
                <FaSignOutAlt className="relative z-10 text-black" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SmallSidebar;
