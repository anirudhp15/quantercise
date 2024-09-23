import React, { useState, lazy, Suspense } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import {
  FaHome,
  FaTasks,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaCog,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { PiUnionBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useLowDetail } from "../../contexts/LowDetailContext"; // Import the context
import "../../index.css";

// Lazy load components to optimize performance
const Waitlist = lazy(() => import("./Waitlist"));
const AuthButtons = lazy(() => import("./AuthButtons"));

const Header = ({ onJoinClick }) => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser, isPro } = useAuth(); // Access isPro from useAuth
  const location = useLocation();
  const { lowDetailMode, toggleLowDetailMode } = useLowDetail(); // Access the context
  const [profileOpen, setProfileOpen] = useState(false);

  // Define menu items
  const menuItems = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/practice-problems", label: "Practice", icon: <FaTasks /> },
    { to: "/progress", label: "Progress", icon: <FaChartLine /> },
    { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
    { to: "/applications", label: "Applications", icon: <FaChartLine /> },
    { to: "/profile", label: "Profile", icon: <FaUserCircle /> },
  ];

  const landingPageLinks = [
    { to: "concepts", label: "Concepts" },
    { to: "pricing", label: "Pricing" },
    { to: "landingfooter", label: "Contact" },
  ];

  const overlayColor = isPro ? "bg-blue-400" : "bg-green-400";

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 5 }}
        className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 border-b-4 border-gray-700 shadow-2xl md:px-32 bg-gray-950"
      >
        <div className="flex items-center space-x-4">
          <RouterLink
            className={`z-10 text-xl font-bold transition duration-300 ${
              location.pathname === "/landing" || location.pathname === "/"
                ? "text-green-400 hover:text-green-200"
                : isPro
                ? "text-blue-400 hover:text-blue-200"
                : "text-green-400 hover:text-green-200"
            }`}
            to="/landing"
          >
            Quantercise
          </RouterLink>
        </div>

        <div className="hidden xl:flex xl:items-center xl:space-x-6 xl:w-full xl:justify-center xl:pl-[15vw]">
          {(location.pathname === "/landing" || location.pathname === "/") &&
            landingPageLinks.map((link) => (
              <ScrollLink
                key={link.to}
                className={`text-sm font-semibold cursor-pointer transition duration-300 ${
                  location.hash === `#${link.to}`
                    ? "text-white"
                    : "text-gray-300 hover:text-gray-100"
                }`}
                to={link.to}
                smooth={true}
                duration={800}
              >
                {link.label}
              </ScrollLink>
            ))}
        </div>

        <div className="flex items-center">
          {userLoggedIn &&
          location.pathname !== "/landing" &&
          location.pathname !== "/" ? (
            <div className="relative z-30">
              <button
                className={`group flex rounded-lg hover:scale-105 items-center px-4 py-1 text-sm font-bold transition-all duration-200 transform border-2 ${
                  isPro
                    ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                } `}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <FaCog className="mr-2 transition-all duration-400 group-hover:rotate-180" />
                Settings
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full ${overlayColor}`}
                  >
                    <FaTimes
                      className="absolute text-black cursor-pointer top-5 right-[5vw] md:right-[10vw] hover:text-gray-800"
                      size={30}
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="space-y-3 text-2xl font-bold text-black">
                      {menuItems.map((item) => (
                        <RouterLink
                          key={item.to}
                          className={`flex flex-row justify-center w-full px-4 py-2 transition duration-300 rounded-md ${
                            location.pathname === item.to
                              ? "bg-gray-900 text-white"
                              : "hover:bg-gray-950 hover:text-white"
                          }`}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                        >
                          <span>{item.label}</span>
                        </RouterLink>
                      ))}
                    </div>
                    <div className="w-3/4 mx-auto mt-4 border-t-2 border-gray-700"></div>

                    {/* Toggle Low Detail Mode inside settings */}
                    <div className="flex flex-row mt-4 space-x-4">
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
                          setProfileOpen(false);
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
            </div>
          ) : (
            <div className="flex items-center">
              <div className="hidden space-x-4 lg:flex">
                <Suspense fallback={<div>Loading...</div>}>
                  <Waitlist onJoinClick={onJoinClick} />
                  <motion.div
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0 0 0)" }}
                    transition={{ duration: 1.5, ease: "easeIn", delay: 9.5 }}
                    className="flex items-center"
                  >
                    <PiUnionBold className="w-8 h-8 mb-0 text-sm font-extrabold text-gray-300" />
                  </motion.div>
                  <AuthButtons />
                </Suspense>
              </div>
              {(location.pathname === "/landing" ||
                location.pathname === "/") && (
                <div className="flex lg:hidden">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Waitlist onJoinClick={onJoinClick} />
                  </Suspense>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Header;
