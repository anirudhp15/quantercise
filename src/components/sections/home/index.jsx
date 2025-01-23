import React, { useState, useEffect, useCallback } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGrid2 from "../landing/animatedGrid/AnimatedGrid2";
import { ReactTyped } from "react-typed";
import axios from "axios";
import "../../../index.css";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import useFetchUserData from "../../../hooks/useFetch/useFetchUserData";
import SectionCard from "./SectionCard";

const Home = React.memo(() => {
  const { currentUser } = useAuth();
  const { lowDetailMode } = useLowDetail();

  const [showOverlay, setShowOverlay] = useState(false);
  const { isPro, problemsCompleted } = useFetchUserData(currentUser);

  console.log("Problems completed:", problemsCompleted);
  console.log("Is Pro:", isPro);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const getIntroMessage = useCallback(() => {
    if (problemsCompleted === 0) {
      return "Welcome! Ready to dive into quantitative finance? Let's get started!";
    } else if (problemsCompleted <= 10) {
      return "Great to see you back! Keep pushing through those problems!";
    } else if (problemsCompleted <= 50) {
      return "Impressive progress! You're getting closer to mastering quant finance.";
    } else if (problemsCompleted <= 100) {
      return "Fantastic work! Your dedication is paying off.";
    } else {
      return "You're a quant finance wizard! Keep up the excellent work.";
    }
  }, [problemsCompleted]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-wrapper">
      <div className="relative flex items-center justify-center w-full h-auto min-h-screen px-4 text-gray-300 bg-gradient-to-b from-black via-gray-900 to-black">
        {!lowDetailMode && <AnimatedGrid2 />}
        <div className="relative z-10 flex flex-col justify-center py-24 mx-auto max-w-screen-2xl">
          <div className="text-3xl font-black text-center text-transparent lg:text-left sm:text-4xl md:text-5xl animate-gradient gradient-text">
            <div className="h-14">
              <ReactTyped
                strings={["lets quantercise!"]}
                typeSpeed={100}
                backSpeed={60}
                startDelay={500}
                showCursor={false}
              />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
          >
            <p className="mt-2 text-lg font-light text-center lg:text-left">
              {getIntroMessage()}
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
            className="grid grid-cols-1 gap-4 my-8 lg:grid-cols-5 sm:gap-6"
          >
            <SectionCard
              title="Problems"
              description="Access a variety of quant interview problems to improve your skills."
              buttonText="Start Practicing"
              link="/practice-problems"
              textColor={"text-green-400"}
              bgColor={"bg-green-400"}
              hoverColor={"hover:text-green-400"}
              buttonBorderColor={"border-green-400"}
              columnSpan={"lg:col-span-2"}
            />
            <SectionCard
              title="Track Progress"
              description={
                problemsCompleted === 0 ? (
                  <span>
                    No problems completed yet. View practice problems to get
                    started!
                  </span>
                ) : problemsCompleted === 1 ? (
                  <span>
                    You've completed 1 problem so far. Try working on some new
                    questions!
                  </span>
                ) : (
                  <span>
                    You've completed {problemsCompleted} problems so far. Great
                    work, keep up the momentum!
                  </span>
                )
              }
              buttonText="View Progress"
              link="/progress"
              textColor={"text-blue-400"}
              bgColor={"bg-blue-400"}
              hoverColor={"hover:text-blue-400"}
              buttonBorderColor={"border-blue-400"}
              columnSpan={"lg:col-span-3"}
            />

            {isPro && (
              <SectionCard
                title="Analytics"
                description="Track your performance and identify areas for improvement."
                buttonText="View Analytics"
                link="/analytics"
                textColor={"text-purple-400"}
                bgColor={"bg-purple-400"}
                hoverColor={"hover:text-purple-400"}
                buttonBorderColor={"border-purple-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}
            {isPro && (
              <SectionCard
                title="Applications"
                description="Keep track of your internship/job applications and upcoming interviews."
                buttonText="View Applications"
                link="/applications"
                textColor={"text-sky-400"}
                bgColor={"bg-sky-400"}
                hoverColor={"hover:text-sky-400"}
                buttonBorderColor={"border-sky-400"}
                columnSpan={"lg:col-span-2"}
              />
            )}
            <SectionCard
              title="Profile Settings"
              description="Update your profile information and account settings."
              buttonText="View Profile"
              link="/profile"
              textColor={"text-gray-400"}
              bgColor={"bg-gray-400"}
              hoverColor={"hover:text-gray-400"}
              buttonBorderColor={"border-gray-400"}
              columnSpan={"lg:col-span-5"}
            />
          </motion.div>
        </div>
      </div>
      <div className="flex custom-shape-divider-bottom-1733342128">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
});

export default Home;
