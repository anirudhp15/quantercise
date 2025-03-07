import { useEffect, useState } from "react";
import { fetchProblems } from "../../services/apiService";

const useFetchProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProblems();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { problems, loading, setProblems };
};

export default useFetchProblems;
