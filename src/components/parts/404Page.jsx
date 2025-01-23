import React from "react";
import { useAuth } from "../../contexts/authContext";

const NotFoundPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/register"; // Redirect to the register page
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">404 Not Found</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg"
      >
        Back to Register
      </button>
    </div>
  );
};

export default NotFoundPage;
