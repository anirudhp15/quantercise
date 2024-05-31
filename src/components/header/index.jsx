import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { FaUser } from "react-icons/fa"; // FontAwesome icon for user
import "../../index.css";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleProfile = () => setProfileOpen(!profileOpen);

  useEffect(() => {
    let timeoutId;
    if (profileOpen) {
      timeoutId = setTimeout(() => {
        setProfileOpen(false);
      }, 5000); // close after 5 seconds
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [profileOpen]);

  return (
    <nav className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="flex items-center space-x-4">
        <Link
          className="text-xl font-bold text-green-400 transition duration-300 hover:text-green-200"
          to="/"
        >
          Quantercise
        </Link>
      </div>
      <div className="flex items-center">
        {userLoggedIn ? (
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition duration-300 transform border-2 border-green-400 rounded-lg hover:text-white hover:border-white hover:scale-105"
            >
              <FaUser className="mr-2" />
              Settings
            </button>
            {profileOpen && (
              <div className="absolute right-0 z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                <Link
                  className="block w-full px-4 py-2 text-sm font-semibold text-center text-gray-300 transition duration-300 border-b border-gray-600 rounded-t-lg hover:bg-gray-700 hover:text-white"
                  to="/home"
                  onClick={toggleProfile}
                >
                  Home
                </Link>
                <Link
                  className="block px-4 py-2 text-sm font-semibold text-center text-gray-300 transition duration-300 border-b border-gray-600 hover:bg-gray-700 hover:text-white"
                  to="/practice-problems"
                  onClick={toggleProfile}
                >
                  Practice
                </Link>
                <Link
                  className="block px-4 py-2 text-sm font-semibold text-center text-gray-300 transition duration-300 border-b border-gray-600 hover:bg-gray-700 hover:text-white"
                  to="/profile"
                  onClick={toggleProfile}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/login");
                    });
                  }}
                  className="block w-full px-4 py-2 text-sm font-bold text-center text-gray-600 transition-all duration-300 border-2 border-opacity-0 rounded-b-lg hover:bg-gray-700 hover:text-red-500 hover:border-opacity-100 hover:border-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              className="text-sm font-bold text-gray-300 transition duration-300 hover:text-white"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="ml-4 text-sm font-bold text-gray-300 transition duration-300 hover:text-white"
              to="/register"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
