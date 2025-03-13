import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaLink,
  FaClock,
  FaEllipsisH,
  FaCheck,
  FaTrash,
  FaPencilAlt,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../../contexts/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InterviewForm from "./InterviewForm";
import InterviewDetails from "./InterviewDetails";

dayjs.extend(relativeTime);

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

const InterviewTimeline = () => {
  const { currentUser } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/applications/upcoming-interviews/${currentUser.email}`
      );
      setInterviews(response.data.upcomingInterviews);
      setError(null);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to load interviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchInterviews();
    }
  }, [currentUser]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (actionMenuOpen) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenuOpen]);

  const handleInterviewUpdate = (updatedApplications) => {
    fetchInterviews();
    setShowInterviewForm(false);
    setShowInterviewDetails(false);
  };

  const handleStatusUpdate = async (interviewData, newStatus) => {
    try {
      await axios.post("/api/applications/update-interview-status", {
        email: currentUser.email,
        applicationId: interviewData.applicationId,
        interviewId: interviewData.interview._id,
        status: newStatus,
      });

      fetchInterviews();
      setActionMenuOpen(null);
    } catch (error) {
      console.error("Error updating interview status:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to update interview status. Please try again.");
    }
  };

  const handleDeleteInterview = async (interviewData) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      try {
        await axios.post("/api/applications/delete-interview", {
          email: currentUser.email,
          applicationId: interviewData.applicationId,
          interviewId: interviewData.interview._id,
        });

        fetchInterviews();
        setActionMenuOpen(null);
      } catch (error) {
        console.error("Error deleting interview:", error);
        console.error("Error details:", error.response?.data || error.message);
        alert("Failed to delete interview. Please try again.");
      }
    }
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      "Phone Screen": "bg-blue-500",
      Technical: "bg-purple-500",
      Behavioral: "bg-green-500",
      "Take-home Assignment": "bg-yellow-500",
      Onsite: "bg-red-500",
      "Final Round": "bg-pink-500",
      Other: "bg-gray-500",
    };
    return colors[type] || colors["Other"];
  };

  const getStatusColor = (status) => {
    const colors = {
      Scheduled: "bg-blue-400 text-blue-900",
      Completed: "bg-green-400 text-green-900",
      Cancelled: "bg-red-400 text-red-900",
      Rescheduled: "bg-yellow-400 text-yellow-900",
      "No-show": "bg-gray-400 text-gray-900",
    };
    return colors[status] || "bg-gray-400 text-gray-900";
  };

  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.interview.date) - new Date(b.interview.date)
  );

  return (
    <div className="mx-auto mb-8 w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
        <h2 className="mb-2 text-xl font-bold text-gray-200 sm:text-2xl sm:mb-0">
          Upcoming Interviews
        </h2>
        {error && (
          <div className="px-3 py-1 w-full text-sm text-red-400 rounded-md sm:w-auto bg-red-900/20">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin sm:w-12 sm:h-12"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-4 text-center bg-gray-800 rounded-lg shadow-md sm:p-6">
          <FaCalendarAlt className="mx-auto mb-3 text-3xl text-gray-600 sm:mb-4 sm:text-4xl" />
          <h3 className="mb-2 text-lg font-semibold text-gray-300 sm:text-xl">
            No Upcoming Interviews
          </h3>
          <p className="text-sm text-gray-400 sm:text-base">
            Schedule interviews for your applications to keep track of your
            progress.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInterviews.map((interviewData, index) => (
            <motion.div
              key={interviewData.interview._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid relative grid-cols-1 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md transition-colors md:grid-cols-4 hover:bg-gray-750"
            >
              {/* Column 1: Company & Position */}
              <div>
                <div className="font-semibold text-gray-200 truncate">
                  {interviewData.company}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {interviewData.position}
                </div>
                <div className="flex flex-wrap gap-2 items-center mt-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${getInterviewTypeColor(
                      interviewData.interview.type
                    )} text-white`}
                  >
                    {interviewData.interview.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(
                      interviewData.interview.status
                    )}`}
                  >
                    {interviewData.interview.status}
                  </span>
                </div>
              </div>

              {/* Column 2: Date & Time */}
              <div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span className="text-base font-semibold text-gray-200 truncate">
                    {dayjs(interviewData.interview.date).format("MMM D, YYYY")}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <FaClock className="mr-2 text-gray-400" />
                  <span className="text-xs text-gray-300">
                    {dayjs(interviewData.interview.date).format("h:mm A")}
                    <span className="ml-1 text-xs text-gray-400">
                      ({interviewData.interview.duration} mins)
                    </span>
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {dayjs(interviewData.interview.date).fromNow()}
                </div>
              </div>

              {/* Column 3: Location, Meeting Link & Interviewers */}
              <div>
                <div className="flex items-center mb-1">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span className="text-xs text-gray-300 truncate">
                    {interviewData.interview.location ||
                      "No location specified"}
                  </span>
                </div>
                {interviewData.interview.meetingLink && (
                  <div className="flex items-center mb-1">
                    <FaLink className="mr-2 text-gray-400" />
                    <a
                      href={interviewData.interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 truncate hover:text-blue-300 hover:underline"
                      aria-label="Meeting Link"
                    >
                      Meeting Link
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <FaUserTie className="mr-2 text-gray-400" />
                  <span className="text-xs text-gray-300 truncate">
                    {interviewData.interview.interviewers.length > 0 &&
                    interviewData.interview.interviewers[0].name
                      ? interviewData.interview.interviewers.length === 1
                        ? interviewData.interview.interviewers[0].name
                        : `${interviewData.interview.interviewers[0].name} +${
                            interviewData.interview.interviewers.length - 1
                          } more`
                      : "No interviewers specified"}
                  </span>
                </div>
              </div>

              {/* Column 4: Actions Menu */}
              <div className="flex justify-end items-start">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenuOpen(
                        actionMenuOpen === interviewData.interview._id
                          ? null
                          : interviewData.interview._id
                      );
                    }}
                    className="p-1.5 text-gray-400 rounded-full hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="Interview options"
                  >
                    <FaEllipsisH className="text-base" />
                  </button>
                  {actionMenuOpen === interviewData.interview._id && (
                    <div className="absolute right-0 z-[100] mt-2 w-40 bg-gray-700 rounded-md border border-gray-600 shadow-xl">
                      <ul className="">
                        <li>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInterviewDetails(true);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center px-3 py-2 w-full text-xs text-blue-300 hover:bg-gray-600"
                          >
                            <FaInfoCircle className="mr-2 text-blue-400" />
                            View Details
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSelectedInterview(interviewData);
                              setShowInterviewForm(true);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center px-3 py-2 w-full text-xs text-yellow-300 hover:bg-gray-600"
                          >
                            <FaPencilAlt className="mr-2 text-yellow-400" />
                            Edit
                          </button>
                        </li>
                        {interviewData.interview.status !== "Completed" && (
                          <li>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(interviewData, "Completed");
                              }}
                              className="flex items-center px-3 py-2 w-full text-xs text-green-400 hover:bg-gray-600"
                            >
                              <FaCheck className="mr-2" />
                              Mark Completed
                            </button>
                          </li>
                        )}
                        <li>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInterview(interviewData);
                            }}
                            className="flex items-center px-3 py-2 w-full text-xs text-red-400 hover:bg-gray-600"
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interview Form Modal */}
      {showInterviewForm && selectedInterview && (
        <InterviewForm
          key={selectedInterview.interview._id}
          applicationId={selectedInterview._id}
          company={selectedInterview.company}
          position={selectedInterview.position}
          interview={selectedInterview.interview}
          onClose={() => {
            setShowInterviewForm(false);
            setSelectedInterview(null);
          }}
          onSuccess={(updatedData) => {
            handleInterviewUpdate(updatedData);
          }}
        />
      )}

      {/* Interview Details Modal */}
      {showInterviewDetails && selectedInterview && (
        <InterviewDetails
          interviewData={selectedInterview}
          onClose={() => {
            setShowInterviewDetails(false);
            setSelectedInterview(null);
          }}
          onEdit={() => {
            setShowInterviewDetails(false);
            setShowInterviewForm(true);
          }}
          onDelete={handleDeleteInterview}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default InterviewTimeline;
