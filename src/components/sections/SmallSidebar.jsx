import React, { useState, useContext } from "react";
import {
  FaUserCog,
  FaCog,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaSignOutAlt,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/authContext";
import { SidebarItem } from "./LargeSidebar";
import SidebarContext from "../../contexts/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLowDetail } from "../../contexts/LowDetailContext";
import { doSignOut } from "../../firebase/auth";
import "../../index.css";

const SmallSidebar = ({ children }) => {
  const { currentUser, isPro } = useContext(AuthContext);
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";
  const overlayColor = isPro ? "bg-blue-400" : "bg-green-400";

  return (
    <aside className="relative z-20 lg:hidden">
      {!expanded && (
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className={`p-1.5 rounded-lg bg-black border-2 hover:bg-gray-700 fixed top-4 left-4 z-30 ${colorClass}`}
        >
          <ChevronLast />
        </button>
      )}

      <nav
        className={`fixed inset-0 z-20 flex flex-col h-full bg-black border-r shadow-sm transition-all duration-300 ${colorClass} ${
          expanded ? "w-3/5 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <div className={`text-2xl font-bold ${colorClass}`}>Quantercise</div>
          <button
            onClick={() => setExpanded(false)}
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-700"
          >
            <ChevronFirst />
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2 text-left">{children}</ul>
        </SidebarContext.Provider>

        <div className="mt-auto border-t border-gray-700">
          <div className="flex flex-col items-start w-full p-3">
            <div className="flex items-center w-full">
              {currentUser && currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User"
                  className="w-10 h-10 rounded-lg"
                />
              ) : (
                <FaUserCog className="w-10 h-10 text-gray-400" />
              )}
              <div className="ml-4">
                <h4 className="font-semibold">
                  {currentUser ? currentUser.displayName : "John Doe"}
                </h4>
                <span className="text-xs text-gray-600">
                  {currentUser ? currentUser.email : "johndoe@gmail.com"}
                </span>
              </div>
            </div>
            <Link
              to="/profile"
              className={`w-full px-3 py-2 mt-2 text-sm text-center text-gray-300 bg-gray-800 rounded shadow hover:bg-gray-700`}
            >
              Profile
            </Link>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`w-full px-3 py-2 mt-2 text-sm text-center text-gray-300 rounded shadow ${bgColorClass}`}
            >
              <FaCog className="inline-block mr-2" /> Settings
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-30 flex flex-col items-center justify-center w-full h-full ${overlayColor}`}
          >
            <FaTimes
              className="absolute text-black cursor-pointer top-5 right-[5vw] md:right-[10vw] hover:text-gray-800"
              size={30}
              onClick={() => setSettingsOpen(false)}
            />

            <div className="space-y-2 text-xl font-bold text-black">
              <Link
                to="/home"
                className="flex justify-center w-full px-4 py-2 text-white rounded-lg bg-gray-950 hover:bg-gray-900"
                onClick={() => setSettingsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/practice-problems"
                className="flex justify-center w-full px-4 py-2 text-white rounded-lg bg-gray-950 hover:bg-gray-900"
                onClick={() => setSettingsOpen(false)}
              >
                Practice Problems
              </Link>
              <Link
                to="/progress"
                className="flex justify-center w-full px-4 py-2 text-white rounded-lg bg-gray-950 hover:bg-gray-900"
                onClick={() => setSettingsOpen(false)}
              >
                Progress
              </Link>
              <Link
                to="/performance-analytics"
                className="flex justify-center w-full px-4 py-2 text-white rounded-lg bg-gray-950 hover:bg-gray-900"
                onClick={() => setSettingsOpen(false)}
              >
                Analytics
              </Link>
            </div>
            <div className="w-3/4 mx-auto mt-4 border-t-2 border-gray-700"></div>

            <div className="flex flex-col mt-4 space-y-4">
              <button
                className={`flex items-center px-4 py-2 text-sm font-bold text-center transition-all duration-300 bg-gray-950 rounded-lg hover:bg-gray-700 ${
                  isPro ? "text-blue-400" : "text-green-400"
                }`}
                onClick={toggleLowDetailMode}
              >
                {lowDetailMode ? (
                  <>
                    <FaToggleOn className="mr-2 text-green-400" />
                    <span className="whitespace-nowrap">
                      Low Detail Mode ON
                    </span>
                  </>
                ) : (
                  <>
                    <FaToggleOff className="mr-2 text-red-400" />
                    <span className="whitespace-nowrap">
                      Low Detail Mode OFF
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                  setSettingsOpen(false);
                }}
                className={`flex items-center px-4 py-2 text-sm font-bold text-center transition-all duration-300 bg-white rounded-lg hover:bg-gray-300 ${
                  isPro ? "text-blue-400" : "text-green-400"
                }`}
              >
                Logout
                <FaSignOutAlt className="ml-2" />
              </button>
            </div>
            <div className="w-3/4 mx-auto mt-4 border-t-2 border-gray-700"></div>

            <div className="mt-4 space-x-2">
              <a
                href="https://github.com/anirudhp15"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="https://www.instagram.com/anirudhp15/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export { SmallSidebar };
