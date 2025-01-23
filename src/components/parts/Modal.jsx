import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-sm p-6 text-center bg-gray-900 rounded-lg shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 text-white bg-gray-600 rounded-lg hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
