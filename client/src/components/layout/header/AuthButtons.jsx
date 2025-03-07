import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import "../../../index.css"; // Adjust the path according to your folder structure

const AuthButtons = () => {
  const { userLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    if (userLoggedIn) {
      e.preventDefault();
      await logout();
      navigate("/login");
    }
    // If not logged in, the Link component will handle the navigation
  };

  return (
    <div className="flex items-center space-x-0 auth-buttons">
      <Link
        to="/login"
        onClick={handleLoginClick}
        className={`flex items-center px-2 py-1 text-sm font-black tracking-tighter text-green-400 whitespace-nowrap bg-transparent  border-2 border-green-400 transition duration-100 transform hover:text-black hover:bg-green-400 hover:border-green-400 hover:scale-105 register-button ${
          userLoggedIn ? "rounded-lg" : "rounded-l-lg"
        }`}
      >
        {userLoggedIn ? "Logout" : "Login"}
      </Link>
      {!userLoggedIn && (
        <Link
          to="/register"
          className="flex items-center px-2 py-1 text-sm font-black tracking-tighter text-gray-900 whitespace-nowrap bg-green-400 rounded-r-lg border-2 border-green-400 transition duration-100 transform hover:text-black hover:border-green-400 hover:bg-green-400 hover:scale-105 login-button"
        >
          Sign Up
        </Link>
      )}
    </div>
  );
};

export default AuthButtons;
