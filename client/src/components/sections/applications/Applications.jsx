import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  FaPlus,
  FaTrash,
  FaTimes,
  FaSearch,
  FaBars,
  FaCog,
  FaChartBar,
  FaMinusCircle,
  FaCheckCircle,
  FaUserCheck,
  FaHandHoldingUsd,
  FaTimesCircle,
  FaCalendarPlus,
  FaEllipsisH,
  FaPencilAlt,
} from "react-icons/fa";
import { TbNotes, TbNotesOff } from "react-icons/tb";
import { motion } from "framer-motion";
import { Input } from "antd";
import dayjs from "dayjs";
import { BarChart, BookOpen, Activity, Edit } from "lucide-react";
import axios from "axios";
import "../../../index.css";

import AuthContext from "../../../contexts/authContext";
import { GrVirtualMachine } from "react-icons/gr";
import { useUser } from "../../../contexts/userContext";
import InterviewTimeline from "./InterviewTimeline";
import InterviewForm from "./InterviewForm";

const Applications = () => {
  const { currentUser } = useContext(AuthContext);
  const { isPro } = useUser();

  // State: List of all applications
  const [applications, setApplications] = useState([]);
  // Searching, filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [selectedApplicationForInterview, setSelectedApplicationForInterview] =
    useState(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [appActionMenuOpen, setAppActionMenuOpen] = useState(null);

  // Form-related states
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "",
    dateOfSubmission: "",
    deadlineDate: "",
    notes: "",
    field: "",
    coverLetter: "No Cover Letter",
    location: "",
    workMode: "In-person", // default or "" if you want none
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Sidebar expansions
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [smallSidebarExpanded, setSmallSidebarExpanded] = useState(false);

  // Row expansions
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedNotesRow, setExpandedNotesRow] = useState(null);

  // Loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timeline cache key - only changes when applications are updated
  const [timelineKey, setTimelineKey] = useState(Date.now());

  // ---------------------------
  // Pagination State
  // ---------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  // Fetch applications on load
  useEffect(() => {
    if (currentUser && currentUser.email) {
      axios
        .get(`/api/applications/user-applications/${currentUser.email}`)
        .then((response) => {
          setApplications(response.data.applications);
          setLoading(false);
          // Update timeline key when applications are loaded
          setTimelineKey(Date.now());
        })
        .catch((err) => {
          console.error("Error fetching applications:", err);
          setError("Error fetching applications. Please try again later.");
          setLoading(false);
        });
    }
  }, [currentUser]);

  // ---------------------------
  // Handlers for form & filters
  // ---------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleFieldFilterChange = (e) => setFieldFilter(e.target.value);
  const handleWorkModeFilterChange = (e) => setWorkModeFilter(e.target.value);
  // ---------------------------
  // Form toggle & reset
  // ---------------------------
  const handleFormToggle = () => {
    setIsFormOpen(!isFormOpen);
    setEditMode(false);
    resetForm();
    setCurrentId(null);
    // close small sidebar
    setSmallSidebarExpanded(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditMode(false);
    resetForm();
    setCurrentId(null);
  };

  const resetForm = () => {
    setForm({
      company: "",
      position: "",
      status: "",
      dateOfSubmission: "",
      deadlineDate: "",
      notes: "",
      field: "",
      coverLetter: "No Cover Letter",
      location: "",
      workMode: "In-person",
    });
  };

  // ---------------------------
  // Start "Edit" mode
  // ---------------------------
  const startEdit = (application) => {
    // Prefill the form with the chosen application
    setForm({
      company: application.company || "",
      position: application.position || "",
      status: application.status || "",
      dateOfSubmission: application.dateOfSubmission
        ? dayjs(application.dateOfSubmission).format("YYYY-MM-DD")
        : "",
      deadlineDate: application.deadlineDate
        ? dayjs(application.deadlineDate).format("YYYY-MM-DD")
        : "",
      notes: application.notes || "",
      field: application.field || "",
      coverLetter: application.coverLetter || "No Cover Letter",
      location: application.location || "",
      workMode: application.workMode || "In-person",
    });
    // Save the _id in currentId to send to the edit endpoint
    setCurrentId(application._id);
    setEditMode(true);
    setIsFormOpen(true);
  };

  // ---------------------------
  // Submit form: Add or Edit
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // minimal check for required fields
    if (!form.company.trim() || !form.position.trim()) {
      setError("Company and Position are required fields.");
      return;
    }

    if (!currentUser || !currentUser.email) {
      console.error("User is not logged in or email is missing.", currentUser);
      setError("User is not logged in or email is missing.");
      return;
    }

    // If we're editing, send to edit endpoint
    if (editMode && currentId) {
      axios
        .post("/api/applications/edit-application", {
          email: currentUser.email,
          applicationId: currentId, // the _id from startEdit
          updatedFields: {
            ...form,
          },
        })
        .then((response) => {
          setApplications(response.data.applications);
          resetForm();
          setEditMode(false);
          setIsFormOpen(false);
          setShowMoreInfo(false);
          // Update timeline key when applications are updated
          setTimelineKey(Date.now());
        })
        .catch((err) => {
          console.error("Error editing application:", err);
          setError("Error editing application. Please try again.");
        });
    } else {
      // Otherwise, add new application
      const newApplication = {
        ...form,
        dateOfSubmission: form.dateOfSubmission
          ? new Date(form.dateOfSubmission)
          : new Date(),
      };

      axios
        .post("/api/applications/add-application", {
          email: currentUser.email,
          application: newApplication,
        })
        .then((response) => {
          setApplications(response.data.applications);
          resetForm();
          setIsFormOpen(false);
          setShowMoreInfo(false);
          // Update timeline key when applications are updated
          setTimelineKey(Date.now());
        })
        .catch((error) => {
          console.error("Error adding application:", error);
          setError("Error saving application. Please try again.");
        });
    }
  };

  // ---------------------------
  // Deleting an application
  // ---------------------------
  const handleDelete = (id) => {
    axios
      .post("/api/applications/delete-application", {
        email: currentUser.email,
        applicationId: id,
      })
      .then((response) => {
        setApplications(response.data.applications);
        // Update timeline key when applications are updated
        setTimelineKey(Date.now());
      })
      .catch((err) => {
        console.error("Error deleting application:", err);
        setError("Error deleting application. Please try again.");
      });
  };

  // ---------------------------
  // Expand/Collapse rows
  // ---------------------------
  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const toggleNotesExpansion = (id) => {
    setExpandedNotesRow(expandedNotesRow === id ? null : id);
  };

  // ---------------------------
  // Filter logic
  // ---------------------------
  const filteredApplications = useMemo(() => {
    return applications
      .filter((application) => {
        const searchFields = [
          application.company?.toLowerCase() || "",
          application.position?.toLowerCase() || "",
          application.status?.toLowerCase() || "",
          application.field?.toLowerCase() || "",
          application.location?.toLowerCase() || "",
          application.notes?.toLowerCase() || "",
          application.coverLetter?.toLowerCase() || "",
          application.dateOfSubmission
            ? dayjs(application.dateOfSubmission)
                .format("MMM D, YYYY")
                .toLowerCase()
            : "",
          application.deadlineDate
            ? dayjs(application.deadlineDate)
                .format("MMM D, YYYY")
                .toLowerCase()
            : "",
          application.workMode?.toLowerCase() || "",
        ];
        return searchFields.some((field) => field.includes(searchTerm));
      })
      .filter((app) => (statusFilter ? app.status === statusFilter : true))
      .filter((app) => (fieldFilter ? app.field === fieldFilter : true))
      .filter((app) =>
        workModeFilter ? app.workMode === workModeFilter : true
      );
  }, [applications, searchTerm, statusFilter, fieldFilter, workModeFilter]);

  // ---------------------------
  // Pagination Logic
  // ---------------------------
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = useMemo(() => {
    return filteredApplications.slice(
      indexOfFirstApplication,
      indexOfLastApplication
    );
  }, [filteredApplications, indexOfFirstApplication, indexOfLastApplication]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ---------------------------
  // Utility: styling for field, coverLetter, etc.
  // ---------------------------
  const fieldColors = {
    Trading: "bg-green-400 text-black",
    Research: "bg-blue-400 text-black",
    SWE: "bg-yellow-400 text-black",
    "Data Analysis": "bg-purple-400 text-black",
    Engineering: "bg-red-400 text-black",
    "Machine Learning": "bg-indigo-400 text-black",
    Other: "bg-gray-400 text-black",
    Default: "bg-gray-700 text-white",
  };
  const fieldIcons = {
    Trading: <Activity className="w-4 h-4" />,
    Research: <BookOpen className="w-4 h-4" />,
    SWE: <FaCog className="w-4 h-4" />,
    "Data Analysis": <BarChart className="w-4 h-4" />,
    Engineering: <FaChartBar className="w-4 h-4" />,
    "Machine Learning": <GrVirtualMachine className="w-4 h-4" />,
    Other: <TbNotes className="w-4 h-4" />,
    Default: <TbNotesOff className="w-4 h-4" />,
  };

  function getFieldColor(field) {
    return fieldColors[field] || fieldColors.Default;
  }
  function getFieldIcon(field) {
    return fieldIcons[field] || fieldIcons.Default;
  }

  // ---------------------------
  // Utility: styling and icons for status
  // ---------------------------
  const statusColors = {
    "Not Applied": "bg-gray-500",
    Applied: "bg-blue-400",
    Interviewing: "bg-yellow-400",
    Offered: "bg-green-400",
    Rejected: "bg-red-400",
    Default: "bg-gray-700",
  };
  const statusIcons = {
    "Not Applied": <FaMinusCircle className="w-4 h-4" />,
    Applied: <FaCheckCircle className="w-4 h-4" />,
    Interviewing: <FaUserCheck className="w-4 h-4" />,
    Offered: <FaHandHoldingUsd className="w-4 h-4" />,
    Rejected: <FaTimesCircle className="w-4 h-4" />,
    Default: <TbNotesOff className="w-4 h-4" />,
  };

  function getStatusColor(status) {
    return statusColors[status] || statusColors.Default;
  }
  function getStatusIcon(status) {
    return statusIcons[status] || statusIcons.Default;
  }

  // For deadline color
  function getDeadlineColor(deadline) {
    const today = dayjs();
    const diff = dayjs(deadline).diff(today, "days");
    if (diff < 0) return "bg-red-500 text-white"; // Overdue
    if (diff <= 7) return "bg-yellow-400 text-black"; // Soon
    return "bg-green-400 text-black"; // Safe
  }

  // Cover letter
  function simplifyCoverLetter(coverLetter) {
    const mappings = {
      "No Cover Letter": "None",
      "Cover Letter Submitted": "Submitted",
      "In Progress": "In Progress",
    };
    return mappings[coverLetter] || "N/A";
  }
  const coverLetterColors = {
    None: "text-red-400",
    Submitted: "text-green-400",
    "In Progress": "text-yellow-400",
    Default: "text-gray-300",
  };
  function getCoverLetterColor(coverLetter) {
    const simplified = simplifyCoverLetter(coverLetter);
    return coverLetterColors[simplified] || coverLetterColors.Default;
  }

  const handleAddInterview = useCallback((application) => {
    setSelectedApplicationForInterview(application);
    setShowInterviewForm(true);
  }, []);

  const handleInterviewSuccess = useCallback((updatedApplications) => {
    // Update the applications list with the new data
    setApplications(updatedApplications);
    // Close the interview form
    setShowInterviewForm(false);
    setSelectedApplicationForInterview(null);
    // Update timeline key to force re-render
    setTimelineKey(Date.now());
  }, []);

  // Memoized Interview Timeline component
  const MemoizedInterviewTimeline = useMemo(() => {
    if (loading || applications.length === 0) return null;
    return <InterviewTimeline key={timelineKey} />;
  }, [loading, applications.length, timelineKey]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="flex overflow-auto relative min-h-screen text-gray-300 bg-gradient-to-br to-gray-900 from-gray-950">
      {/* Main Content */}
      <div className={`flex flex-col p-4 mx-auto w-full max-w-screen-2xl`}>
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`mb-6 text-4xl font-black text-left text-green-400 hover:text-green-300`}
        >
          Applications
        </motion.h1>

        {/* Interview Timeline - Memoized */}
        {MemoizedInterviewTimeline}

        {/* SEARCH / FILTERS / ADD BUTTON */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar - ChatGPT style */}
            <div className="relative w-full lg:max-w-xl">
              <Input
                className="w-full placeholder-gray-200 text-gray-100 bg-gray-300 rounded-md border border-gray-600 shadow-sm"
                placeholder="Search your applications..."
                variant="outlined"
                allowClear
                enterButton
                onChange={handleSearch}
                style={{
                  height: 40,
                  paddingLeft: 16,
                  fontSize: "14px",
                  boxShadow: "none",
                }}
                prefix={<FaSearch className="mr-2 text-gray-400" />}
              />
            </div>

            <div className="flex gap-3 items-center">
              {/* Filters Button with Dropdown */}
              <div className="relative group">
                <button className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md border border-gray-600 transition-colors hover:bg-gray-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 7H21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 12H18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 17H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Filters
                </button>

                {/* Dropdown Panel */}
                <div className="absolute left-0 invisible z-20 p-4 mt-2 space-y-4 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:visible">
                  {/* Status Filter */}
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-400">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="px-3 py-2 w-full text-sm text-gray-200 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Field Filter */}
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-400">
                      Field
                    </label>
                    <select
                      value={fieldFilter}
                      onChange={handleFieldFilterChange}
                      className="px-3 py-2 w-full text-sm text-gray-200 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">All Fields</option>
                      <option value="Trading">Trading</option>
                      <option value="Research">Research</option>
                      <option value="SWE">SWE</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Work Mode Filter */}
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-400">
                      Work Mode
                    </label>
                    <select
                      value={workModeFilter}
                      onChange={handleWorkModeFilterChange}
                      className="px-3 py-2 w-full text-sm text-gray-200 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">All Work Modes</option>
                      <option value="On-Site">On-Site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  {/* We can add more filter categories here */}
                  <div className="pt-2 border-t border-gray-700">
                    <button
                      className="w-full px-3 py-1.5 text-xs text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={() => {
                        // Reset all filters
                        setStatusFilter("");
                        setFieldFilter("");
                        setWorkModeFilter("");
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Add Button - ChatGPT style */}
              <button
                onClick={handleFormToggle}
                className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-white whitespace-nowrap bg-green-500 rounded-md transition-colors hover:bg-green-600"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                New application
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 space-x-2 text-sm font-bold">
          <h2 className="mb-2 text-xl font-bold text-gray-200 sm:text-2xl sm:mb-0">
            Tracking Applications
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-600 text-gray-400"
                  : "bg-gray-800 text-green-300 hover:bg-gray-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-green-400 text-black"
                      : "bg-gray-800 text-green-300 hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-600 text-gray-400"
                  : "bg-gray-800 text-green-300 hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* FORM FOR ADD/EDIT */}

        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4"
          >
            <h2 className="mb-2 text-xl font-bold text-center text-gray-100">
              {editMode ? "Edit Application" : "Add a New Application"}
            </h2>
            {!editMode && (
              <p className="mb-4 text-sm text-center text-gray-400">
                Only these fields are required. You can add more details later!
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="relative z-10 px-4 py-4 space-y-4 bg-gray-800 rounded-lg shadow-lg"
            >
              <button
                type="button"
                onClick={handleFormClose}
                className="absolute top-0 right-0 p-4 text-gray-400 hover:text-red-600"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Minimal Fields: Company, Position, Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Citadel"
                    className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Position <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={form.position}
                    onChange={handleInputChange}
                    placeholder="e.g. Summer Analyst"
                    className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Status - includes "Not Applied" */}
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Step 2: Additional fields if user chooses "Add More Info" */}
              {!editMode && !showMoreInfo && (
                <div className="flex justify-end items-center mt-4 space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.field || form.field.trim() === "") {
                        setForm((prev) => ({ ...prev, field: "Unspecified" }));
                      }
                      handleSubmit(
                        new MouseEvent("click", {
                          bubbles: true,
                          cancelable: true,
                        })
                      );
                    }}
                    className="px-4 py-1 font-semibold text-white bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
                  >
                    Skip & Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMoreInfo(true)}
                    className="px-4 py-1 font-semibold text-black bg-green-400 rounded-lg border-2 border-green-400 shadow-sm hover:text-green-400 hover:bg-black"
                  >
                    Add More Info
                  </button>
                </div>
              )}

              {(editMode || showMoreInfo) && (
                <>
                  {/* Additional fields (dateOfSubmission, deadlineDate, field, etc.) */}
                  <div className="grid grid-cols-1 gap-4 pt-4 mt-6 border-t-2 border-gray-700 md:grid-cols-2 lg:grid-cols-3">
                    {/* Date of Submission */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Submission Date
                      </label>
                      <input
                        type="date"
                        name="dateOfSubmission"
                        value={form.dateOfSubmission}
                        onChange={handleInputChange}
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Deadline
                      </label>
                      <input
                        type="date"
                        name="deadlineDate"
                        value={form.deadlineDate}
                        onChange={handleInputChange}
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      />
                    </div>

                    {/* Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Field
                      </label>
                      <select
                        name="field"
                        value={form.field}
                        onChange={handleInputChange}
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select Field</option>
                        <option value="Trading">Trading</option>
                        <option value="Research">Research</option>
                        <option value="SWE">SWE</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Machine Learning">
                          Machine Learning
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Cover Letter
                      </label>
                      <select
                        name="coverLetter"
                        value={form.coverLetter}
                        onChange={handleInputChange}
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      >
                        <option value="No Cover Letter">No Cover Letter</option>
                        <option value="Cover Letter Submitted">
                          Submitted
                        </option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleInputChange}
                        placeholder="e.g. NYC, Remote"
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      />
                    </div>

                    {/* Work Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200">
                        Work Mode
                      </label>
                      <select
                        name="workMode"
                        value={form.workMode}
                        onChange={handleInputChange}
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select Work Mode</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-200">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any additional details, interview notes, etc."
                        className="px-3 py-2 mt-1 w-full text-green-400 bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* Final Confirm Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 py-1 font-bold text-black bg-green-400 rounded-lg border-2 border-green-400 shadow-sm hover:text-green-400 hover:bg-black hover:shadow-lg group"
                    >
                      <FaPlus className="mr-2 transition-all duration-500 group-hover:-rotate-180" />
                      {editMode ? "Save Changes" : "Add"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        )}

        {showInterviewForm && selectedApplicationForInterview && (
          <InterviewForm
            applicationId={selectedApplicationForInterview._id}
            company={selectedApplicationForInterview.company}
            position={selectedApplicationForInterview.position}
            onClose={() => {
              setShowInterviewForm(false);
              setSelectedApplicationForInterview(null);
            }}
            onSuccess={handleInterviewSuccess}
          />
        )}

        {/* TABLE DISPLAY */}
        <div className="flex-col justify-center mt-6">
          {currentApplications.length === 0 &&
          filteredApplications.length === 0 ? (
            <div className="text-center text-gray-400">
              No applications submitted yet. Go apply to an internship now!
            </div>
          ) : (
            <>
              {/* Table for large screens */}
              <div className="hidden overflow-auto relative z-10 w-full rounded-t-md shadow-lg lg:block bg-gray-950">
                <table className="min-w-full bg-gray-900 rounded-lg border-2 border-gray-700">
                  <thead>
                    <tr className="text-green-400 bg-gray-800">
                      {[
                        { main: "Company", sub: "Position" },
                        { main: "Deadline", sub: "Submission Date" },
                        { main: "Status", sub: "Application Info" },
                        { main: "Location", sub: "Work Mode" },
                        { main: "Actions" },
                      ].map(({ main, sub }) => (
                        <th
                          key={main}
                          className="p-4 font-extrabold text-left whitespace-nowrap text-md"
                        >
                          <div className="flex flex-col">
                            <span className="text-green-400 text-md">
                              {main}
                            </span>
                            {sub && (
                              <span className="text-sm font-medium text-gray-400">
                                {sub}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {currentApplications.map((application) => (
                      <React.Fragment key={application._id}>
                        <tr className="border-t border-gray-700">
                          {/* 1) Combined Company / Position / Field */}
                          <td className="p-4 font-medium text-gray-300 border-r border-gray-700 text-md xl:text-lg last:border-r-0">
                            <div className="flex flex-col items-start space-y-1">
                              <div className="flex-row items-center xl:space-x-2">
                                <span className="font-bold">
                                  {application.company || "N/A"}
                                </span>
                                {/* Field Tag */}
                                <div
                                  className={`inline-flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap ${getFieldColor(
                                    application.field
                                  )}`}
                                >
                                  {getFieldIcon(application.field)}
                                  <span className="ml-2 font-bold">
                                    {application.field || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {application.position || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* 2) Combined Submission / Deadline */}
                          <td className="p-4 text-sm font-medium text-gray-300 border-r border-gray-700 last:border-r-0">
                            {/* Deadline Date */}
                            <div
                              className={`px-2 py-1 font-semibold rounded-md inline-block ${
                                application.deadlineDate
                                  ? getDeadlineColor(application.deadlineDate)
                                  : "bg-gray-700 text-white"
                              }`}
                            >
                              {dayjs(application.deadlineDate).isValid()
                                ? dayjs(application.deadlineDate).format(
                                    "MMM D, YYYY (ddd)"
                                  )
                                : "No Deadline"}
                            </div>
                            {/* Submission Date */}
                            <div className="mt-2 text-xs font-semibold text-gray-400">
                              {dayjs(application.dateOfSubmission).isValid()
                                ? dayjs(application.dateOfSubmission).format(
                                    "MMM D, YYYY (ddd)"
                                  )
                                : "No Submission Date"}
                            </div>
                          </td>

                          {/* 3) Status + Cover Letter Info */}
                          <td className="p-4 text-sm font-semibold border-r border-gray-700 last:border-r-0">
                            <div
                              className={`flex w-min whitespace-nowrap items-center px-2 py-1 space-x-2 rounded-md text-black ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {/* Status Icon */}
                              <span className="text-sm font-bold whitespace-nowrap">
                                {application.status || "N/A"}
                              </span>
                              {getStatusIcon(application.status)}
                            </div>

                            <div
                              className={`mt-2 text-xs font-medium ${getCoverLetterColor(
                                application.coverLetter
                              )}`}
                            >
                              <span className="text-gray-400">
                                Cover Letter:
                              </span>{" "}
                              {simplifyCoverLetter(application.coverLetter)}
                            </div>
                          </td>

                          {/* 4) Location + Work Mode */}
                          <td className="p-4 text-sm font-medium text-gray-300 border-r border-gray-700 last:border-r-0">
                            <div className="flex flex-col items-start space-y-1">
                              <span className="font-bold">
                                {application.location || "N/A"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {application.workMode || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* 5) Actions */}
                          <td className="p-4 text-sm font-medium text-gray-300 last:border-r-0">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAppActionMenuOpen(
                                    appActionMenuOpen === application._id
                                      ? null
                                      : application._id
                                  );
                                }}
                                className="p-2 text-gray-400 rounded-full hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                aria-label="Application options"
                              >
                                <FaEllipsisH className="text-base" />
                              </button>
                              {appActionMenuOpen === application._id && (
                                <div className="absolute right-0 z-[100] mt-2 w-40 bg-gray-700 rounded-md border border-gray-600 shadow-xl">
                                  <ul className="">
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startEdit(application);
                                          setAppActionMenuOpen(null);
                                        }}
                                        className="flex items-center px-3 py-2 w-full text-xs text-yellow-400 hover:bg-gray-600"
                                      >
                                        <FaPencilAlt className="mr-2 text-yellow-400" />
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(application._id);
                                          setAppActionMenuOpen(null);
                                        }}
                                        className="flex items-center px-3 py-2 w-full text-xs text-red-400 hover:bg-gray-600"
                                      >
                                        <FaTrash className="mr-2" />
                                        Delete
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleNotesExpansion(application._id);
                                          setAppActionMenuOpen(null);
                                        }}
                                        className="flex items-center px-3 py-2 w-full text-xs text-blue-400 hover:bg-gray-600"
                                      >
                                        {expandedNotesRow ===
                                        application._id ? (
                                          <>
                                            <TbNotesOff className="mr-2" />
                                            Hide Notes
                                          </>
                                        ) : (
                                          <>
                                            <TbNotes className="mr-2" />
                                            Show Notes
                                          </>
                                        )}
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddInterview(application);
                                          setAppActionMenuOpen(null);
                                        }}
                                        className="flex items-center px-3 py-2 w-full text-xs text-purple-400 hover:bg-gray-600"
                                      >
                                        <FaCalendarPlus className="mr-2" />
                                        Schedule Interview
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Notes Row */}
                        {expandedNotesRow === application._id && (
                          <tr className="border-t border-gray-700">
                            <td
                              colSpan={5}
                              className="px-6 py-4 text-sm font-medium text-gray-300"
                            >
                              <div className="space-y-2">
                                <p>
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {application.notes || "No additional notes."}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table for small screens */}
              <div className="block overflow-auto relative z-10 w-full rounded-lg shadow-lg lg:hidden bg-gray-950">
                <table className="min-w-full bg-gray-900 rounded-lg border-2 border-gray-700">
                  <thead>
                    <tr className="text-green-400 bg-gray-800">
                      {[
                        { main: "Company", sub: "Position" },
                        { main: "Deadline", sub: "Status" },
                        { main: "More Info", sub: "" },
                      ].map(({ main, sub }) => (
                        <th
                          key={main}
                          className="p-4 font-extrabold text-left whitespace-nowrap text-md"
                        >
                          <div className="flex flex-col">
                            <span className="text-green-400 text-md">
                              {main}
                            </span>
                            {sub && (
                              <span className="text-sm font-medium text-gray-400">
                                {sub}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplications.map((application) => (
                      <React.Fragment key={application._id}>
                        <tr className="border-t-2 border-gray-700">
                          {/* Combined "Company" and "Position" columns */}
                          <td className="p-4 text-sm font-medium text-gray-300 border-r-2 border-gray-700">
                            <div className="flex flex-col">
                              <span className="font-bold">
                                {application.company}
                              </span>
                              <span className="text-xs text-gray-400">
                                {application.position}
                              </span>
                              <span className="mt-1">
                                <div
                                  className={`inline-flex text-xs items-center whitespace-nowrap px-2 py-1 rounded-md ${getFieldColor(
                                    application.field
                                  )}`}
                                >
                                  {getFieldIcon(application.field)}
                                  <span className="ml-2 font-bold">
                                    {application.field || "N/A"}
                                  </span>
                                </div>
                              </span>
                            </div>
                          </td>

                          {/* Deadline + Status */}
                          <td className="flex flex-col p-4 text-sm font-medium text-gray-300 border-gray-700 last:border-r-0">
                            <div className="text-sm font-semibold whitespace-nowrap rounded-md">
                              {dayjs(application.deadlineDate).format(
                                "MMM D, YYYY (ddd)"
                              )}
                            </div>
                            <p className="text-xs font-medium text-gray-500">
                              <span className="font-semibold text-gray-400">
                                Applied:
                              </span>{" "}
                              {dayjs(application.dateOfSubmission).format(
                                "MMM D, YYYY"
                              )}
                            </p>
                            <div
                              className={`flex items-center mt-1 px-2 py-1 text-xs space-x-1 rounded-md text-black ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusIcon(application.status)}
                              <span className="font-bold">
                                {application.status}
                              </span>
                            </div>
                          </td>

                          {/* More Info */}
                          <td className="p-4 text-sm font-medium tracking-tighter text-center text-gray-300 border-l-2 border-gray-700">
                            <button
                              onClick={() =>
                                toggleRowExpansion(application._id)
                              }
                              className="text-blue-400 transition duration-150 hover:text-blue-600"
                            >
                              {expandedRow === application._id
                                ? "Show Less"
                                : "More Info"}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === application._id && (
                          <tr className="border-t border-gray-700">
                            <td
                              colSpan={3}
                              className="px-6 py-4 text-sm font-medium text-gray-300"
                            >
                              <div className="space-y-2">
                                <p>
                                  <span className="font-semibold">
                                    Submission Date:
                                  </span>{" "}
                                  {dayjs(application.dateOfSubmission).format(
                                    "MMM D, YYYY"
                                  )}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Location:
                                  </span>{" "}
                                  {application.location}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Cover Letter:
                                  </span>{" "}
                                  {simplifyCoverLetter(application.coverLetter)}
                                </p>
                                <p>
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {application.notes}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Work Mode:
                                  </span>{" "}
                                  {application.workMode || "N/A"}
                                </p>
                                <div className="flex space-x-2">
                                  {/* Edit & Delete in small screen */}
                                  <button
                                    onClick={() => startEdit(application)}
                                    className="text-blue-400 transition duration-150 hover:text-blue-600"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(application._id)
                                    }
                                    className="text-red-400 transition duration-150 hover:text-red-600"
                                  >
                                    <FaTrash className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
