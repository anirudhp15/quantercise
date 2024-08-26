import React from "react";
import { Link } from "react-router-dom";
import "../../index.css"; // Adjust the path according to your folder structure

const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-0 auth-buttons">
      <Link
        to="/login"
        className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition duration-300 transform bg-transparent border-2 border-green-400 rounded-l-lg whitespace-nowrap hover:text-black hover:bg-green-400 hover:border-green-400 hover:scale-105 register-button"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="flex items-center px-3 py-1 text-sm font-bold text-gray-900 transition duration-300 transform bg-green-400 border-2 border-green-400 rounded-r-lg whitespace-nowrap hover:text-black hover:border-green-400 hover:bg-green-400 hover:scale-105 login-button"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButtons;
