import React from "react";

const SquigglyPlaceholder = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="w-full h-2 bg-gray-500 rounded-lg animate-pulse"
          style={{
            width: `${Math.random() * (90 - 60) + 60}%`, // Random width for variability
          }}
        />
      ))}
    </div>
  );
};

export default SquigglyPlaceholder;
