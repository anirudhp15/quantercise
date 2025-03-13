import React, { useState, useEffect, useCallback } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../../contexts/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedGrid2 from "../../landing/animatedGrid/AnimatedGrid2";
import { ReactTyped } from "react-typed";
import "../../../index.css";
import { useLowDetail } from "../../../contexts/LowDetailContext";
import SectionCard from "./SectionCard";
import { useUser } from "../../../contexts/userContext";
import { FaClipboardList, FaCog, FaTrophy, FaFire } from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";
import { useUserProgress } from "../../../hooks/useProblems/useUserProgress";
import { useFetchProblem } from "../../../hooks/useFetch/useFetchNewProblem";
import { formatDistanceToNow } from "date-fns";
import Overview from "./Overview";

const Home = React.memo(() => {
  const { currentUser } = useAuth();
  const { lowDetailMode } = useLowDetail();
  const { mongoId } = useUser();
  const [showOverlay, setShowOverlay] = useState(false);
  const { completedCount, startedCount, streakCount, lastActive } =
    useUserProgress(mongoId);
  const { isPro } = useUser();
  const { problem } = useFetchProblem();

  const currentUsername = currentUser?.displayName;

  // For past dates (normal "Last active" scenario)
  const timeAgo = formatDistanceToNow(new Date(lastActive), {
    addSuffix: true,
  });
  // Output: "21 days ago" (if today is March 28, 2024)

  // For future dates (if the date is actually correct)
  const timeUntil = formatDistanceToNow(new Date(lastActive), {
    addSuffix: true,
  });
  // Output: "in about 1 year"

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowOverlay(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const getIntroMessage = useCallback(() => {
    if (completedCount === 0) {
      return `Welcome ${currentUsername}! Ready to dive into quantitative finance? `;
    } else if (completedCount <= 10) {
      return `Great to see you back ${currentUsername}! Keep pushing through those problems!`;
    } else if (completedCount <= 50) {
      return `Impressive progress ${currentUsername}! You're getting closer to that offer!`;
    } else if (completedCount <= 100) {
      return `Fantastic work ${currentUsername}! Your dedication is paying off.`;
    } else {
      return `You're a quant finance wizard ${currentUsername}! Keep up the excellent work.`;
    }
  }, [completedCount]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-wrapper">
      <div className="flex relative justify-center items-center h-auto min-h-screen text-gray-300 bg-transparent">
        {!lowDetailMode && <AnimatedGrid2 />}
        <div className="flex relative z-10 flex-col justify-center px-2 py-24 lg:px-4">
          <div className="flex flex-col justify-center items-center lg:flex-row">
            <div className="w-full lg:w-2/5 xl:w-full">
              <div className="text-3xl font-black text-center text-transparent lg:text-left sm:text-4xl md:text-5xl animate-gradient gradient-text">
                <div className="h-14">
                  <ReactTyped
                    strings={["lets quantercise!"]}
                    typeSpeed={100}
                    backSpeed={60}
                    o
                    startDelay={500}
                    showCursor={false}
                    className="whitespace-nowrap"
                  />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 1 }}
              >
                <p className="my-4 text-lg font-light tracking-wide leading-relaxed text-center text-gray-200 md:text-xl lg:text-2xl lg:text-left">
                  {getIntroMessage()}
                </p>
              </motion.div>
            </div>
            <div className="block w-full lg:hidden lg:p-4 lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 3 }}
                className="flex flex-row gap-2 justify-center text-xs font-normal lg:justify-end"
              >
                <Link
                  to="/practice-problems"
                  className="flex justify-center items-center px-2 py-1 text-green-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-green-400"
                >
                  Practice
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/applications"
                  className="flex justify-center items-center px-2 py-1 text-sky-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-sky-400"
                >
                  Add Application
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/profile"
                  className="flex justify-center items-center px-2 py-1 text-gray-400 whitespace-nowrap bg-gray-800 rounded-md border border-gray-600 transition-all duration-200 hover:bg-gray-700 hover:border-gray-400"
                >
                  Profile
                  <FaArrowRightLong className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
          {/* Dashboard Overview Section */}
          <Overview
            startedCount={startedCount}
            completedCount={completedCount}
            streakCount={streakCount}
            timeAgo={timeAgo}
            problem={problem}
            isPro={isPro}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                  delayChildren: 0.5,
                },
              },
            }}
            className="grid grid-cols-1 gap-2 my-2 lg:my-4 lg:grid-cols-5 sm:gap-4"
          >
            <SectionCard
              title="Problems"
              icon={<RiPlayListAddFill />}
              description="Access a variety of quant interview problems to improve your skills."
              buttonText="Start Practicing"
              link="/practice-problems"
              textColor={"text-green-400"}
              buttonBorderColor={"border-green-400"}
              columnSpan={"lg:col-span-2"}
            />
            {isPro === null && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}

            {isPro === false && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}
            {/* <SectionCard
              title="Track Progress"
              icon={<TbProgressCheck />}
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
            /> */}

            {/* {isPro && (
              <SectionCard
                title="Analytics"
                icon={<FaChartBar />}
                description="Track your performance and identify areas for improvement."
                buttonText="View Analytics"
                link="/analytics"
                textColor={"text-purple-400"}
                bgColor={"bg-purple-400"}
                hoverColor={"hover:text-purple-400"}
                buttonBorderColor={"border-purple-400"}
                columnSpan={"lg:col-span-3"}
              />
            )} */}
            {isPro === true && (
              <SectionCard
                title="Applications"
                icon={<FaClipboardList />}
                description="Keep track of your internship/job applications and upcoming interviews."
                buttonText="View Applications"
                link="/applications"
                textColor={"text-sky-400"}
                buttonBorderColor={"border-sky-400"}
                columnSpan={"lg:col-span-3"}
              />
            )}
            {isPro === true && (
              <SectionCard
                title="Profile Settings"
                icon={<FaCog />}
                description="Update your profile information and account settings."
                buttonText="View Profile"
                link="/profile"
                textColor={"text-gray-400"}
                buttonBorderColor={"border-gray-400"}
                columnSpan={"lg:col-span-5"}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default Home;
