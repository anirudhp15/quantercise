import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaLink,
  FaMapMarkerAlt,
  FaPlus,
  FaQuestionCircle,
  FaSave,
} from "react-icons/fa";
import axios from "axios";
import { useUser } from "../../../contexts/userContext";
import { useAuth } from "../../../contexts/authContext";
import dayjs from "dayjs";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

const InterviewForm = ({
  applicationId,
  company,
  position,
  interview = null,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { userProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState({
    type: "Phone Screen",
    date: dayjs().add(1, "day").format("YYYY-MM-DDT12:00"),
    duration: 60,
    location: "Remote",
    meetingLink: "",
    interviewers: [{ name: "", role: "", email: "", linkedin: "" }],
    preparation: "",
    questions: [],
    feedback: "",
    status: "Scheduled",
    reminderSet: true,
    followUpNeeded: true,
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (interview) {
      setIsEdit(true);
      setInterviewData({
        ...interview,
        date: dayjs(interview.date).format(
          "YYYY-MM-DDT" + dayjs(interview.date).format("HH:mm")
        ),
      });
    }
  }, [interview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewData({ ...interviewData, [name]: value });
  };

  const handleInterviewerChange = (index, field, value) => {
    const updatedInterviewers = [...interviewData.interviewers];
    updatedInterviewers[index] = {
      ...updatedInterviewers[index],
      [field]: value,
    };
    setInterviewData({ ...interviewData, interviewers: updatedInterviewers });
  };

  const addInterviewer = () => {
    setInterviewData({
      ...interviewData,
      interviewers: [
        ...interviewData.interviewers,
        { name: "", role: "", email: "", linkedin: "" },
      ],
    });
  };

  const removeInterviewer = (index) => {
    const updatedInterviewers = [...interviewData.interviewers];
    updatedInterviewers.splice(index, 1);
    setInterviewData({ ...interviewData, interviewers: updatedInterviewers });
  };

  const addQuestion = () => {
    if (newQuestion.trim() === "") return;
    setInterviewData({
      ...interviewData,
      questions: [
        ...interviewData.questions,
        { question: newQuestion, notes: "" },
      ],
    });
    setNewQuestion("");
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...interviewData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setInterviewData({ ...interviewData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...interviewData.questions];
    updatedQuestions.splice(index, 1);
    setInterviewData({ ...interviewData, questions: updatedQuestions });
  };

  const handleToggleChange = (field) => {
    setInterviewData({ ...interviewData, [field]: !interviewData[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the date properly
      const formattedData = {
        ...interviewData,
        date: new Date(interviewData.date),
      };

      let response;
      if (isEdit) {
        // Update existing interview
        response = await axios.post("/api/applications/update-interview", {
          email: currentUser.email,
          applicationId,
          interviewId: interview._id,
          updatedInterview: formattedData,
        });
      } else {
        // Add new interview
        response = await axios.post("/api/applications/add-interview", {
          email: currentUser.email,
          applicationId,
          interview: formattedData,
        });
      }

      if (response.status === 200) {
        onSuccess(response.data.applications);
        onClose();
      }
    } catch (error) {
      console.error("Error saving interview:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to save interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-200">
            {isEdit ? "Edit Interview" : "Schedule Interview"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-full hover:text-gray-200 hover:bg-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="p-4 mb-6 rounded-lg bg-gray-750">
            <h3 className="pb-2 mb-4 text-xl font-semibold text-gray-200 border-b border-gray-700">
              {company} - {position}
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              {/* Interview Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Interview Type
                </label>
                <select
                  name="type"
                  value={interviewData.type}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Phone Screen">Phone Screen</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Take-home Assignment">
                    Take-home Assignment
                  </option>
                  <option value="Onsite">Onsite</option>
                  <option value="Final Round">Final Round</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Interview Status */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Status
                </label>
                <select
                  name="status"
                  value={interviewData.status}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="No-show">No-show</option>
                </select>
              </div>

              {/* Interview Date & Time */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  <FaCalendarAlt className="inline-block mr-2" />
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={interviewData.date}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  <FaClock className="inline-block mr-2" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={interviewData.duration}
                  onChange={handleInputChange}
                  min="5"
                  max="480"
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  <FaMapMarkerAlt className="inline-block mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={interviewData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, Office, Coffee Shop"
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  <FaLink className="inline-block mr-2" />
                  Meeting Link
                </label>
                <input
                  type="text"
                  name="meetingLink"
                  value={interviewData.meetingLink}
                  onChange={handleInputChange}
                  placeholder="e.g., Zoom, Teams, Google Meet link"
                  className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Toggle options */}
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminderSet"
                  checked={interviewData.reminderSet}
                  onChange={() => handleToggleChange("reminderSet")}
                  className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="reminderSet"
                  className="ml-2 text-sm font-medium text-gray-300"
                >
                  Set reminder for this interview
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="followUpNeeded"
                  checked={interviewData.followUpNeeded}
                  onChange={() => handleToggleChange("followUpNeeded")}
                  className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="followUpNeeded"
                  className="ml-2 text-sm font-medium text-gray-300"
                >
                  Send follow-up after interview
                </label>
              </div>
            </div>
          </div>

          {/* Interviewers Section */}
          <div className="p-4 mb-6 rounded-lg bg-gray-750">
            <h3 className="pb-2 mb-4 text-xl font-semibold text-gray-200 border-b border-gray-700">
              <FaUserTie className="inline-block mr-2" />
              Interviewers
            </h3>

            {interviewData.interviewers.map((interviewer, index) => (
              <div key={index} className="p-3 mb-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-300">
                    Interviewer {index + 1}
                  </h4>
                  {interviewData.interviewers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInterviewer(index)}
                      className="p-1 text-red-400 rounded-full hover:text-red-300 hover:bg-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-400">
                      Name
                    </label>
                    <input
                      type="text"
                      value={interviewer.name}
                      onChange={(e) =>
                        handleInterviewerChange(index, "name", e.target.value)
                      }
                      placeholder="Interviewer name"
                      className="px-3 py-2 w-full text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-400">
                      Role
                    </label>
                    <input
                      type="text"
                      value={interviewer.role}
                      onChange={(e) =>
                        handleInterviewerChange(index, "role", e.target.value)
                      }
                      placeholder="e.g., Hiring Manager, Engineer"
                      className="px-3 py-2 w-full text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-400">
                      Email
                    </label>
                    <input
                      type="email"
                      value={interviewer.email}
                      onChange={(e) =>
                        handleInterviewerChange(index, "email", e.target.value)
                      }
                      placeholder="Email address"
                      className="px-3 py-2 w-full text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-400">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={interviewer.linkedin}
                      onChange={(e) =>
                        handleInterviewerChange(
                          index,
                          "linkedin",
                          e.target.value
                        )
                      }
                      placeholder="LinkedIn profile URL"
                      className="px-3 py-2 w-full text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addInterviewer}
              className="flex items-center px-4 py-2 mt-2 text-sm font-medium text-blue-400 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              <FaPlus className="mr-2" /> Add Another Interviewer
            </button>
          </div>

          {/* Questions Section */}
          <div className="p-4 mb-6 rounded-lg bg-gray-750">
            <h3 className="pb-2 mb-4 text-xl font-semibold text-gray-200 border-b border-gray-700">
              <FaQuestionCircle className="inline-block mr-2" />
              Questions & Preparation
            </h3>

            {/* Preparation Notes */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Preparation Notes
              </label>
              <textarea
                name="preparation"
                value={interviewData.preparation}
                onChange={handleInputChange}
                placeholder="What to prepare for this interview? Key topics to review, projects to highlight, etc."
                rows="3"
                className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Questions */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Questions Asked/Expected
              </label>

              {/* Add Question Input */}
              <div className="flex mb-3">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add a question you expect or were asked"
                  className="flex-grow px-4 py-2 text-gray-200 bg-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Questions List */}
              {interviewData.questions.length > 0 ? (
                <div className="space-y-3">
                  {interviewData.questions.map((q, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-200">
                          {q.question}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-1 text-red-400 rounded-full hover:text-red-300 hover:bg-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <textarea
                        value={q.notes || ""}
                        onChange={(e) =>
                          handleQuestionChange(index, "notes", e.target.value)
                        }
                        placeholder="Add notes or your answer to this question"
                        rows="2"
                        className="px-3 py-2 w-full text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      ></textarea>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">
                  No questions added yet
                </p>
              )}
            </div>
          </div>

          {/* Feedback Section (visible if status is Completed) */}
          {interviewData.status === "Completed" && (
            <div className="p-4 mb-6 rounded-lg bg-gray-750">
              <h3 className="pb-2 mb-4 text-xl font-semibold text-gray-200 border-b border-gray-700">
                Post-Interview Feedback
              </h3>
              <textarea
                name="feedback"
                value={interviewData.feedback}
                onChange={handleInputChange}
                placeholder="How did the interview go? What went well? What could have gone better? Any next steps discussed?"
                rows="4"
                className="px-4 py-2 w-full text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Interview"
                : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default InterviewForm;
