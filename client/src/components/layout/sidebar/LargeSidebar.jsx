import React from "react";
import {
  FaSignOutAlt,
  FaToggleOn,
  FaToggleOff,
  FaUserCircle,
  FaHistory,
  FaPlusCircle,
  FaSpinner,
  FaExclamationCircle,
  FaChartPie,
  FaFileContract,
} from "react-icons/fa";
import { MdDashboard, MdMarkChatRead, MdMarkChatUnread } from "react-icons/md";
import {
  TbLayoutSidebarRightExpandFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { SiOpentofu } from "react-icons/si";
import { RiPlayListAddFill } from "react-icons/ri";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import Logo from "../../../assets/images/q.jpeg";
import ProLogo from "../../../assets/images/qpro.jpg";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";
import useRecentConversations from "../../../hooks/useRecentConversations";

const LargeSidebar = ({ expanded, setExpanded }) => {
  const { currentUser } = useAuth();
  const { isPro, profileColor } = useUser();
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

  const handleSignOut = () => {
    doSignOut().then(() => navigate("/login"));
  };

  const handleNewProblem = () => {
    navigate("/practice-problems");
  };

  // Define menu items based on user Pro status
  const menuItems = [
    {
      icon: <MdDashboard />,
      text: "Home",
      link: "/home",
      isActive: location.pathname === "/home",
    },
    {
      icon: <SiOpentofu />,
      text: "Practice",
      link: "/practice-problems",
      isActive: location.pathname === "/practice-problems",
    },
    ...(isPro
      ? [
          {
            icon: <FaFileContract />,
            text: "Applications",
            link: "/applications",
            isActive: location.pathname === "/applications",
          },
          {
            icon: <FaChartPie />,
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

  return (
    <aside className="hidden fixed left-0 z-20 h-screen lg:flex">
      <nav
        className={`relative flex flex-col bg-black border-r-4 border-gray-800 shadow-md transition-all duration-300 ${
          expanded ? "w-64" : "w-16"
        }`}
      >
        {/* Header with Toggle and Low Detail Mode Button */}
        <div className="flex justify-between items-center p-3 border-b border-gray-800">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 text-green-400 rounded-lg transition-all duration-50 hover:bg-gray-700 hover:scale-105"
          >
            {expanded ? <GoSidebarExpand /> : <GoSidebarCollapse />}
          </button>
          <button
            onClick={toggleLowDetailMode}
            className={`p-2 rounded-lg shadow-lg transition-all duration-50 flex justify-center items-center ${
              !expanded ? "hidden" : ""
            } ${
              lowDetailMode
                ? "text-green-400 hover:bg-gray-700"
                : "text-red-400 hover:bg-gray-700"
            } hover:scale-105`}
          >
            {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
          </button>
        </div>

        {/* Fixed "Quantercise" Label on the Right Side */}
        <div className="absolute top-4 -right-[9.5rem] pl-2">
          <Link
            to="/home"
            className="text-2xl font-black tracking-tighter text-green-400 hover:text-green-500"
          >
            Quantercise
          </Link>
        </div>

        {/* Navigation Menu (non-scrollable) */}
        <ul className="flex flex-col justify-start px-3 mt-4">
          <button
            onClick={handleNewProblem}
            className={`flex items-center justify-center w-full p-2 rounded-lg transition-all duration-50 ${bgColorClass} text-black whitespace-nowrap font-medium hover:scale-[1.02] shadow-md`}
          >
            <MdMarkChatRead className="text-xl text-black" />
            {expanded && (
              <span className="ml-2 font-semibold">New Problem</span>
            )}
          </button>
          <div className="py-4 space-y-2">
            {expanded && (
              <div className="px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Main
              </div>
            )}
            {menuItems.map((item, index) => (
              <li key={index} className="relative">
                <Link
                  to={item.link}
                  className={`flex items-center p-2 rounded-lg transition-all duration-50
                    ${
                      item.isActive
                        ? isPro
                          ? "bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/10"
                          : "bg-green-500/20 text-green-400 shadow-sm shadow-green-500/10"
                        : "text-gray-300 hover:bg-gray-800"
                    } hover:scale-[1.02]`}
                >
                  <span
                    className={`text-xl whitespace-nowrap transition-transform duration-200 ${
                      item.isActive ? "scale-110" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {expanded && (
                    <span className="ml-4 text-sm font-semibold truncate">
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            ))}

            {/* Recent Problems Section with Its Own Scrollable Container */}
            <div className={`mt-6 ${!expanded ? "hidden" : ""}`}>
              {expanded ? (
                <div className="flex items-center px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Recent Problems <FaHistory className="ml-1" />
                </div>
              ) : (
                <div className="flex justify-center items-center px-2 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  <FaHistory />
                </div>
              )}

              {/* Wrap the conversation list so that only this area scrolls */}
              <div className="overflow-y-auto max-h-80 hide-scrollbar">
                {loading ? (
                  <div
                    className={`flex justify-center items-center py-2 ${
                      expanded ? "text-left" : "text-center"
                    }`}
                  >
                    <FaSpinner className="text-gray-400 animate-spin" />
                  </div>
                ) : error ? (
                  <div
                    className={`flex items-center py-2 text-red-400 ${
                      expanded ? "px-2" : "justify-center"
                    }`}
                  >
                    <FaExclamationCircle className={expanded ? "mr-2" : ""} />
                    {expanded && <span className="text-xs">Error loading</span>}
                  </div>
                ) : conversations.length === 0 ? (
                  <div
                    className={`py-2 text-gray-500 ${
                      expanded ? "px-2 text-xs" : "text-center"
                    }`}
                  >
                    {expanded ? "No recent problems" : "—"}
                  </div>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {conversations.map((convo) => (
                      <li key={convo._id}>
                        <Link
                          to={`/practice-problems/${convo.questionId}`}
                          className={`flex items-center p-2 rounded-lg transition-all duration-50 text-gray-300 hover:bg-gray-800 hover:scale-[1.02]`}
                        >
                          <span className="text-xl">
                            <MdMarkChatUnread />
                          </span>
                          {expanded && (
                            <div className="flex flex-col">
                              <span className="ml-4 text-xs font-semibold truncate">
                                {convo.questionTitle}
                              </span>
                              <span className="ml-4 text-xs font-light text-gray-500">
                                {new Date(convo.updatedAt).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          {/* <div
            className={`py-2 ${!expanded ? "border-t border-gray-800" : ""}`}
          >
            <button
              onClick={toggleLowDetailMode}
              className={`p-2 mt-2 rounded-lg shadow-lg transition-all duration-300 ${
                expanded ? "hidden" : ""
              } flex justify-center items-center ${
                lowDetailMode
                  ? "text-green-400 bg-gray-800 hover:bg-gray-700"
                  : "text-red-400 bg-gray-800 hover:bg-gray-700"
              } hover:scale-105 w-full`}
            >
              {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div> */}
        </ul>

        {/* User Profile and Sign Out */}
        <div className="mt-auto border-t border-gray-800">
          {expanded && (
            <div className="px-4 pt-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Account
            </div>
          )}
          <div className="flex flex-col items-center p-3">
            {currentUser && (
              <div className="flex items-center mb-3 w-full">
                <div className="relative">
                  {currentUser?.photoURL ? (
                    <img
                      alt="Profile photo"
                      src={currentUser.photoURL}
                      className="w-8 h-8 rounded-full shadow-lg"
                      style={{
                        border: `4px solid ${profileColor}`,
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <div
                      className="flex justify-center items-center w-8 h-8 rounded-full shadow-lg"
                      style={{ backgroundColor: profileColor || "#6B7280" }}
                    >
                      <SiOpentofu className="text-xl text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                {expanded && (
                  <div className="ml-3 min-w-0">
                    <h4 className="text-sm font-bold text-gray-300 truncate">
                      {currentUser.displayName || "User"}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email || "user@domain.com"}
                    </p>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={`flex gap-2 items-center justify-center p-2 w-full font-medium text-center text-black whitespace-nowrap rounded-lg shadow transition-all duration-300 ${bgColorClass} hover:scale-[1.02]`}
            >
              <FaSignOutAlt className="relative z-10 text-xl text-black" />
              {expanded ? "Sign Out" : null}
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default LargeSidebar;
