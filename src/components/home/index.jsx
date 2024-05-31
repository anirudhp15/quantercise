import React, { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4 sm:p-6 mt-16 animate-fadeIn">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-green-400 py-4 fade-in">
          Welcome back, {currentUser.displayName || currentUser.email}!
        </h1>
        <p className="mt-2 text-lg fade-in">
          Ready to ace your quant finance interviews? Let's get started!
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              Practice Problems
            </h2>
            <p className="mt-2">
              Access a variety of quant interview problems to practice and
              improve your skills.
            </p>
            <Link
              to="/practice-problems"
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
            >
              Start Practicing
            </Link>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              Progress Tracker
            </h2>
            <p className="mt-2">
              You have completed {problemsCompleted} problems so far. Keep up
              the good work!
            </p>
            <Link
              to="/progress"
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
            >
              View Progress
            </Link>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              Resources
            </h2>
            <p className="mt-2">
              Check out these resources to help you prepare for your interviews.
            </p>
            <ul className="mt-2 list-disc list-inside">
              <li>
                <a
                  href="https://example.com/video"
                  className="text-green-400 hover:text-green-300"
                >
                  Interview Prep Video
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/book"
                  className="text-green-400 hover:text-green-300"
                >
                  Recommended Books
                </a>
              </li>
            </ul>
            <Link
              to="/resources"
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
            >
              View All Resources
            </Link>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
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
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
            >
              View All Events
            </Link>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg sm:col-span-2 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              Performance Analytics
            </h2>
            <p className="mt-2">
              Track your performance and identify areas for improvement.
            </p>
            <Link
              to="/analytics"
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
