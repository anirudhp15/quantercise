import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { TbNotes, TbNotesOff } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  ChevronLast,
  ChevronFirst,
  BarChart,
  BookOpen,
  Activity,
  Edit,
} from "lucide-react";
import AnimatedGrid2 from "../landing/AnimatedGrid2";
import axios from "axios"; // Import Axios
import "../../index.css";
import { LargeSidebar, SidebarItem } from "./LargeSidebar";
import { SmallSidebar } from "./SmallSidebar";
import AuthContext from "../../contexts/authContext";

const Applications = () => {
  const { user } = useContext(AuthContext); // Access logged-in user data
  const [applications, setApplications] = useState([]);
  const { isPro } = useContext(AuthContext);
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
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [smallSidebarExpanded, setSmallSidebarExpanded] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedNotesRow, setExpandedNotesRow] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch applications from MongoDB on component load
  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`/api/applications/user-applications/${user.email}`)
        .then((response) => {
          setApplications(response.data.applications); // Set the applications data from MongoDB
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);
          setError("Error fetching applications. Please try again later.");
          setLoading(false);
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Save application to MongoDB
  const handleSubmit = (e) => {
    e.preventDefault();
    const newApplication = { ...form, dateOfSubmission: new Date() };

    axios
      .post("/api/applications/add-application", {
        email: user.email,
        application: newApplication,
      })
      .then((response) => {
        setApplications(response.data.applications); // Update local state
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
        });
      })
      .catch((error) => {
        console.error("Error adding application:", error);
        setError("Error saving application. Please try again.");
      });
  };

  // Edit existing application
  const handleEdit = (id) => {
    const application = applications.find((app) => app.id === id);
    setForm(application);
    setIsFormOpen(true);
    setEditMode(true);
    setCurrentId(id);
  };

  // Delete application from MongoDB
  const handleDelete = (id) => {
    axios
      .post("/api/applications/delete-application", { id, email: user.email })
      .then((response) => {
        setApplications(response.data.applications); // Update state
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
        setError("Error deleting application. Please try again.");
      });
  };

  // Render loading, error, or the actual applications list
  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  const handleFormToggle = () => {
    setIsFormOpen(!isFormOpen);
    setEditMode(false);
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
    });
    setCurrentId(null);
    setSmallSidebarExpanded(false); // Close SmallSidebar when form is toggled
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditMode(false);
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
    });
    setCurrentId(null);
  };

  const formatDefaultDate = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD") : "";
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleNotesExpansion = (id) => {
    setExpandedNotesRow(expandedNotesRow === id ? null : id);
  };

  return (
    <div className="relative flex min-h-screen text-gray-300 bg-gray-900">
      <AnimatedGrid2 />
      <div className="absolute inset-0 bg-black z-5 bg-opacity-90" />
      <LargeSidebar expanded={expanded} setExpanded={setExpanded}>
        <SidebarItem
          className="group"
          icon={
            <FaArrowLeftLong className="transition-all duration-200 group-hover:-translate-x-1" />
          }
          text="Home"
          link="/home"
        />
        <div className="border-t border-gray-700" />
        <div className="mt-4 space-y-2">
          <SidebarItem
            className="group"
            icon={
              <FaPlus className="transition-all duration-200 group-hover:rotate-90" />
            }
            text="Add New Application"
            onClick={handleFormToggle}
          />
        </div>
        <div className="mt-4 border-t border-gray-700" />
        <div className="mt-4 space-y-2">
          <SidebarItem
            icon={<BookOpen />}
            text="Practice Problems"
            link="/practice-problems"
          />
          <SidebarItem icon={<Activity />} text="Progress" link="/progress" />
          <SidebarItem icon={<BarChart />} text="Analytics" link="/analytics" />
        </div>
        <div className="mt-4 border-t border-gray-700" />
      </LargeSidebar>
      <SmallSidebar
        expanded={smallSidebarExpanded}
        setExpanded={setSmallSidebarExpanded}
      >
        <SidebarItem icon={<FaArrowLeftLong />} text="Home" link="/home" />
        <div className="border-t border-gray-700" />
        <div className="mt-4 space-y-2">
          <SidebarItem
            icon={<FaPlus />}
            text="Add New Application"
            onClick={handleFormToggle}
          />
        </div>
        <div className="mt-4 border-t border-gray-700" />
        <div className="mt-4 space-y-2">
          <SidebarItem
            icon={<BookOpen />}
            text="Practice Problems"
            link="/practice-problems"
          />
          <SidebarItem icon={<Activity />} text="Progress" link="/progress" />
          <SidebarItem icon={<BarChart />} text="Analytics" link="/analytics" />
        </div>
        <div className="mt-4 border-t border-gray-700" />
      </SmallSidebar>
      <div className="relative z-10 flex-grow p-8">
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`mb-6 ml-8 text-4xl font-bold text-left ${
            isPro
              ? "text-blue-400 hover:text-blue-300"
              : "text-green-400 hover:text-green-300"
          }`}
        >
          Applications
        </motion.h1>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative z-10 px-4 py-2 space-y-4 border-2 border-gray-700 rounded-lg shadow-lg bg-gray-950"
            >
              <button
                type="button"
                onClick={handleFormClose}
                className="absolute top-0 right-0 p-4 text-gray-400 hover:text-red-600"
              >
                <FaTimes />
              </button>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
                {[
                  { label: "Company", name: "company", type: "text" },
                  { label: "Position", name: "position", type: "text" },
                  {
                    label: "Submission Date",
                    name: "dateOfSubmission",
                    type: "date",
                  },
                  { label: "Deadline", name: "deadlineDate", type: "date" },
                  { label: "Status", name: "status", type: "select" },
                  { label: "Field", name: "field", type: "select" },
                  { label: "Location", name: "location", type: "text" },
                  {
                    label: "Cover Letter",
                    name: "coverLetter",
                    type: "select",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-green-400 border border-gray-600 rounded-lg shadow-sm bg-gray-950 focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select {field.label}</option>
                        {field.name === "status" && (
                          <>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </>
                        )}
                        {field.name === "field" && (
                          <>
                            <option value="Trading">Trading</option>
                            <option value="Research">Research</option>
                            <option value="SWE">SWE</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                        {field.name === "coverLetter" && (
                          <>
                            <option value="No Cover Letter">
                              No Cover Letter
                            </option>
                            <option value="Cover Letter Submitted">
                              Cover Letter Submitted
                            </option>
                            <option value="In Progress">In Progress</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-green-400 bg-gray-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:bg-gray-950"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="This is where you can note the department, any network/people you know associated with the role, interview process, etc."
                  className="w-full px-3 py-2 mt-1 text-green-400 bg-gray-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 my-4 font-bold text-black transition-all duration-300 bg-green-500 rounded-lg shadow-sm hover:scale-105 hover:text-white hover:bg-green-400 hover:shadow-lg"
                >
                  <FaPlus className="mr-2" />{" "}
                  {editMode ? "Save Changes" : "Add Application"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        <div className="flex justify-center mt-6">
          {applications.length === 0 ? (
            <div className="text-center text-gray-400">
              No applications submitted yet. Go apply to an internship now!
            </div>
          ) : (
            <>
              {/* Table for large screens */}
              <div className="relative z-10 hidden w-full overflow-auto rounded-lg shadow-lg lg:block bg-gray-950">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr className="text-green-400 bg-gray-800">
                      {[
                        "Company",
                        "Position",
                        "Status",
                        "Submission Date",
                        "Deadline",
                        "Field",
                        "Location",
                        "Cover Letter",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-sm font-medium text-left"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <React.Fragment key={application.id}>
                        <tr className="border-t border-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.company}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.position}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.status}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {dayjs(application.dateOfSubmission).format(
                              "MMMM D, YYYY"
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {dayjs(application.deadlineDate).format(
                              "MMMM D, YYYY"
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.field}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.location}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.coverLetter}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(application.id)}
                                className="text-blue-400 transition duration-150 hover:text-blue-600"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(application.id)}
                                className="text-red-400 transition duration-150 hover:text-red-600"
                              >
                                <FaTrash className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  toggleNotesExpansion(application.id)
                                }
                                className="text-gray-200 transition duration-150 hover:text-gray-500 whitespace-nowrap"
                              >
                                {expandedNotesRow === application.id ? (
                                  <TbNotesOff className="w-5 h-5" />
                                ) : (
                                  <TbNotes className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedNotesRow === application.id && (
                          <tr className="border-t border-gray-700">
                            <td
                              colSpan={9}
                              className="px-6 py-4 text-sm font-medium text-gray-300"
                            >
                              <div className="space-y-2">
                                <p>
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {application.notes}
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
              <div className="relative z-10 block w-full overflow-auto rounded-lg shadow-lg lg:hidden bg-gray-950">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr className="text-green-400 bg-gray-800">
                      {["Company", "Position", "Status", "More Info"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-sm font-medium text-left"
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <React.Fragment key={application.id}>
                        <tr className="border-t border-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.company}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.position}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.status}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            <button
                              onClick={() => toggleRowExpansion(application.id)}
                              className="text-blue-400 transition duration-150 hover:text-blue-600"
                            >
                              {expandedRow === application.id
                                ? "Show Less"
                                : "More Info"}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === application.id && (
                          <tr className="border-t border-gray-700">
                            <td
                              colSpan={4}
                              className="px-6 py-4 text-sm font-medium text-gray-300"
                            >
                              <div className="space-y-2">
                                <p>
                                  <span className="font-semibold">
                                    Submission Date:
                                  </span>{" "}
                                  {dayjs(application.dateOfSubmission).format(
                                    "MMMM D, YYYY"
                                  )}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Deadline:
                                  </span>{" "}
                                  {dayjs(application.deadlineDate).format(
                                    "MMMM D, YYYY"
                                  )}
                                </p>
                                <p>
                                  <span className="font-semibold">Field:</span>{" "}
                                  {application.field}
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
                                  {application.coverLetter}
                                </p>
                                <p>
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {application.notes}
                                </p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(application.id)}
                                    className="text-blue-400 transition duration-150 hover:text-blue-600"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(application.id)}
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
