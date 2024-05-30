import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    <nav className="flex justify-center items-center w-full fixed top-0 left-0 h-16 border-b border-gray-700 bg-gray-900 shadow-lg z-20">
      <div className="flex items-center justify-between w-full max-w-screen-xl px-6">
        <div className="flex items-center space-x-4">
          <Link
            className="text-xl text-green-400 font-bold hover:text-green-200 transition duration-300"
            to="/"
          >
            Quantercise
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          {userLoggedIn ? (
            <>
              <Link
                className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
                to={"/home"}
              >
                Home
              </Link>

              <Link
                className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
                to={"/practice-problems"}
              >
                Pratice
              </Link>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                }}
                className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
                to={"/login"}
              >
                Login
              </Link>
              <Link
                className="text-sm text-gray-300 hover:text-white transition duration-300 font-bold"
                to={"/register"}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
