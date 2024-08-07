import React from "react";
import { Link } from "react-router-dom";
import "../../index.css"; // Adjust the path according to your folder structure

const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-0 auth-buttons">
      <Link
        to="/register"
        className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition duration-300 transform bg-transparent border-2 border-green-400 rounded-l-lg hover:text-white hover:bg-green-400 hover:border-green-400 hover:scale-105 register-button"
      >
        Sign Up
      </Link>
      <Link
        to="/login"
        className="flex items-center px-3 py-1 text-sm font-bold text-gray-900 transition duration-300 transform bg-green-400 border-2 border-green-400 rounded-r-lg hover:text-white hover:border-green-400 hover:bg-green-400 hover:scale-105 login-button"
      >
        Login
      </Link>
    </div>
  );
};

export default AuthButtons;
