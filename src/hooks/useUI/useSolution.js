import { useState } from "react";

export const useSolution = () => {
  const [solutionVisible, setSolutionVisible] = useState(false);

  return { solutionVisible, setSolutionVisible };
};
