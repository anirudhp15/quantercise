import React from "react";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const Waitlist = ({ onJoinClick }) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== "/landing") {
      navigate("/landing", { replace: true });
      setTimeout(() => {
        scrollToIntroAndBounce();
      }, 500); // Delay to allow navigation
    } else {
      scrollToIntroAndBounce();
    }
  };

  const scrollToIntroAndBounce = () => {
    scroller.scrollTo("intro", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50, // Adjust offset for your header height if needed
    });
    onJoinClick();
  };

  return (
    <div className="flex items-center space-x-0">
      <button
        className="flex items-center px-3 py-1 text-sm font-bold text-green-400 transition-all duration-100 transform bg-transparent border-2 border-green-400 rounded-lg whitespace-nowrap hover:text-black hover:bg-green-400 hover:border-green-400 hover:scale-105"
        onClick={handleJoinClick}
      >
        Join the Waitlist
      </button>
    </div>
  );
};

export default Waitlist;
