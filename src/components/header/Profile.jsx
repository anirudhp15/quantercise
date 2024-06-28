import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "../../index.css";

const Profile = () => {
  const { currentUser, fetchUserActivities } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = fetchUserActivities(currentUser.uid, setActivities);
      return () => unsubscribe();
    }
  }, [currentUser, fetchUserActivities]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-16 text-gray-300 bg-gray-900">
      <div className="max-w-screen-lg mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-4 text-4xl font-bold text-center text-green-400"
        >
          Account Details
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 bg-gray-800 rounded-lg shadow-lg"
        >
          <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="relative">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="object-cover w-32 h-32 border-4 border-green-400 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-600" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl">
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p className="mt-4 text-xl">
                <strong>Name:</strong> {currentUser.displayName || "N/A"}
              </p>
              <p className="mt-4 text-xl">
                <strong>Member Since:</strong>{" "}
                {new Date(
                  currentUser.metadata.creationTime
                ).toLocaleDateString()}
              </p>
              <Link
                to="/edit-profile"
                className="inline-block px-6 py-2 mt-6 font-bold text-white transition duration-300 bg-green-600 rounded-full hover:bg-green-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-green-400">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <motion.li
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 transition duration-300 bg-gray-700 rounded-lg shadow hover:shadow-lg hover:bg-gray-600"
                  >
                    <p className="text-lg">{activity.description}</p>
                    <span className="text-sm text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 transition duration-300 bg-gray-700 rounded-lg shadow hover:shadow-lg hover:bg-gray-600"
                >
                  <p>No recent activity found.</p>
                </motion.li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
