import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import {
  FaUser,
  FaHome,
  FaTasks,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../index.css";
import Waitlist from "./Waitlist";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn, isPro } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsHover, setSettingsHover] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (profileOpen) {
      timeoutId = setTimeout(() => {
        setProfileOpen(false);
      }, 30000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [profileOpen]);

  const menuItems = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/practice-problems", label: "Practice", icon: <FaTasks /> },
    { to: "/progress", label: "Progress", icon: <FaChartLine /> },
    { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
    { to: "/profile", label: "Profile", icon: <FaUserCircle /> },
  ];

  const landingPageLinks = [
    { to: "concepts", label: "Concepts" },
    { to: "pricing", label: "Pricing" },
    { to: "landingfooter", label: "Contact" },
  ];

  return (
    <>
      {profileOpen && <div className="overlay"></div>} {/* Overlay */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 border-b border-gray-700 shadow-2xl md:px-32 bg-gray-950"
      >
        <div className="flex items-center space-x-4">
          <RouterLink
            className={`z-10 text-xl font-bold transition duration-300 ${
              location.pathname === "/landing"
                ? "text-green-400 hover:text-green-300"
                : isPro
                ? "text-blue-400 hover:text-blue-300"
                : "text-green-400 hover:text-green-300"
            }`}
            to="/landing"
          >
            Quantercise
          </RouterLink>
        </div>

        {location.pathname === "/landing" && (
          <div className="hidden md:flex md:items-center md:justify-center md:space-x-6">
            {landingPageLinks.map((link) => (
              <ScrollLink
                key={link.to}
                className="text-sm font-semibold text-gray-300 cursor-pointer hover:text-gray-100"
                to={link.to}
                smooth={true}
                duration={800}
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
        )}

        <div className="flex items-center">
          {userLoggedIn && location.pathname !== "/landing" ? (
            <div
              className="relative z-30"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                className={`flex items-center px-3 py-1 text-sm font-bold transition-all duration-200 transform border-2 ${
                  isPro
                    ? "border-blue-400 text-blue-400"
                    : "border-green-400 text-green-400"
                } ${
                  profileOpen || settingsHover
                    ? "rounded-t-lg border-b-0 shadow-2xl border-gray-200 bg-white text-blue-950 "
                    : "rounded-lg"
                }`}
                onMouseEnter={() => setSettingsHover(true)}
                onMouseLeave={() => setSettingsHover(false)}
              >
                <FaUser className="mr-2" />
                Settings
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="absolute right-0 z-30 w-full bg-gray-800 border-2 border-white rounded-b-lg shadow-lg"
                    onMouseEnter={() => setSettingsHover(true)}
                    onMouseLeave={() => setSettingsHover(false)}
                  >
                    {menuItems.map((item) => (
                      <RouterLink
                        key={item.to}
                        className={`block w-full px-4 py-2 text-sm font-semibold text-center transition duration-300 border-b border-white hover:bg-gray-600 hover:text-white ${
                          location.pathname === item.to
                            ? "bg-gray-700 text-white"
                            : "text-gray-300"
                        }`}
                        to={item.to}
                        onClick={() => setProfileOpen(false)}
                      >
                        {item.label}
                      </RouterLink>
                    ))}
                    <button
                      onClick={() => {
                        doSignOut().then(() => {
                          navigate("/login");
                        });
                        setProfileOpen(false);
                      }}
                      className="flex flex-row w-full px-4 py-2 text-sm font-bold text-center text-gray-600 transition-all duration-300 border-2 border-gray-600 border-opacity-0 rounded-b-lg hover:bg-gray-600 hover:text-red-500 hover:border-opacity-100"
                    >
                      Logout
                      <FaSignOutAlt className="mt-[3px] ml-2" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Waitlist />
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Header;
