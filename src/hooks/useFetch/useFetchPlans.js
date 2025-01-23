import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/api/payment/plans");
        setPlans(response.data);
      } catch (err) {
        setError("Failed to fetch plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

export default useFetchPlans;
