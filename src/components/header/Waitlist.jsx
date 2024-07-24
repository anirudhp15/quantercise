import React from "react";
import "../../index.css";

const Waitlist = () => {
  return (
    <div className="flex items-center space-x-0">
      <button
        className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition duration-200 transform bg-transparent border-2 border-green-400 rounded-lg hover:text-black hover:bg-green-400 hover:border-green-400 hover:scale-105"
        onClick={() => {
          // Add your modal opening logic here
        }}
      >
        Join the Waitlist
      </button>
    </div>
  );
};

export default Waitlist;
