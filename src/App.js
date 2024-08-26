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
import SuccessPage from "./components/auth/SuccessPage";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import Applications from "./components/sections/Applications";

function RouteComponent() {
  const routesArray = [
    { path: "/", element: <LandingPage /> },
    { path: "/landing", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/practice-problems", element: <PracticeProblems /> },
    { path: "/profile", element: <Profile /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "/progress", element: <ProgressTracker /> },
    { path: "/analytics", element: <PerformanceAnalytics /> },
    { path: "/applications", element: <Applications /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/checkout", element: <StripeCheckout /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "*", element: <Login /> },
  ];

  let routesElement = useRoutes(routesArray);
  const location = useLocation(); // Get current location

  const showFooter =
    location.pathname !== "/" &&
    location.pathname !== "/landing" &&
    location.pathname !== "/applications";

  const showHeader = location.pathname !== "/applications";

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {showHeader && <Header />}
      <div className="flex flex-col flex-grow w-full">{routesElement}</div>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouteComponent />
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

export default App;
