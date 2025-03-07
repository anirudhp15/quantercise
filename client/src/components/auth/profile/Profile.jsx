import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useUser } from "../../../contexts/userContext";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronRight,
  FaUserEdit,
  FaCrown,
  FaSignOutAlt,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaBell,
  FaCreditCard,
} from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import axios from "axios";
import PaymentDebugger from "./PaymentDebugger";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { lowDetailMode } = useLowDetail();
  const { profileColor, setProfileColor, isPro } = useUser();
  const [planDetails, setPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState({
    paymentFailed: true,
    subscriptionRenewed: true,
    subscriptionCancelled: true,
  });

  // Determine membership status and styling
  const getMembershipStatus = () => {
    if (isPro === true) {
      return {
        name: "PRO MEMBER",
        textColor: "text-yellow-800",
        bgColor: "bg-yellow-100",
        icon: <FaCrown className="mr-1" />,
      };
    } else if (isPro === false) {
      return {
        name: "SHARPE MEMBER",
        textColor: "text-green-800",
        bgColor: "bg-green-100",
        icon: <FaShieldAlt className="mr-1" />,
      };
    } else {
      return {
        name: "FREE PLAN",
        textColor: "text-gray-800",
        bgColor: "bg-gray-200",
        icon: null,
      };
    }
  };

  // Get current plan name
  const getPlanName = () => {
    if (isPro === true) return planDetails?.name || "Pro Plan";
    if (isPro === false) return planDetails?.name || "Sharpe Plan";
    return "Free Plan";
  };

  useEffect(() => {
    if (isPro !== null) {
      fetchPlanDetails();
    }
    if (currentUser?.emailNotifications) {
      setEmailNotifications(currentUser.emailNotifications);
    }
  }, [currentUser, isPro]);

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/plans/current");
      setPlanDetails(response.data);
    } catch (err) {
      setError("Failed to fetch plan details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelection = async (color) => {
    try {
      await setProfileColor(color);
    } catch (error) {
      console.error("Error updating profile color:", error);
    }
  };

  const handleUpgradePlan = () => {
    navigate("/plan-selection");
  };

  const handleCancelMembership = async () => {
    if (
      window.confirm(
        "Are you sure you want to cancel your membership? You will lose access to premium features at the end of your billing period."
      )
    ) {
      try {
        await axios.post("/api/payment/cancel");
        alert("Your membership has been cancelled successfully.");
        window.location.reload();
      } catch (error) {
        console.error("Error cancelling membership:", error);
        alert("Failed to cancel membership. Please try again later.");
      }
    }
  };

  const handleToggleNotification = async (type) => {
    const updatedNotifications = {
      ...emailNotifications,
      [type]: !emailNotifications[type],
    };
    setEmailNotifications(updatedNotifications);
    try {
      await axios.put(
        `/api/user/${currentUser.uid}/notifications`,
        updatedNotifications
      );
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      setEmailNotifications(emailNotifications);
    }
  };

  // Format date for readability
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex relative justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 via-gray-950">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="flex relative z-10 flex-col px-6 py-24 mx-auto w-full max-w-7xl lg:py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Settings
          </h1>
          <div className="flex items-center mt-4 text-sm">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-green-400"
            >
              Home
            </Link>
            <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
            <span className="text-green-400"> Profile</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left Column - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-1"
          >
            <div className="p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-lg">
              <div className="flex flex-col items-center text-center">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 shadow-lg"
                    style={{ borderColor: profileColor }}
                  />
                ) : (
                  <div
                    className="flex justify-center items-center w-32 h-32 rounded-full shadow-lg"
                    style={{ backgroundColor: profileColor || "#6B7280" }}
                  >
                    <SiOpentofu className="w-16 h-16 text-white" />
                  </div>
                )}
                <h2 className="mt-6 text-2xl font-bold tracking-wide text-white">
                  {currentUser?.displayName || "User"}
                </h2>
                <p className="mt-1 text-lg text-gray-300">
                  {currentUser?.email}
                </p>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide ${
                      getMembershipStatus().textColor
                    } ${getMembershipStatus().bgColor} rounded-full`}
                  >
                    {getMembershipStatus().icon}
                    {getMembershipStatus().name}
                  </span>
                </div>
                <Link
                  to="/edit-profile"
                  className="inline-flex justify-center items-center px-4 py-2 mt-6 w-full text-base font-medium text-white bg-green-600 rounded-md transition hover:bg-green-700"
                >
                  <FaUserEdit className="mr-2" /> Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex justify-center items-center px-4 py-2 mt-4 w-full text-base font-medium text-red-500 rounded-md border border-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </div>
              <div className="pt-6 mt-8 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    Member Since
                  </div>
                  <span className="text-white">
                    {formatDate(currentUser?.createdAt || new Date())}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-gray-400">
                    <FaClock className="mr-2" />
                    Last Login
                  </div>
                  <span className="text-white">
                    {formatDate(currentUser?.lastLogin || new Date())}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Settings Sections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 xl:col-span-2"
          >
            {/* Membership Section */}
            <div className="p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-lg">
              <h3 className="flex items-center mb-6 text-2xl font-bold tracking-wide text-white">
                <FaCrown className="mr-3 text-yellow-400" /> Membership
              </h3>
              <div className="flex flex-col justify-between items-center sm:flex-row">
                <div>
                  <p className="text-sm text-gray-300">Current Plan</p>
                  <p className="mt-1 text-xl font-medium tracking-wide text-white">
                    {getPlanName()}
                  </p>
                  {isPro !== null && planDetails?.features && (
                    <ul className="mt-4 space-y-1">
                      {planDetails.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-400"
                          >
                            <span className="mr-2 text-green-400">✓</span>
                            {feature}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <div className="mt-6 space-y-3 sm:mt-0">
                  {isPro === null ? (
                    <button
                      onClick={handleUpgradePlan}
                      className="px-6 py-3 w-full text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md transition hover:from-green-600 hover:to-green-700"
                    >
                      Upgrade Plan
                    </button>
                  ) : isPro === false ? (
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={handleUpgradePlan}
                        className="px-6 py-3 w-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md transition hover:from-blue-600 hover:to-purple-700"
                      >
                        Upgrade to Pro
                      </button>
                      <button
                        onClick={handleCancelMembership}
                        className="px-6 py-3 w-full text-sm font-medium text-red-500 rounded-md border border-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        Cancel Membership
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleCancelMembership}
                      className="px-6 py-3 w-full text-sm font-medium text-red-500 rounded-md border border-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      Cancel Membership
                    </button>
                  )}
                </div>
              </div>
              {isPro !== null && (
                <div className="p-4 mt-8 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaCreditCard className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-base font-medium text-white">
                          Payment Method
                        </p>
                        <p className="text-sm text-gray-400">
                          {currentUser?.paymentMethodBrand
                            ? `${currentUser.paymentMethodBrand} •••• ${currentUser.paymentMethodLast4}`
                            : "No payment method on file"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/billing"
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Appearance Section */}
            <div className="p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-lg">
              <h3 className="mb-6 text-2xl font-bold tracking-wide text-white">
                Appearance
              </h3>
              <div className="p-8 bg-gray-700 rounded-lg">
                <p className="mb-4 text-base text-white">
                  Profile Accent Color
                </p>
                <div className="flex justify-between items-center">
                  {[
                    "#10B981",
                    "#3B82F6",
                    "#8B5CF6",
                    "#EC4899",
                    "#F97316",
                    "#F59E0B",
                    "#84CC16",
                    "#14B8A6",
                    "#06B6D4",
                    "#6366F1",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelection(color)}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                        profileColor === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} as profile color`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            {/* <div className="p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-lg">
              <h3 className="flex items-center mb-6 text-2xl font-bold tracking-wide text-white">
                <FaBell className="mr-3 text-blue-400" /> Email Notifications
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: "Payment Failed",
                    description: "Get notified when a payment fails",
                    key: "paymentFailed",
                  },
                  {
                    label: "Subscription Renewed",
                    description: "Get notified when your subscription renews",
                    key: "subscriptionRenewed",
                  },
                  {
                    label: "Subscription Cancelled",
                    description:
                      "Get notified when your subscription is cancelled",
                    key: "subscriptionCancelled",
                  },
                ].map((notif) => (
                  <div
                    key={notif.key}
                    className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-base font-medium text-white">
                        {notif.label}
                      </p>
                      <p className="text-sm text-gray-400">
                        {notif.description}
                      </p>
                    </div>
                    <label className="inline-flex relative cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications[notif.key]}
                        onChange={() => handleToggleNotification(notif.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Admin Tools Section */}
        {currentUser &&
          currentUser.email === process.env.REACT_APP_ADMIN_EMAIL && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <PaymentDebugger userId={currentUser._id || currentUser.uid} />
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default Profile;
