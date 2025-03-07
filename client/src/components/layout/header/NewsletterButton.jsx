import React from "react";
import { useNavigate } from "react-router-dom";

const NewsletterButton = () => {
  const navigate = useNavigate();

  // Determine if the current page is the newsletter page
  const isNewsletterPage = window.location.pathname === "/waitlist";

  const handleJoinClick = () => {
    if (isNewsletterPage) {
      navigate("/landing"); // Navigate to the landing page
    } else {
      navigate("/waitlist"); // Navigate to the waitlist page
    }
  };

  return (
    <div className="hidden items-center space-x-0 sm:flex">
      <button
        className="flex items-center px-2 py-1 text-sm font-black tracking-tighter text-green-400 whitespace-nowrap bg-transparent rounded-lg border-2 border-green-400 transition-all duration-100 transform hover:scale-105 hover:text-black hover:bg-green-400 hover:border-green-400"
        onClick={handleJoinClick}
      >
        {isNewsletterPage ? "Learn More" : "Join Newsletter"}
      </button>
    </div>
  );
};

export default NewsletterButton;
