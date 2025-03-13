import React, { useState, lazy, Suspense, useMemo, useCallback } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../../contexts/authContext";
import { doSignOut } from "../../../firebase/auth";
import {
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaGithub,
  FaHome,
  FaTasks,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiUnionBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import "../../../index.css";
import { useUser } from "../../../contexts/userContext";
import NewsletterButton from "./NewsletterButton";
// Lazy-loaded components to improve performance
const Waitlist = lazy(() => import("./NewsletterButton"));
const AuthButtons = lazy(() => import("./AuthButtons"));

const Header = ({ onJoinClick }) => {
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { isPro } = useUser();
  const location = useLocation();
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail();
  const [profileOpen, setProfileOpen] = useState(false);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(
    () => [
      { to: "/home", label: "HOME", icon: <FaHome /> },
      { to: "/practice-problems", label: "PRACTICE", icon: <FaTasks /> },
      // { to: "/progress", label: "PROGRESS", icon: <FaChartLine /> },
      ...(isPro
        ? [
            // { to: "/analytics", label: "ANALYTICS", icon: <FaChartLine /> },
            {
              to: "/applications",
              label: "APPLICATIONS",
              icon: <FaChartLine />,
            },
          ]
        : []),
      { to: "/profile", label: "PROFILE", icon: <FaUserCircle /> },
    ],
    [isPro]
  );

  // Memoize landing page links
  const landingPageLinks = useMemo(
    () => [
      // { to: "problems", label: "Problems" },
      { to: "concepts", label: "Concepts" },
      { to: "pricing", label: "Pricing" },
      { to: "landingfooter", label: "Contact" },
    ],
    []
  );

  // Memoize overlay color based on user type (pro or regular)
  const overlayColor = useMemo(() => "bg-green-400", []);

  // Determine if the current page is a landing page
  const isLandingPage =
    location.pathname === "/landing" ||
    location.pathname === "/" ||
    location.pathname === "/newsletter-sign-up";

  const isUnauthorizedPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/reset" ||
    location.pathname === "/404" ||
    location.pathname === "/";

  // Handle profile open/close
  const handleProfileToggle = useCallback(() => {
    setProfileOpen((prev) => !prev);
  }, []);

  // Handle user logout
  const handleLogout = useCallback(() => {
    doSignOut().then(() => navigate("/login"));
    setProfileOpen(false);
  }, [navigate]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 5 }}
      className={`flex fixed top-0 left-0 z-20 justify-between items-center px-4 w-full h-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-4 border-gray-700 shadow-2xl transition-all duration-100 group lg:px-32 xl:hover:border-green-300`}
    >
      {/* Left: Logo */}
      <div className="flex items-center space-x-4">
        <RouterLink
          className="z-10 text-xl font-black tracking-tighter text-green-400 transition duration-100 hover:text-green-200"
          to="/landing"
        >
          Quantercise
        </RouterLink>
      </div>

      {/* Center: Landing Page Links */}
      <div className="hidden xl:flex xl:items-center xl:space-x-8 xl:w-full xl:justify-center xl:pl-[15vw]">
        {isLandingPage &&
          landingPageLinks.map((link) => (
            <ScrollLink
              key={link.to}
              className={`text-xs font-semibold cursor-pointer px-2 py-1 rounded-lg transition-all ${
                activeSection === link.to
                  ? "text-black bg-green-400/75"
                  : "text-gray-400 hover:text-black hover:bg-green-400"
              }`}
              to={link.to}
              smooth={true}
              duration={800}
              spy={true}
              onSetActive={() => setActiveSection(link.to)} // Update active section on view
            >
              {link.label}
            </ScrollLink>
          ))}
      </div>

      {/* Right: Settings Button or Auth Buttons */}
      <div className="flex items-center">
        {isLandingPage || !userLoggedIn ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleLowDetailMode}
              className={`p-2 rounded-lg shadow-lg transition duration-300 flex sm:hidden justify-center items-center ${
                lowDetailMode
                  ? "text-green-400 bg-gray-700 hover:bg-gray-600"
                  : "text-red-400 bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
            </button>
            <Suspense fallback={<div>Loading...</div>}>
              <Waitlist onJoinClick={onJoinClick} />
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.5, ease: "easeIn", delay: 9.5 }}
                className="flex items-center"
              >
                <PiUnionBold className="hidden mb-0 w-8 h-8 text-sm font-extrabold text-gray-400 transition duration-200 sm:block group-hover:text-gray-100" />
              </motion.div>
              <AuthButtons />
            </Suspense>
            <button
              onClick={toggleLowDetailMode}
              className={`p-2 ml-4 rounded-lg hidden shadow-lg transition duration-300 sm:flex justify-center items-center ${
                lowDetailMode
                  ? "text-green-400 bg-gray-700 hover:bg-gray-600"
                  : "text-red-400 bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
        ) : (
          userLoggedIn && (
            <div className="relative z-30">
              <div className="flex items-center space-x-4">
                {isLandingPage && <NewsletterButton />}
                <button
                  className="flex items-center px-4 py-1 text-sm font-bold text-black bg-green-400 rounded-lg border-2 border-green-400 transform group hover:text-green-400 hover:bg-black"
                  onClick={handleProfileToggle}
                >
                  <FaCog className="mr-2 transition-all duration-400 group-hover:rotate-180" />
                  Settings
                </button>
                <button
                  onClick={toggleLowDetailMode}
                  className={`py-2 px-2 ml-2 rounded-lg shadow-lg transition duration-300 flex justify-center items-center ${
                    lowDetailMode
                      ? "text-green-400 bg-gray-700 hover:bg-gray-600"
                      : "text-red-400 bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {lowDetailMode ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex fixed inset-0 z-50 flex-col justify-center items-center w-full h-full ${overlayColor}`}
                  >
                    {/* Re-use logo styling */}
                    <RouterLink
                      className={`z-10 absolute top-3 tracking-tighter left-8 md:left-28 text-xl font-black px-4 py-1 rounded-md transition duration-100 ${
                        isLandingPage
                          ? "text-green-400 hover:text-green-200"
                          : "text-black hover:text-white hover:bg-green-500"
                      }`}
                      to="/landing"
                    >
                      Quantercise
                    </RouterLink>

                    {/* Close button */}
                    <FaTimes
                      className="absolute top-4 right-8 text-black transition-all duration-200 cursor-pointer md:right-32 hover:text-gray-700 hover:scale-105"
                      size={30}
                      onClick={handleProfileToggle}
                    />
                    <div className="absolute top-16 mx-auto w-full border-t-4 border-black"></div>

                    {/* Menu items */}
                    <div className="text-2xl font-black text-black lg:flex lg:items-center lg:gap-2">
                      {menuItems.map((item) => (
                        <RouterLink
                          key={item.to}
                          className={`flex flex-row tracking-wider justify-center w-full px-4 py-2 rounded-md ${
                            location.pathname === item.to
                              ? "bg-green-300 hover:bg-green-200 text-gray-700 hover:text-white"
                              : "hover:bg-green-200 hover:text-white"
                          }`}
                          to={item.to}
                          onClick={handleProfileToggle}
                        >
                          {item.label}
                        </RouterLink>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="mx-auto mt-4 w-3/4 border-t-4 border-gray-700"></div>

                    {/* Toggle Low Detail Mode */}
                    <div className="flex flex-row mt-4 space-x-4">
                      <button
                        className="flex items-center px-4 py-2 text-sm font-bold text-center text-green-400 rounded transition-all duration-200 bg-gray-950 hover:bg-gray-700"
                        onClick={toggleLowDetailMode}
                      >
                        {lowDetailMode ? (
                          <>
                            <FaToggleOn className="mr-2 text-green-400" />
                            <span>Low Detail Mode ON</span>
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="mr-2 text-red-400" />
                            <span>Low Detail Mode OFF</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-bold text-center text-black bg-white rounded transition-all duration-200 hover:bg-gray-300 hover:text-green-400"
                      >
                        Logout
                        <FaSignOutAlt className="ml-2" />
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="mx-auto mt-4 w-3/4 border-t-4 border-gray-700"></div>

                    {/* Social Media Links */}
                    <div className="flex flex-row justify-center mt-8 space-x-4">
                      <a
                        href="https://github.com/anirudhp15"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#181717] rounded-lg p-1 transition-all duration-100 hover:scale-110 hover:bg-green-500"
                      >
                        <FaGithub size={24} />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/quantercise"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#0A66C2] rounded-lg p-1 transition-all duration-100 hover:scale-110 hover:bg-green-500"
                      >
                        <FaLinkedin size={24} />
                      </a>
                      <a
                        href="https://www.youtube.com/channel/UCOgvBdaN7lrWmgbf_wD8zyw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF0000] rounded-lg p-1 transition-all duration-100 hover:scale-110 hover:bg-green-500"
                      >
                        <FaYoutube size={24} />
                      </a>
                      <a
                        href="https://www.instagram.com/quantercise/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#E4405F] rounded-lg p-1 transition-all duration-100 hover:scale-110 hover:bg-green-500"
                      >
                        <FaInstagram size={24} />
                      </a>
                      <a
                        href="https://x.com/quantercise"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#1DA1F2] rounded-lg p-1 transition-all duration-100 hover:scale-110 hover:bg-green-500"
                      >
                        <FaXTwitter size={24} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
