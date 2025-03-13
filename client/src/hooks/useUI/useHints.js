import { useState, useCallback } from "react";

export const useHints = () => {
  const [hintsVisible, setHintsVisible] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const showNextHint = useCallback(() => {
    setCurrentHintIndex((prev) => prev + 1);
    setHintsVisible(true);
  }, []);

  return { hintsVisible, currentHintIndex, showNextHint, setHintsVisible };
};
