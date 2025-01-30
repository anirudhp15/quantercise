import React, { useState, useContext } from "react";
import {
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbHome, TbProgressCheck } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doSignOut } from "../../../firebase/auth";
import AuthContext from "../../../contexts/authContext";
import { useUser } from "../../../contexts/userContext";

const SmallSidebar = ({ expanded, setExpanded }) => {
  const { currentUser } = useContext(AuthContext);
  const { isPro } = useUser();
  const navigate = useNavigate();

  const colorClass = isPro
    ? "text-blue-400 border-blue-400"
    : "text-green-400 border-green-400";
  const bgColorClass = isPro
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-green-500 hover:bg-green-600";

  const menuItems = [
    { icon: <TbHome />, text: "Home", link: "/home" },
    {
      icon: <RiPlayListAddFill />,
      text: "Problems",
      link: "/practice-problems",
    },
    // { icon: <TbProgressCheck />, text: "Progress", link: "/progress" },
    { icon: <FaClipboardList />, text: "Applications", link: "/applications" },
    // { icon: <FaChartBar />, text: "Analytics", link: "/analytics" },
    { icon: <FaCog />, text: "Settings", link: "/settings" },
  ];

  const handleSignOut = () => {
    doSignOut().then(() => navigate("/login"));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
      <div className="flex items-center justify-between p-4 bg-black border-b-2 border-gray-700">
        <h1 className={`text-xl font-black tracking-tighter ${colorClass}`}>
          Quantercise
        </h1>
        <button
          className="text-2xl text-gray-300"
          onClick={() => setExpanded(false)}
        >
          <FaTimes />
        </button>
      </div>
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full text-gray-300 bg-black"
      >
        <ul className="p-4 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className="flex items-center gap-4 p-4 rounded-md hover:bg-gray-800"
                onClick={() => setExpanded(false)} // Close sidebar on navigation
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-4 mt-auto border-t border-gray-700">
          {currentUser && (
            <div className="mb-4">
              <p className="text-sm font-bold">
                {currentUser.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser.email || "user@domain.com"}
              </p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`w-full flex text-black items-center justify-center gap-2 p-2 rounded-lg shadow ${bgColorClass}`}
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </motion.nav>
    </div>
  );
};

export default SmallSidebar;
