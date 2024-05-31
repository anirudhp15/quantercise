import React, { useState } from "react";
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

  return (
    <nav className="flex justify-between items-center w-full fixed top-0 left-0 h-16 border-b border-gray-700 bg-gray-900 shadow-lg z-20 px-6">
      <div className="flex items-center space-x-4">
        <Link
          className="text-xl text-green-400 font-bold hover:text-green-200 transition duration-300"
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
              className="flex items-center text-sm text-green-400 hover:text-white transition duration-300 font-bold border-2 border-green-400 hover:border-white transform hover:scale-105 rounded-lg px-3 py-1"
            >
              <FaUser className="mr-2" />
              Settings
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                <Link
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
                  to="/home"
                  onClick={toggleProfile}
                >
                  Home
                </Link>
                <Link
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
                  to="/practice-problems"
                  onClick={toggleProfile}
                >
                  Practice
                </Link>
                <Link
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
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
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold ml-4"
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
