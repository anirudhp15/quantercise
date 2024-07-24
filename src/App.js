import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
} from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home/index2";
import PracticeProblems from "./components/sections/PracticeProblems";
import Profile from "./components/header/Profile";
import { AuthProvider } from "./contexts/authContext";
import Footer from "./components/footer/Footer";
import EditProfile from "./components/header/EditProfile";
import PerformanceAnalytics from "./components/sections/PerformanceAnalytics";
import ProgressTracker from "./components/sections/ProgressTracker";
import LandingPage from "./components/landing/LandingPage";
import Pricing from "./components/landing/Pricing";
import StripeCheckout from "./components/landing/StripeCheckout";
import "./index.css";
import SuccessPage from "./components/auth/SuccessPage";

function RouteComponent() {
  const routesArray = [
    { path: "/", element: <Home /> },
    { path: "/landing", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/practice-problems", element: <PracticeProblems /> },
    { path: "/profile", element: <Profile /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "/progress", element: <ProgressTracker /> },
    { path: "/analytics", element: <PerformanceAnalytics /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/checkout", element: <StripeCheckout /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "*", element: <Login /> },
  ];

  let routesElement = useRoutes(routesArray);
  const location = useLocation(); // Get current location

  // Condition to check if the current path is not the landing page
  const showFooter = location.pathname !== "/landing";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-grow w-full bg-gray-900">
        {routesElement}
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/quantercise">
        <RouteComponent />
      </Router>
    </AuthProvider>
  );
}

export default App;
