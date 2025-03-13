import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";

const useFetchUserData = (currentUser) => {
  const [isPro, setIsPro] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userDataResponse = await axios.get(
          `${BACKEND_DOMAIN}/api/user/${currentUser.uid}`
        );

        setIsPro(userDataResponse.data.isPro);

        const storedProblems = userDataResponse.data.progress;
        const completedCount = storedProblems.length;
        setProblemsCompleted(completedCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return { isPro, problemsCompleted };
};

export default useFetchUserData;
