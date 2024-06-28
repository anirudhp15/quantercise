import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { motion } from "framer-motion";
import { storage } from "../../firebase/firebase"; // Import storage from firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary functions from Firebase Storage
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { FaTimes } from "react-icons/fa"; // Import close icon

const EditProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = currentUser.photoURL;

      if (photoFile) {
        const photoRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      await updateProfile({ displayName, photoURL });
      setMessage("Profile updated successfully!");
      navigate("/profile"); // Navigate back to the profile page upon success
    } catch (error) {
      setMessage("Failed to update profile: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-4 mt-16 text-gray-300 bg-gray-900 sm:p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center justify-between mb-4">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full px-3 py-2 mt-1 text-gray-300 transition duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full px-3 py-2 mt-1 text-gray-300 transition duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-400"
              >
                {message}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700 sm:w-auto"
            >
              Save Changes
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
