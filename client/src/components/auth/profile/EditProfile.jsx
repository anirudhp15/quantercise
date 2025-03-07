import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useUser } from "../../../contexts/userContext";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { FaCamera, FaCheck, FaSpinner } from "react-icons/fa";
import { SiOpentofu } from "react-icons/si";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth, updateProfile as firebaseUpdateProfile } from "firebase/auth";

const EditProfile = () => {
  const { currentUser } = useAuth();
  const auth = getAuth();
  const { profileColor } = useUser();
  const { lowDetailMode } = useLowDetail();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(currentUser?.photoURL || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoChanged, setPhotoChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Sync local state with current user changes
    setForm({
      displayName: currentUser?.displayName || "",
      email: currentUser?.email || "",
    });
    setPreviewPhoto(currentUser?.photoURL || "");
  }, [currentUser]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.displayName.trim())
      newErrors.displayName = "Display name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5242880) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          photo: "Image must be less than 5MB",
        }));
        return;
      }
      setPhotoFile(file);
      setPreviewPhoto(URL.createObjectURL(file));
      setPhotoChanged(true);
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    setSuccessMessage("");

    try {
      let photoURL = currentUser.photoURL;
      if (photoFile) {
        setIsUploading(true);
        const photoRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
        setIsUploading(false);
      }
      // Update Firebase Auth profile
      await firebaseUpdateProfile(auth.currentUser, {
        displayName: form.displayName,
        photoURL: photoURL,
      });
      // Update profile in backend (e.g., MongoDB)
      await axios.put(`/api/user/${currentUser.uid}`, {
        displayName: form.displayName,
        email: form.email,
        profilePicture: photoURL,
      });
      setSuccessMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setPhotoChanged(false);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.message || "Failed to update profile";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => navigate("/profile");

  return (
    <div className="flex relative justify-center w-full min-h-screen text-gray-300 bg-gradient-to-br from-gray-900 to-gray-900 via-gray-950">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="flex relative z-10 flex-col px-6 py-24 mx-auto w-full max-w-7xl lg:py-32">
        {/* Back Button */}

        {/* Page Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Edit Profile
          </h1>
          <div className="flex items-center mt-2 text-sm">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-green-400"
            >
              Home
            </Link>
            <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
            <span className="text-green-400"> Profile</span>
            <FaChevronRight className="mx-2 w-3 h-3 text-gray-500" />
            <span className="text-green-400">Edit </span>
          </div>
        </motion.div>

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-lg"
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Profile"
                    className="object-cover w-40 h-40 rounded-full border-4 shadow-lg"
                    style={{ borderColor: profileColor }}
                  />
                ) : (
                  <div
                    className="flex justify-center items-center w-40 h-40 rounded-full shadow-lg"
                    style={{ backgroundColor: profileColor || "#6B7280" }}
                  >
                    <SiOpentofu className="w-16 h-16 text-white" />
                  </div>
                )}
                <label
                  htmlFor="photo-upload"
                  className="absolute right-0 bottom-0 p-2 text-black bg-green-500 rounded-full transition cursor-pointer hover:bg-green-600"
                >
                  <FaCamera className="w-4 h-4" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="w-full text-center">
                {isUploading ? (
                  <span className="inline-flex items-center text-blue-400">
                    <FaSpinner className="mr-2 w-4 h-4 animate-spin" />
                    Uploading...
                  </span>
                ) : photoChanged ? (
                  <span className="text-sm text-yellow-400">
                    New photo selected – save to update.
                  </span>
                ) : errors.photo ? (
                  <span className="text-sm text-red-400">{errors.photo}</span>
                ) : (
                  <span className="text-sm text-gray-400">
                    Click the camera icon to change your photo.
                  </span>
                )}
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Display Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your display name"
                  className={`w-full px-4 py-3 font-semibold text-green-400 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.displayName ? "border-2 border-red-500" : ""
                  }`}
                />
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 font-semibold text-green-400 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.email ? "border-2 border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end items-center pt-4 mt-6 space-x-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 font-semibold text-gray-300 bg-gray-700 rounded-lg transition hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className={`inline-flex items-center px-6 py-3 font-bold text-black rounded-lg shadow transition ${
                    isSaving || isUploading
                      ? "opacity-50 cursor-not-allowed bg-green-400"
                      : "bg-green-400 hover:bg-green-500"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="mr-2 w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2 w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

              {/* Success / Error Notifications */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-center text-black bg-green-400 rounded-lg"
                >
                  {successMessage}
                </motion.div>
              )}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-center text-white bg-red-500 rounded-lg"
                >
                  {errors.submit}
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
