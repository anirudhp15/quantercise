// contexts/LowDetailContext.js
import React, { createContext, useState, useContext } from "react";

const LowDetailContext = createContext();

export const useLowDetail = () => useContext(LowDetailContext);

export const LowDetailProvider = ({ children }) => {
  const [lowDetailMode, setLowDetailMode] = useState(true);

  const toggleLowDetailMode = () => {
    setLowDetailMode((prevMode) => !prevMode);
  };

  return (
    <LowDetailContext.Provider value={{ lowDetailMode, toggleLowDetailMode }}>
      {children}
    </LowDetailContext.Provider>
  );
};
