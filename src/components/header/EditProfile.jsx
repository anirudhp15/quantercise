import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";

const EditProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName, photoURL });
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6 mt-16">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-green-400 py-4">Edit Profile</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-lg py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Photo URL
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="mt-1 block w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-lg py-2 px-3"
              />
            </div>
            {message && <p className="text-green-400">{message}</p>}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
