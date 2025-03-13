import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/userContext";

const NewsletterButton = () => {
  const navigate = useNavigate();
  const { isPro } = useUser();

  // Determine if the current page is the newsletter page
  const isNewsletterPage = window.location.pathname === "/newsletter-sign-up";

  const handleJoinClick = () => {
    if (isNewsletterPage) {
      navigate("/landing"); // Navigate to the landing page
    } else {
      navigate("/newsletter-sign-up"); // Navigate to the waitlist page
    }
  };

  return (
    <div className="hidden items-center space-x-0 sm:flex">
      <button
        className="flex items-center px-2 py-1 text-sm font-black tracking-tighter text-black whitespace-nowrap bg-green-400 rounded-lg border-2 border-green-400 transition-all duration-100 transform hover:scale-105"
        onClick={handleJoinClick}
      >
        {isNewsletterPage ? "Back" : "Join Newsletter"}
      </button>
    </div>
  );
};

export default NewsletterButton;
