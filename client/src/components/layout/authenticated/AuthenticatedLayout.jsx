import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LargeSidebar from "../sidebar/LargeSidebar";
import SmallSidebar from "../sidebar/SmallSidebar";
import Footer from "../footer/Footer";
import { AnimatePresence } from "framer-motion";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import AnimatedGrid from "../../landing/animatedGrid/AnimatedGrid";
import { useUser } from "../../../contexts/userContext";

const AuthenticatedLayout = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const location = useLocation();
  const { lowDetailMode } = useLowDetail();
  const { isPro } = useUser();

  // Handle window resize to toggle between mobile and desktop layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setExpanded(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check if the footer should be shown
  const showFooter =
    location.pathname !== "/applications" &&
    location.pathname !== "/home" &&
    location.pathname !== "/practice-problems" &&
    location.pathname !== "/profile" &&
    location.pathname !== "/edit-profile" &&
    location.pathname !== "/analytics" &&
    location.pathname !== "/landing" &&
    location.pathname !== "/";

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Animated background for non-low-detail mode */}
      {!lowDetailMode && <AnimatedGrid />}

      <div className="flex flex-grow">
        {/* Desktop sidebar (hidden on mobile) */}
        <LargeSidebar expanded={expanded} setExpanded={setExpanded} />

        {/* Mobile sidebar (only shown when toggled) */}
        <AnimatePresence>
          {showMobileSidebar && (
            <SmallSidebar
              expanded={showMobileSidebar}
              setExpanded={setShowMobileSidebar}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <div
          className={`flex relative flex-col flex-grow ${
            expanded && !isMobile ? "lg:ml-64" : "lg:ml-16"
          } transition-all duration-300`}
        >
          {/* Mobile Header Bar with Menu Toggle */}
          {isMobile && (
            <div className="flex sticky top-0 z-10 justify-between items-center px-4 h-16 border-b-4 border-gray-800 shadow-lg backdrop-blur-sm bg-black/95">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 text-gray-300 rounded-lg transition-colors hover:text-white hover:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div
                className={`text-xl font-black tracking-tighter ${
                  isPro ? "text-blue-400" : "text-green-400"
                }`}
              >
                Quantercise
              </div>
              <div className="w-10" /> {/* Spacer for centering logo */}
            </div>
          )}

          {/* Page Content with proper spacing */}
          <div className="flex-grow">{children}</div>

          {/* Footer (conditional) */}
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
