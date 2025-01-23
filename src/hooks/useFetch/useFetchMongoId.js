// src/hooks/useFetchMongoId.js
import { useEffect } from "react";

export const useFetchMongoId = (currentUser, setMongoId) => {
  useEffect(() => {
    if (!currentUser) return;

    const fetchMongoId = async () => {
      try {
        const response = await fetch(
          `https://quantercise-api.vercel.app/api/user/mongoId/${currentUser.uid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Mongo ID");
        }

        const data = await response.json();
        setMongoId(data.mongoId);
      } catch (error) {
        console.error("Error fetching Mongo ID:", error);
      }
    };

    fetchMongoId();
  }, [currentUser, setMongoId]);
};
