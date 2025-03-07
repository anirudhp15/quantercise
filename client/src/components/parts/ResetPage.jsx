import React from "react";
import { useAuth } from "../../contexts/authContext";

const ResetPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/register"; // Redirect to the register page
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Reset Application State</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg"
      >
        Logout and Reset
      </button>
    </div>
  );
};

export default ResetPage;
