import React from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLink,
  FaUserTie,
  FaQuestionCircle,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import dayjs from "dayjs";

const InterviewDetails = ({
  interviewData,
  onClose,
  onEdit,
  onDelete,
  onStatusUpdate,
}) => {
  const { interview, company, position } = interviewData;

  const getStatusColor = (status) => {
    const colors = {
      Scheduled: "text-blue-400",
      Completed: "text-green-400",
      Cancelled: "text-red-400",
      Rescheduled: "text-yellow-400",
      "No-show": "text-gray-400",
    };
    return colors[status] || "text-gray-400";
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      "Phone Screen": "text-blue-400",
      Technical: "text-purple-400",
      Behavioral: "text-green-400",
      "Take-home Assignment": "text-yellow-400",
      Onsite: "text-red-400",
      "Final Round": "text-pink-400",
      Other: "text-gray-400",
    };
    return colors[type] || colors["Other"];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex fixed inset-0 z-[100] justify-center items-center p-2 bg-black bg-opacity-50 sm:p-4"
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-3 border-b border-gray-700 sm:p-6">
          <h2 className="text-xl font-bold text-gray-200 sm:text-2xl">
            Interview Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-full hover:text-gray-200 hover:bg-gray-700"
            aria-label="Close"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {/* Header with Company and Position */}
          <div className="pb-3 mb-4 border-b border-gray-700 sm:pb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-200 sm:text-xl">
              {company}
            </h3>
            <p className="text-sm text-gray-400 sm:text-base">{position}</p>
          </div>

          {/* Interview Basic Info */}
          <div className="grid grid-cols-1 gap-4 mb-4 sm:gap-6 sm:mb-6 md:grid-cols-2">
            <div>
              <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
                Interview Details
              </h4>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <div className="mt-1 mr-2 sm:mr-3">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">Date & Time</p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {dayjs(interview.date).format("MMMM D, YYYY [at] h:mm A")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(interview.date).fromNow()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-2 sm:mr-3">
                    <FaClock className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">Duration</p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {interview.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-2 sm:mr-3">
                    <span className={getInterviewTypeColor(interview.type)}>
                      <FaQuestionCircle />
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">Type</p>
                    <p
                      className={`text-xs sm:text-sm ${getInterviewTypeColor(
                        interview.type
                      )}`}
                    >
                      {interview.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-2 sm:mr-3">
                    <span className={getStatusColor(interview.status)}>
                      <FaCheckCircle />
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">Status</p>
                    <p
                      className={`text-xs sm:text-sm ${getStatusColor(
                        interview.status
                      )}`}
                    >
                      {interview.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
                Location & Connection
              </h4>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <div className="mt-1 mr-2 sm:mr-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">Location</p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {interview.location || "Not specified"}
                    </p>
                  </div>
                </div>

                {interview.meetingLink && (
                  <div className="flex items-start">
                    <div className="mt-1 mr-2 sm:mr-3">
                      <FaLink className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Meeting Link</p>
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 break-all sm:text-sm hover:text-blue-300"
                      >
                        {interview.meetingLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <h4 className="pb-2 mt-4 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mt-6 sm:mb-3 sm:text-lg">
                Reminders
              </h4>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={interview.reminderSet}
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-xs font-medium text-gray-300 sm:text-sm">
                    Reminder set for this interview
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={interview.followUpNeeded}
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-xs font-medium text-gray-300 sm:text-sm">
                    Follow-up after interview
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Interviewers */}
          <div className="mb-4 sm:mb-6">
            <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
              Interviewers
            </h4>

            {interview.interviewers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                {interview.interviewers.map((interviewer, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-700 rounded-lg sm:p-3"
                  >
                    <div className="flex items-center mb-1 sm:mb-2">
                      <FaUserTie className="mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-300 sm:text-base">
                        {interviewer.name || "Unnamed Interviewer"}
                      </span>
                    </div>
                    {interviewer.role && (
                      <p className="mb-1 ml-6 text-xs text-gray-400 sm:text-sm">
                        Role: {interviewer.role}
                      </p>
                    )}
                    {interviewer.email && (
                      <p className="mb-1 ml-6 text-xs text-gray-400 sm:text-sm">
                        Email: {interviewer.email}
                      </p>
                    )}
                    {interviewer.linkedin && (
                      <p className="ml-6 text-xs text-blue-400 sm:text-sm">
                        <a
                          href={interviewer.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-300"
                        >
                          LinkedIn Profile
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400 sm:text-sm">
                No interviewers specified
              </p>
            )}
          </div>

          {/* Preparation Notes */}
          <div className="mb-4 sm:mb-6">
            <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
              Preparation Notes
            </h4>

            {interview.preparation ? (
              <div className="p-3 text-xs text-gray-300 whitespace-pre-wrap bg-gray-700 rounded-lg sm:p-4 sm:text-sm">
                {interview.preparation}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400 sm:text-sm">
                No preparation notes added
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="mb-4 sm:mb-6">
            <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
              Interview Questions
            </h4>

            {interview.questions && interview.questions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {interview.questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-700 rounded-lg sm:p-3"
                  >
                    <p className="mb-1 text-sm font-medium text-gray-200 sm:mb-2 sm:text-base">
                      {q.question}
                    </p>
                    {q.notes ? (
                      <div className="pl-3 border-l-2 border-gray-600 sm:pl-4">
                        <p className="text-xs text-gray-400 sm:text-sm">
                          {q.notes}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400 sm:text-sm">
                No questions added yet
              </p>
            )}
          </div>

          {/* Feedback (visible if status is Completed) */}
          {interview.status === "Completed" && (
            <div className="mb-4 sm:mb-6">
              <h4 className="pb-2 mb-2 text-base font-medium text-gray-300 border-b border-gray-700 sm:mb-3 sm:text-lg">
                Post-Interview Feedback
              </h4>

              {interview.feedback ? (
                <div className="p-3 text-xs text-gray-300 whitespace-pre-wrap bg-gray-700 rounded-lg sm:p-4 sm:text-sm">
                  {interview.feedback}
                </div>
              ) : (
                <p className="text-xs italic text-gray-400 sm:text-sm">
                  No feedback provided yet
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-end mt-4 sm:mt-8 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
            {interview.status !== "Completed" && (
              <button
                onClick={() => {
                  onStatusUpdate(interviewData, "Completed");
                  onClose();
                }}
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-green-400 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <FaCheckCircle className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Mark as Completed</span>
                <span className="xs:hidden">Complete</span>
              </button>
            )}
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-400 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              <FaEdit className="mr-1 sm:mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(interviewData);
                onClose();
              }}
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-red-400 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              <FaTrash className="mr-1 sm:mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewDetails;
