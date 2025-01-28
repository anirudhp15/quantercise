// src/hooks/useFetchMongoId.js
import axios from "axios";
import { useEffect } from "react";

const BACKEND_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

export const useFetchMongoId = (currentUser, setMongoId) => {
  useEffect(() => {
    if (!currentUser) return;

    const fetchMongoId = async () => {
      try {
        const response = await fetch(
          `${BACKEND_DOMAIN}/api/user/mongoId/${currentUser.uid}`
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
