import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import { TbNotes, TbNotesOff } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { BarChart, BookOpen, Activity, Edit } from "lucide-react";
import AnimatedGrid2 from "../landing/animatedGrid/AnimatedGrid2";
import axios from "axios"; // Import Axios
import "../../../index.css";
import SmallSidebar from "../../parts/sidebar/SmallSidebar";
import LargeSidebar from "../../parts/sidebar/LargeSidebar";
import AuthContext from "../../../contexts/authContext";

// Define your domain
const YOUR_DOMAIN =
  process.env.YOUR_DOMAIN || "https://quantercise-api.vercel.app";

const Applications = () => {
  const { currentUser, isPro } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [smallSidebarExpanded, setSmallSidebarExpanded] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedNotesRow, setExpandedNotesRow] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch applications from MongoDB on component load
  useEffect(() => {
    console.log("User:", currentUser);
    if (currentUser && currentUser.email) {
      axios
        .get(
          `https://quantercise-api.vercel.app/api/applications/user-applications/${currentUser.email}`
        )
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
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Save application to MongoDB
  const handleSubmit = (e) => {
    e.preventDefault();
    const newApplication = { ...form, dateOfSubmission: new Date() };

    if (!currentUser || !currentUser.email) {
      console.error("User is not logged in or email is missing.");
      setError("User is not logged in or email is missing.");
      return;
    }

    axios
      .post(
        "https://quantercise-api.vercel.app/api/applications/add-application",
        {
          email: currentUser.email,
          application: newApplication,
        }
      )
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
      .post(
        "https://quantercise-api.vercel.app/api/applications/delete-application",
        {
          id,
          email: currentUser.email,
        }
      )
      .then((response) => {
        setApplications(response.data.applications); // Update state
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
        setError("Error deleting application. Please try again.");
      });
  };

  // // Render loading, error, or the actual applications list
  // if (loading) return <p>Loading applications...</p>;
  // if (error) return <p>{error}</p>;

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

  const statusColors = {
    Applied: "bg-blue-400",
    Interviewing: "bg-yellow-400",
    Offered: "bg-green-400",
    Rejected: "bg-red-400",
    Default: "bg-gray-700", // Fallback color
  };

  const getStatusColor = (status) =>
    statusColors[status] || statusColors.Default;

  const getDeadlineColor = (deadline) => {
    const today = dayjs();
    const diff = dayjs(deadline).diff(today, "days");
    if (diff < 0) return "bg-red-500 text-white"; // Overdue
    if (diff <= 7) return "bg-yellow-400 text-black"; // Due soon
    return "bg-green-400 text-black"; // Safe
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredApplications = applications.filter((application) => {
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
        ? dayjs(application.deadlineDate).format("MMM D, YYYY").toLowerCase()
        : "",
    ];
    return searchFields.some((field) => field.includes(searchTerm));
  });

  return (
    <div className="relative flex min-h-screen text-gray-300 bg-gray-900">
      <div className="absolute inset-0 bg-black z-5 bg-opacity-90" />
      <LargeSidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      {/* <LargeSidebar expanded={expanded} setExpanded={setExpanded}>
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
            text="Add Application"
            onClick={handleFormToggle}
          />
        </div>
        <div className="mt-4 border-t border-gray-700" />
        <div className="mt-4 space-y-2">
          <SidebarItem
            icon={<BookOpen />}
            text="Problems"
            link="/practice-problems"
          />
          <SidebarItem icon={<Activity />} text="Progress" link="/progress" />
          <SidebarItem icon={<BarChart />} text="Analytics" link="/analytics" />
        </div>
        <div className="mt-4 border-t border-gray-700" />
      </LargeSidebar> */}

      <div className="relative z-10 flex-grow p-8">
        <motion.h1
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`mb-6 ml-8 text-4xl font-black text-left ${
            isPro
              ? "text-blue-400 hover:text-blue-300"
              : "text-green-400 hover:text-green-300"
          }`}
        >
          Applications
        </motion.h1>
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="relative flex items-center w-full max-w-md bg-gray-800 border-4 border-gray-700 rounded-lg">
            <Input
              className="flex w-full h-min"
              placeholder="Search your applications..."
              variant="outlined"
              allowClear
              enterButton
              onChange={handleSearch}
              style={{
                maxHeight: 40,
                height: 32,
                border: "2px solid #9ca3af",
              }}
            />
            <FaSearch className="absolute text-gray-500 right-4" />
          </div>
          <button
            onClick={handleFormToggle}
            className="flex items-center px-3 py-1 font-bold text-black bg-green-400 border-2 border-green-400 rounded-lg shadow-sm whitespace-nowrap hover:text-green-400 hover:bg-black hover:shadow-lg"
          >
            <FaPlus className="mr-2" /> Add Application
          </button>
        </div>

        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative z-10 px-4 py-2 space-y-4 border-2 border-gray-700 rounded-md shadow-lg bg-gray-950"
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
                  className="inline-flex items-center px-6 py-2 my-4 font-bold text-green-400 border-2 border-green-400 rounded-lg shadow-sm hover:bg-green-400 hover:text-black hover:shadow-lg group"
                >
                  <FaPlus className="mr-2 transition-all duration-500 group-hover:-rotate-180" />{" "}
                  {editMode ? "Save Changes" : "Add Application"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        <div className="flex justify-center mt-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center text-gray-400">
              No applications submitted yet. Go apply to an internship now!
            </div>
          ) : (
            <>
              {/* Table for large screens */}
              <div className="relative z-10 hidden w-full overflow-auto shadow-lg rounded-t-md lg:block bg-gray-950">
                <table className="min-w-full bg-gray-900 border-2 border-gray-700">
                  <thead>
                    <tr className="text-green-400 bg-gray-800">
                      {[
                        "COMPANY",
                        "ROLE",
                        "STATUS",
                        "SUBMIT DATE",
                        "DEADLINE",
                        "FIELD",
                        "LOCATION",
                        "COVER LETTER",
                        "ACTIONS",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-2 py-3 text-sm font-black text-center"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <React.Fragment key={application.id}>
                        <tr className="border-t border-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-700 last:border-r-0">
                            {application.company}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center text-gray-300 border-r border-gray-700 last:border-r-0">
                            {application.position}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-center text-black border-r border-gray-700 last:border-r-0">
                            <div
                              className={`p-2 rounded-md ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center text-gray-300 border-r border-gray-700 whitespace-nowrap last:border-r-0">
                            {dayjs(application.dateOfSubmission).format(
                              "MMM D, YYYY (ddd)"
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm font-medium text-center text-gray-300 border-r border-gray-700 last:border-r-0">
                            <div
                              className={`p-2 text-sm whitespace-nowrap rounded-md font-semibold text-center ${getDeadlineColor(
                                application.deadlineDate
                              )}`}
                            >
                              {dayjs(application.deadlineDate).format(
                                "MMM D, YYYY (ddd)"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center text-gray-300 border-r border-gray-700 last:border-r-0">
                            {application.field}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center text-gray-300 border-r border-gray-700 last:border-r-0">
                            {application.location}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center text-gray-300 border-r border-gray-700 last:border-r-0">
                            {application.coverLetter}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300 last:border-r-0">
                            <div className="flex justify-center space-x-2">
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
                            className="p-4 text-sm font-medium text-left whitespace-nowrap"
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <React.Fragment key={application.id}>
                        <tr className="border-t border-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.company}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">
                            {application.position}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-center text-black border-r border-gray-700 last:border-r-0">
                            <div
                              className={`p-2 rounded-md ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </div>
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
                                    "MMM D, YYYY"
                                  )}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Deadline:
                                  </span>{" "}
                                  {dayjs(application.deadlineDate).format(
                                    "MMM D, YYYY"
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
