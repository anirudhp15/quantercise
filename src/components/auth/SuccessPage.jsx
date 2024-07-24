import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/authContext";
import axios from "axios";

const SuccessPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");

      if (!sessionId) {
        navigate("/quantercise/landing");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:4242/verify-checkout-session",
          {
            sessionId,
            userId: currentUser ? currentUser.uid : null,
          }
        );

        if (response.data.success) {
          if (currentUser) {
            navigate("/quantercise/home");
          } else {
            navigate("/register", { state: { sessionId } });
          }
        } else {
          navigate("/quantercise/landing");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        navigate("/quantercise/landing");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [currentUser, navigate, location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default SuccessPage;
