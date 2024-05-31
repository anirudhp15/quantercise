import React from "react";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // FontAwesome icon for profile picture placeholder
import "../../index.css";

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6 mt-16">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold text-green-400 py-4">
          Account Details
        </h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-400"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-gray-600" />
              )}
            </div>

            {/* Account Details */}
            <div>
              <p className="text-lg">
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p className="text-lg mt-4">
                <strong>Name:</strong> {currentUser.displayName || "N/A"}
              </p>
              <p className="text-lg mt-4">
                <strong>Member Since:</strong>{" "}
                {currentUser.metadata.creationTime}
              </p>
              <Link
                to="/edit-profile"
                className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {/* Placeholder for recent activity */}
              <li className="bg-gray-700 p-4 rounded-lg shadow">
                <p>Completed a practice problem on Black-Scholes Model</p>
                <span className="text-sm text-gray-400">2024/06/01</span>
              </li>
              <li className="bg-gray-700 p-4 rounded-lg shadow">
                <p>Attended Quant Finance Webinar</p>
                <span className="text-sm text-gray-400">2024/06/15</span>
              </li>
              {/* Add more activity as needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
