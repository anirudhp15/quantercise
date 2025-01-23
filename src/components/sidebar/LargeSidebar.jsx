import React, { useState, useContext } from "react";
import {
  FaUserCog,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/authContext";
import SidebarContext from "../../contexts/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLowDetail } from "../../contexts/LowDetailContext";
import { doSignOut } from "../../firebase/auth";
import Logo from "../../assets/images/q.jpeg";
import ProLogo from "../../assets/images/qpro.jpg";
import "../../index.css";
import { FaXTwitter } from "react-icons/fa6";

const LargeSidebar = ({ children, expanded, setExpanded }) => {
  const { currentUser, isPro } = useContext(AuthContext);
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";
  const overlayColor = isPro ? "bg-blue-400" : "bg-green-400";

  const logo = isPro ? ProLogo : Logo;

  return (
    <aside className="relative z-10 hidden h-screen lg:flex">
      <nav
        className={`flex flex-col h-full bg-black border-r shadow-sm transition-all duration-300 ${colorClass}`}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          {/* Add the logo next to the Quantercise text */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={`w-8 h-8 mr-6 ${!expanded ? "hidden" : ""}`}
            />
            <div
              className={`text-2xl font-black ${
                expanded ? colorClass : "hidden"
              }`}
            >
              Quantercise
            </div>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-700"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Logo displayed in collapsed sidebar */}
        {!expanded && (
          <div className="flex flex-col items-center pb-1 mb-1 border-b border-gray-700">
            <img src={logo} alt="Logo" className="w-10 h-10 my-2" />
          </div>
        )}

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2">{children}</ul>
        </SidebarContext.Provider>

        <div className="mt-auto border-t border-gray-700">
          <div
            className={`flex flex-col items-center p-2 w-full transition-all duration-300 ${
              expanded ? "space-y-3" : "space-y-1"
            }`}
          >
            {/* Profile and settings */}
            <div className="relative flex items-center w-full group">
              <Link to="/profile" className="flex items-center justify-center">
                {currentUser && currentUser.photoURL ? (
                  !expanded ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-lg"
                    />
                  ) : null
                ) : expanded ? null : (
                  <FaUserCog className="w-10 h-10 text-gray-400" />
                )}
              </Link>
              {!expanded && (
                <span className="absolute px-2 py-1 ml-2 text-sm text-black transition-opacity duration-300 bg-gray-500 rounded shadow opacity-0 left-full group-hover:opacity-100 group-hover:left-10 group-hover:transform-none whitespace-nowrap">
                  Profile
                </span>
              )}
            </div>
            {expanded && (
              <div className="flex flex-col items-center w-full">
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
                    <h4 className="font-extrabold">
                      {currentUser ? currentUser.displayName : "John Doe"}
                    </h4>
                    <span className="text-xs text-gray-600">
                      {currentUser ? currentUser.email : "johndoe@gmail.com"}
                    </span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="w-full px-3 py-2 mt-2 text-sm text-center text-gray-300 bg-gray-800 rounded shadow hover:bg-gray-700"
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
            )}
          </div>
        </div>
      </nav>
      {/* Settings overlay */}
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
            <div className="space-y-3 text-2xl font-bold text-black">
              <Link
                to="/home"
                className="flex justify-center w-full px-4 py-2 text-white rounded-lg bg-gray-950 hover:bg-gray-900"
                onClick={() => setSettingsOpen(false)}
              >
                Home
              </Link>
              {/* Other settings items */}
            </div>
            <div className="w-3/4 mx-auto mt-4 border-t-2 border-gray-700"></div>
            <div className="mt-4 space-x-2">
              <a
                href="https://x.com/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/quantercise"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-white"
              >
                <FaLinkedin size={24} />
              </a>
              {/* Other social media links */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

const SidebarItem = ({ icon, text, active, alert, link, onClick }) => {
  const { expanded } = useContext(SidebarContext);
  const { isPro } = useContext(AuthContext);

  const colorClass = isPro ? "text-blue-400" : "text-green-400";

  return (
    <Link to={link} className="block" onClick={onClick}>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-green-200 to-green-100 text-green-800"
            : `hover:bg-gray-700 hover:${colorClass} text-gray-300`
        }`}
        style={{ height: "2.5rem" }}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all duration-150 ${
            expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
          }`}
          style={{ transition: "width 0.05s, opacity 0.05s" }}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 z-20 py-1 ml-6 bg-gray-500 ${colorClass} text-md whitespace-nowrap shadow-xl invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};

export { LargeSidebar, SidebarItem };
