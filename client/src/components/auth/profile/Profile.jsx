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
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import axios from "axios";
import PaymentDebugger from "./PaymentDebugger";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { mongoId } = useUser();
  const { lowDetailMode } = useLowDetail();
  const { profileColor, setProfileColor, isPro } = useUser();
  const [planDetails, setPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
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
        "Are you sure you want to cancel your membership? You will retain access to premium features until the end of your current billing period."
      )
    ) {
      try {
        // Show loading state
        setIsLoading(true);

        // Debug log to see what IDs we have
        console.log("Cancellation - User IDs:", {
          mongoId,
          firebaseUid: currentUser?.uid,
          email: currentUser?.email,
        });

        // Try both endpoints - first try the new one, then fall back to the old one if needed
        let response;
        try {
          // Send all possible user identifiers to help with finding the user
          response = await axios.post(`/api/payment/cancel-membership`, {
            userId: currentUser.uid, // Firebase UID is most reliable
            email: currentUser.email,
          });
        } catch (error) {
          console.log(
            "First cancellation endpoint failed, trying fallback...",
            error
          );
          // If first endpoint fails, try the fallback endpoint
          response = await axios.post(`/api/payment/cancel`, {
            userId: currentUser.uid,
            email: currentUser.email,
          });
        }

        // Handle successful cancellation
        if (response.data.success || response.status === 200) {
          console.log("Cancellation successful:", response.data);

          // Update subscription details
          setSubscriptionDetails((prev) => ({
            ...prev,
            status: "canceling",
            cancellationDetails: {
              canceledAt: new Date(),
              effectiveAt: response.data.effectiveDate || null,
            },
          }));

          // Show success message to the user
          alert(
            "Your membership has been cancelled successfully. You'll retain access until the end of your current billing period."
          );

          // Refresh the page to show updated UI
          window.location.reload();
        } else {
          // Handle cases where the backend returns success: false
          alert(
            response.data.error ||
              "Failed to cancel membership. Please try again."
          );
        }
      } catch (error) {
        console.error("Error cancelling membership:", error);
        alert(
          error.response?.data?.error ||
            "Failed to cancel membership. Please try again later."
        );
      } finally {
        setIsLoading(false);
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex relative justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 via-gray-950">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="flex relative z-10 flex-col px-2 mx-auto w-full max-w-screen-2xl lg:px-4 lg:py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-2"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Profile
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

        <div className="grid grid-cols-1 gap-4 mt-4 lg:gap-8 xl:grid-cols-3">
          {/* Left Column - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-1"
          >
            <div className="p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl backdrop-blur-lg">
              <div className="flex flex-col items-center text-center">
                {currentUser?.photoURL ? (
                  <img
                    alt="Profile photo"
                    src={currentUser.photoURL}
                    className="w-32 h-32 rounded-full shadow-lg"
                    style={{
                      border: `4px solid ${profileColor}`,
                      boxSizing: "border-box",
                    }}
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
            className="space-y-4 lg:space-y-8 xl:col-span-2"
          >
            {/* Membership Section */}
            <div className="p-8 bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-xl">
              <h3 className="flex items-center mb-6 text-3xl font-bold text-white">
                <FaCrown className="mr-2 text-yellow-400 drop-shadow-md" />
                Membership
              </h3>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                    Current Plan
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-green-300">
                    {getPlanName()}
                  </p>

                  {isPro !== null && planDetails?.features && (
                    <ul className="mt-5 space-y-2">
                      {planDetails.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-300"
                          >
                            <FaCheckCircle className="mr-2 text-green-500" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  {isPro === null ? (
                    <button
                      onClick={handleUpgradePlan}
                      className="px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg transition duration-300 hover:from-green-600 hover:to-teal-600"
                    >
                      Upgrade Plan
                    </button>
                  ) : isPro === false ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpgradePlan}
                        className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg transition duration-300 hover:from-indigo-600 hover:to-purple-700"
                      >
                        Upgrade to Pro
                      </button>
                      <button
                        onClick={handleCancelMembership}
                        className="flex-1 px-6 py-3 font-medium text-red-500 rounded-lg border border-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleCancelMembership}
                      className="px-6 py-3 w-full font-medium text-red-500 rounded-lg border border-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
                    >
                      Cancel Membership
                    </button>
                  )}
                </div>
              </div>

              {isPro !== null && (
                <div className="p-6 mt-8 bg-gray-700 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaCreditCard className="mr-3 text-xl text-gray-300" />
                      <div>
                        <div className="flex gap-3 items-center">
                          <p className="text-base font-semibold text-white">
                            Payment Method
                          </p>
                          <Link
                            to="/billing"
                            className="px-3 py-1 text-sm text-white bg-gray-600 rounded-lg transition hover:bg-gray-500"
                          >
                            Update
                          </Link>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          {currentUser?.paymentMethodBrand
                            ? `${currentUser.paymentMethodBrand} •••• ${currentUser.paymentMethodLast4}`
                            : "No payment method on file"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {subscriptionDetails?.cancellationDetails &&
                subscriptionDetails.cancellationDetails.canceledAt && (
                  <div className="p-4 mb-6 text-amber-800 bg-amber-100 rounded-lg">
                    <h4 className="flex items-center text-lg font-semibold">
                      <FaCheckCircle className="mr-2" /> Cancellation Confirmed
                    </h4>
                    <p className="mt-2">
                      Your membership has been cancelled but remains active
                      until{" "}
                      <span className="font-semibold">
                        {formatDate(
                          subscriptionDetails.cancellationDetails.effectiveAt
                        )}
                      </span>
                      .
                    </p>
                    <p className="mt-2">
                      You'll continue to enjoy all premium benefits until this
                      date.
                    </p>
                    <button
                      onClick={handleUpgradePlan}
                      className="px-4 py-2 mt-4 text-sm font-medium text-amber-800 bg-white rounded-lg border border-amber-500 hover:bg-amber-50"
                    >
                      Keep My Membership
                    </button>
                  </div>
                )}
            </div>

            {/* Appearance Section */}
            <div className="p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl backdrop-blur-lg">
              <h3 className="my-2 text-2xl font-bold tracking-wide text-white">
                Appearance
              </h3>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-4 text-base text-gray-400">Profile Color</p>
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
                      className={`w-4 h-4 rounded-full transition-transform hover:scale-110 lg:w-8 lg:h-8 ${
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
