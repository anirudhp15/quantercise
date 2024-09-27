import React from "react";
import { useAuth } from "../../contexts/authContext";
import { useLowDetail } from "../../contexts/LowDetailContext";
import AnimatedGrid2 from "../landing/AnimatedGrid2";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { VscEdit } from "react-icons/vsc";
import "../../index.css";

const Profile = () => {
  const { currentUser, isPro } = useAuth();
  const { lowDetailMode } = useLowDetail(); // Access the Low Detail Mode

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative px-12 py-16 text-gray-300">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="relative z-10 max-w-screen-lg mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`pt-6 text-4xl font-black ${
            isPro ? "text-blue-400" : "text-green-400"
          }`}
        >
          Profile
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex justify-start py-4"
        >
          <Link
            to="/home"
            className={`flex items-center px-2 py-1 text-sm font-semibold group border-2 rounded-lg group hover:text-black ${
              isPro
                ? "text-blue-400 border-blue-400 hover:bg-blue-400"
                : "text-green-400 border-green-400 hover:bg-green-400"
            }`}
          >
            <FaArrowLeftLong className="mr-2 transition-all duration-200 group-hover:-translate-x-1" />{" "}
            Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="p-8 transition-all duration-200 border-2 border-gray-700 rounded-lg shadow-lg bg-gray-950 hover:border-gray-500"
        >
          <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="relative border-2 border-gray-600 rounded-lg ">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="object-cover w-32 h-32 border-2 border-gray-700 rounded-lg hover:border-gray-500"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-600" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-light">
                <strong className="font-bold">Name:</strong>{" "}
                {currentUser.displayName || "N/A"}
              </p>
              <p className="mt-2 text-lg text-light">
                <strong className="text-bold">Email:</strong>{" "}
                {currentUser.email}
              </p>
              <p className="mt-2 text-lg text-light">
                <strong className="text-bold">Member Since:</strong>{" "}
                {new Date(
                  currentUser.metadata.creationTime
                ).toLocaleDateString()}
              </p>
              <p
                className={`mt-2 text-lg ${
                  isPro ? "text-blue-400" : "text-green-400"
                }`}
              >
                <strong>Member Status:</strong> {isPro ? "Pro" : "Free Member"}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8 sm:justify-start">
            <Link
              to="/edit-profile"
              className={`flex group hover:scale-105 flex-row px-3 py-2 font-bold text-black transition duration-300 rounded-lg shadow-lg ${
                isPro
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              Edit Profile
              <VscEdit className="w-5 transition-all duration-150 group-hover:translate-x-1 group-hover:-translate-y-1 h-5 mt-[2px] ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
