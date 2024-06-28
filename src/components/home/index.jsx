import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useAuth();
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Fetch user's progress and upcoming events from your backend
    // Placeholder data for demonstration
    setProblemsCompleted(42);
    setUpcomingEvents([
      { date: "2024/06/15", title: "Mock Interview Session" },
      { date: "2024/06/20", title: "Quant Finance Webinar" },
    ]);
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 mt-16 text-gray-300 bg-gray-900 sm:p-6 animate-fadeIn">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="py-4 text-3xl font-bold text-green-400 sm:text-5xl fade-in">
          Welcome back, {currentUser.displayName || currentUser.email}!
        </h1>
        <p className="mt-2 text-lg fade-in">
          Ready to ace your quant finance interviews? Let's get started!
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-300 sm:text-2xl">
                Practice Problems
              </h2>
              <p className="mt-2">
                Access a variety of quant interview problems to practice and
                improve your skills.
              </p>
              <Link
                to="/practice-problems"
                className="inline-block px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-500 hover:bg-blue-600 rounded-xl hover:shadow-lg"
              >
                Start Practicing
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-purple-400 sm:text-2xl">
                Progress Tracker
              </h2>
              <p className="mt-2">
                You have completed {problemsCompleted} problems so far. Keep up
                the good work!
              </p>
              <Link
                to="/progress"
                className="inline-block px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-purple-600 hover:bg-purple-700 rounded-xl hover:shadow-lg"
              >
                View Progress
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold sm:text-2xl text-sky-300">
                Resources
              </h2>
              <p className="mt-2">
                Check out these resources to help you prepare for your
                interviews.
              </p>
              <ul className="mt-2 list-disc list-inside">
                <li>
                  <a
                    href="https://example.com/video"
                    className="text-sky-300 hover:text-sky-200"
                  >
                    Interview Prep Video
                  </a>
                </li>
                <li>
                  <a
                    href="https://example.com/book"
                    className="text-sky-300 hover:text-sky-200"
                  >
                    Recommended Books
                  </a>
                </li>
              </ul>
              <Link
                to="/resources"
                className="inline-block px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-sky-500 hover:bg-sky-600 rounded-xl hover:shadow-lg"
              >
                View All Resources
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 h-full p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-indigo-300 sm:text-2xl">
                Upcoming Events
              </h2>
              <p className="mt-2">Don't miss these upcoming events.</p>
              <ul className="mt-2 list-disc list-inside">
                {upcomingEvents.map((event, index) => (
                  <li key={index}>
                    {event.date} - {event.title}
                  </li>
                ))}
              </ul>
              <Link
                to="/events"
                className="inline-block px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-indigo-600 hover:bg-indigo-700 rounded-xl hover:shadow-lg"
              >
                View All Events
              </Link>
            </div>
          </div>

          <div className="relative group sm:col-span-2">
            <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-200 transform bg-gray-700 rounded-lg shadow-lg"></div>
            <div className="relative z-10 p-4 transition-transform duration-200 transform bg-gray-800 rounded-lg shadow-lg sm:p-6 sm:col-span-2 hover:-translate-y-1 hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-400 sm:text-2xl">
                Performance Analytics
              </h2>
              <p className="mt-2">
                Track your performance and identify areas for improvement.
              </p>
              <Link
                to="/analytics"
                className="inline-block px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-blue-700 hover:bg-blue-800 rounded-xl hover:shadow-lg"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
