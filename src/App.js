import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/parts/ProtectedRoute"; // Import the ProtectedRoute component
import Login from "./components/sections/auth/login";
import Register from "./components/sections/auth/register";
import PlanSelection from "./components/sections/auth/plans";
import Header from "./components/sections/header";
import Home from "./components/sections/home";
import PracticeProblems from "./components/sections/problems/PracticeProblems";
import Profile from "./components/sections/auth/profile/Profile";
import { AuthProvider } from "./contexts/authContext";
import Footer from "./components/sections/footer/Footer";
import EditProfile from "./components/sections/auth/profile/EditProfile";
import PerformanceAnalytics from "./components/sections/PerformanceAnalytics";
import ProgressTracker from "./components/sections/ProgressTracker";
import LandingPage from "./components/sections/landing/LandingPage";
import Waitlist from "./components/sections/Waitlist";
import Pricing from "./components/sections/landing/pricing/Pricing";
import StripeCheckout from "./components/sections/landing/tba/StripeCheckout";
import SuccessPage from "./components/sections/auth/onboarding/SuccessPage";
import OnboardingTutorial from "./components/sections/auth/onboarding/OnboardingTutorial";
import { Analytics } from "@vercel/analytics/react";
import AnimatedGrid from "./components/sections/landing/animatedGrid/AnimatedGrid";
import ResetPage from "./components/parts/ResetPage";
import "./index.css";
import Applications from "./components/sections/applications/Applications";
import NotFoundPage from "./components/parts/404Page";
import { useLowDetail } from "./contexts/LowDetailContext";
import { path } from "animejs";
import axios from "axios";
import { UserProvider } from "./contexts/userContext";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

function RouteComponent() {
  const { lowDetailMode } = useLowDetail();

  const routesArray = [
    { path: "/", element: <LandingPage /> },
    { path: "/landing", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/reset", element: <ResetPage /> },
    { path: "/404", element: <NotFoundPage /> },
    {
      path: "/plan-selection",
      element: <PlanSelection />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/practice-problems",
      element: (
        <ProtectedRoute>
          <PracticeProblems />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/edit-profile",
      element: (
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/progress",
      element: (
        <ProtectedRoute>
          <ProgressTracker />
        </ProtectedRoute>
      ),
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute>
          <PerformanceAnalytics />
        </ProtectedRoute>
      ),
    },
    { path: "/waitlist", element: <Waitlist /> },
    { path: "/applications", element: <Applications /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/checkout", element: <StripeCheckout /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "/onboarding", element: <OnboardingTutorial /> },
    { path: "*", element: <Navigate to="/register" replace /> },
  ];

  let routesElement = useRoutes(routesArray);
  const location = useLocation(); // Get current location

  const showFooter =
    location.pathname !== "/" &&
    location.pathname !== "/landing" &&
    location.pathname !== "/applications";

  const showHeader = location.pathname !== "/applications";

  const isPlanSelectionPage = location.pathname === "/plan-selection";
  const isOnboardingPage =
    location.pathname === "/register" ||
    location.pathname === "/success" ||
    location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {showHeader && !isPlanSelectionPage && !isOnboardingPage && <Header />}
      {!lowDetailMode && <AnimatedGrid />}
      <div className="flex flex-col flex-grow w-full">{routesElement}</div>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <RouteComponent />
          <Analytics />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
