import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/authContext";
import { motion } from "framer-motion";
import { useLowDetail } from "../../../../contexts/LowDetailContext";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { storage } from "../../../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const EditProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(currentUser.photoURL || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { lowDetailMode } = useLowDetail(); // Access the Low Detail Mode
  const navigate = useNavigate();

  useEffect(() => {
    // Keep local state updated if user changes between accounts, etc.
    setDisplayName(currentUser.displayName || "");
    setEmail(currentUser.email || "");
    setPreviewPhoto(currentUser.photoURL || "");
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(e.target.files[0])); // Live preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = currentUser.photoURL;

      // If a new photo is uploaded, store it in Firebase Storage
      if (photoFile) {
        const photoRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update the Firebase Auth profile (displayName & photoURL)
      await updateProfile({ displayName, photoURL });

      // Update the user in your MongoDB via the backend
      // (using profilePicture field to match your backend route)
      await axios.put(`/api/user/${currentUser.uid}`, {
        displayName,
        email,
        profilePicture: photoURL,
      });

      setMessage("Profile updated successfully!");
      // After a brief success message, navigate back to /profile
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen text-gray-300">
      {/* Optional background animation */}
      {!lowDetailMode && <AnimatedGrid2 />}

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-screen-xl p-4 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-green-400"
          >
            Edit Profile
          </motion.h1>
          {/* Close / Cancel Edit Button */}
          <button
            onClick={() => navigate("/profile")}
            className="p-2 text-gray-400 transition duration-300 rounded hover:text-gray-100 hover:bg-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 hover:border-gray-500"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 font-semibold transition duration-300 rounded-lg bg-gradient-to-r from-gray-700 to-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 font-semibold transition duration-300 rounded-lg bg-gradient-to-r from-gray-700 to-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 font-semibold transition duration-300 rounded-lg bg-gradient-to-r from-gray-700 to-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Feedback Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`font-semibold ${
                  message.includes("successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </motion.div>
            )}

            {previewPhoto && (
              <div className="pt-4 mt-4 border-t-2 border-gray-700">
                <p className="mb-1 text-sm font-medium text-gray-400">
                  Preview:
                </p>
                <div className="flex ">
                  <div className="w-40">
                    <img
                      src={previewPhoto}
                      alt="Profile Preview"
                      className="object-cover w-40 h-40 mb-2 rounded-md aspect-square"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-400">
                      {displayName}
                    </p>
                    <p className="mb-2 text-xs text-gray-500">{email}</p>
                    {/* Submit Button */}
                    <div className="flex justify-start">
                      <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        type="submit"
                        disabled={loading}
                        className={`inline-block text-xs lg:text-sm px-2 py-1 font-bold text-black transition duration-300 border-2 rounded-lg shadow-sm ${
                          loading
                            ? "bg-gray-700 border-gray-700 cursor-not-allowed"
                            : "bg-green-400 border-green-400 hover:bg-black hover:text-green-400"
                        }`}
                      >
                        {loading ? "Updating..." : "Save Changes"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
