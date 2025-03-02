import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/authContext";
import { useUser } from "../../../../contexts/userContext";
import { useLowDetail } from "../../../../contexts/LowDetailContext";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { Link, useNavigate } from "react-router-dom";
import { SiOpentofu } from "react-icons/si";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { VscEdit } from "react-icons/vsc";
import "../../../../index.css";
import axios from "axios";
import { set } from "mongoose";

const Profile = () => {
  const { currentUser } = useAuth();
  const {
    profileColor,
    setProfileColor,
    isPro,
    setIsPro,
    currentPlan,
    setCurrentPlan,
  } = useUser();
  const { lowDetailMode } = useLowDetail(); // Access the Low Detail Mode
  const navigate = useNavigate();

  // Set the selected color to the current profileColor initially
  const [selectedColor, setSelectedColor] = useState(profileColor);

  useEffect(() => {
    // Sync selectedColor with profileColor
    setSelectedColor(profileColor);
  }, [profileColor]);

  // Handle color selection
  const handleColorSelection = async (color) => {
    setSelectedColor(color); // Update locally
    await setProfileColor(color); // Update in the context and backend
  };

  const handleUpgradePlan = () => {
    // Redirect to plan selection or handle Stripe checkout
    console.log("Redirecting to plan upgrade...");
    navigate("/plan-selection");
  };

  const handleCancelMembership = async () => {
    try {
      await axios.post(`/api/user/${currentUser.uid}/cancel-membership`);
      setCurrentPlan(null); // Set to free plan after cancellation
      setIsPro(null); // Set to free plan after cancellation
      console.log("Membership canceled successfully!");
    } catch (error) {
      console.error("Failed to cancel membership:", error);
    }
  };

  const colorOptions = [
    "#6B7280",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#34D399",
    "#FCD34D",
    "#F87171",
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-screen-xl mx-auto text-gray-300">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="relative z-10 flex flex-col justify-center max-w-screen-xl min-h-screen px-4 py-24 mx-auto xl:px-0">
        {/* Back Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex justify-start"
        >
          <Link
            to="/home"
            className={`flex w-min items-center px-2 py-1 text-sm font-semibold border-2 rounded-lg group text-black hover:text-green-400 border-green-400 bg-green-400 hover:bg-black
            `}
          >
            <FaArrowLeftLong className="mr-2 transition-all duration-200 group-hover:-translate-x-1" />{" "}
            Home
          </Link>
        </motion.div>
        {/* Profile Title */}
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-4xl py-4 max-w-screen-xl w-full text-left mx-auto font-black text-green-400`}
        >
          Your Profile
        </motion.h1>

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="p-8 transition-all duration-200 rounded-lg shadow-lg lg:p-16 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-gray-500"
        >
          <div className="flex flex-col items-center space-y-6 md:flex-row md:space-x-6 md:space-y-0">
            {/* User Image */}
            <div className="relative rounded-lg">
              <div>
                <SiOpentofu
                  className="w-32 h-32 p-4 mb-4 text-white rounded-full outline outline-4 outline-gray-100 lg:mb-8"
                  style={{ backgroundColor: selectedColor || "#6B7280" }}
                />
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelection(color)}
                      style={{
                        backgroundColor: color,
                        border:
                          selectedColor === color ? "4px solid white" : "none",
                      }}
                      className="w-4 h-4 rounded-full"
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div
              style={{ borderColor: selectedColor || "#6B7280" }}
              className="flex flex-col justify-center w-full pl-4 space-y-4 border-l-4 rounded-md lg:space-y-0 lg:space-x-4 lg:flex-row sm:justify-start"
            >
              <div className="font-semibold text-left">
                <strong className="font-normal text-gray-400">Name</strong>{" "}
                <div className="p-2 mt-1 mb-4 rounded-lg shadow-lg bg-gradient-to-r from-gray-900 to-black">
                  <p className="text-lg ">{currentUser.displayName || "N/A"}</p>
                </div>
                <strong className="font-normal text-gray-400">Email</strong>{" "}
                <div className="p-2 mt-1 rounded-lg shadow-lg bg-gradient-to-r from-gray-900 to-black">
                  <p className="text-lg">{currentUser.email}</p>
                </div>
                <Link
                  to="/edit-profile"
                  style={{
                    backgroundColor: selectedColor || "#6B7280",
                    borderColor: selectedColor || "#6B7280",
                  }}
                  className={`flex mt-6 group w-min whitespace-nowrap flex-row px-3 py-1 font-bold text-black border-2 rounded-lg shadow-lg bg-green-400 hover:bg-black border-green-400 hover:text-gray-100
                  `}
                >
                  Edit Profile
                  <VscEdit className="w-5 h-5 mt-[2px] ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                </Link>
              </div>
              <div className="w-full">
                <strong className="font-normal text-gray-400">
                  Member Status
                </strong>
                <div className="w-full p-4 mt-1 rounded-lg shadow-lg bg-gradient-to-r from-gray-900 to-black">
                  <div className="flex flex-col sm:items-center sm:flex-row">
                    <p
                      className={`text-xl flex tracking-tighter items-center font-bold ${
                        isPro === null
                          ? "text-gray-300"
                          : isPro === false
                          ? "text-green-400"
                          : "text-blue-400"
                      }`}
                    >
                      {isPro === null
                        ? "FREE MEMBER"
                        : isPro === false
                        ? "SHARPE MEMBER"
                        : "PRO MEMBER"}
                    </p>
                    <div className="mt-2 sm:flex sm:gap-2 sm:ml-auto sm:mt-0">
                      {isPro !== true && (
                        <Link
                          onClick={handleUpgradePlan}
                          to="/plan-selection"
                          className="px-3 py-1 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600"
                        >
                          Upgrade Plan
                        </Link>
                      )}
                      {isPro !== null && (
                        <button
                          onClick={handleCancelMembership}
                          className="px-3 py-1 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                        >
                          Cancel Membership
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="my-2 border-t-2 border-gray-500"></div>
                  <strong className="font-normal text-gray-400">
                    Member Since:
                  </strong>{" "}
                  <div className="p-2 mt-1 mb-4 font-semibold rounded-lg shadow-lg bg-gradient-to-r from-gray-600 to-gray-700">
                    <p className="text-lg">
                      {currentUser?.metadata?.creationTime
                        ? new Date(
                            currentUser.metadata.creationTime
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <strong className="font-normal text-gray-400">
                    Last Login:
                  </strong>{" "}
                  <p className="p-2 mt-1 mb-2 text-lg font-semibold rounded-lg shadow-lg bg-gradient-to-r from-gray-600 to-gray-700">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
