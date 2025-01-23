import React, { useState } from "react";
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

      if (photoFile) {
        const photoRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update Firebase profile
      await updateProfile({ displayName, photoURL });

      // Update MongoDB profile
      await axios.put(`http://localhost:4242/api/user/${currentUser.uid}`, {
        displayName,
        email,
        photoURL,
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full min-h-screen text-gray-300 ">
      {!lowDetailMode && <AnimatedGrid2 />}
      <div className="relative z-10 w-full max-w-screen-md mx-auto">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-4 text-3xl font-bold text-center text-green-400"
          >
            Edit Profile
          </motion.h1>
          <button
            className="text-gray-400 transition duration-300 hover:text-gray-300"
            onClick={() => navigate("/profile")}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-gray-800 rounded-lg shadow-lg"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center space-y-4"
          >
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full px-3 py-2 mt-1 font-semibold text-gray-300 transition duration-300 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 font-semibold text-gray-300 transition duration-300 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {/* Profile Picture */}
            <div className="pb-2">
              <label className="block text-sm font-medium text-gray-400">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full px-3 py-2 mt-1 font-semibold text-gray-300 transition duration-300 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              {previewPhoto && (
                <img
                  src={previewPhoto}
                  alt="Profile Preview"
                  className="object-cover w-32 h-32 mt-4 rounded-lg"
                />
              )}
            </div>
            {/* Feedback Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`${
                  message.includes("successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </motion.p>
            )}
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-min whitespace-nowrap px-4 py-2 font-bold text-white transition duration-300 rounded-lg ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Updating..." : "Save Changes"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
