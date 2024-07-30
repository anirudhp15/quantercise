import React from "react";

const Waitlist = ({ onJoinClick }) => {
  return (
    <div className="flex items-center space-x-0">
      <button
        className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition duration-200 transform bg-transparent border-2 border-green-400 rounded-lg whitespace-nowrap hover:text-black hover:bg-green-400 hover:border-green-400 hover:scale-105"
        onClick={onJoinClick}
      >
        Join the Waitlist
      </button>
    </div>
  );
};

export default Waitlist;
