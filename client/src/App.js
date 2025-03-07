import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/parts/ProtectedRoute"; // Import the ProtectedRoute component
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import PlanSelection from "./components/auth/plans";
import Header from "./components/layout/header";
import Home from "./components/sections/dashboard";
import PracticeProblems from "./components/sections/problems/PracticeProblems";
import Profile from "./components/auth/profile/Profile";
import { AuthProvider, useAuth } from "./contexts/authContext";
import Footer from "./components/layout/footer/Footer";
import EditProfile from "./components/auth/profile/EditProfile";
import PerformanceAnalytics from "./components/sections/analytics/PerformanceAnalytics";
import ProgressTracker from "./components/sections/analytics/ProgressTracker";
import LandingPage from "./components/landing/LandingPage";
import Waitlist from "./components/parts/Waitlist";
import Pricing from "./components/landing/pricing/Pricing";
import StripeCheckout from "./components/landing/tba/StripeCheckout";
import SuccessPage from "./components/auth/onboarding/SuccessPage";
import Onboarding from "./components/auth/onboarding/Onboarding";
import { Analytics } from "@vercel/analytics/react";
import AnimatedGrid from "./components/landing/animatedGrid/AnimatedGrid";
import ResetPage from "./components/parts/ResetPage";
import "./index.css";
import Applications from "./components/parts/common/Applications";
import NotFoundPage from "./components/parts/404Page";
import { useLowDetail } from "./contexts/LowDetailContext";
import { path } from "animejs";
import axios from "axios";
import { UserProvider } from "./contexts/userContext";
import ErrorBoundary from "./components/parts/common/ErrorBoundary";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

// Smart wildcard redirect component
function SmartRedirect() {
  const { currentUser } = useAuth();

  // If user is authenticated, take them to the dashboard/home
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, take them to the landing page
  return <Navigate to="/" replace />;
}

// Dashboard redirect component
function DashboardRedirect() {
  return <Navigate to="/home" replace />;
}

function RouteComponent() {
  const { lowDetailMode } = useLowDetail();
  const { currentUser } = useAuth();

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
      path: "/dashboard",
      element: <DashboardRedirect />,
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
    { path: "/onboarding", element: <Onboarding /> },
    { path: "*", element: <SmartRedirect /> },
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
    location.pathname === "/onboarding" ||
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
    <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
      <AuthProvider>
        <UserProvider>
          <Router>
            <RouteComponent />
            <Analytics />
          </Router>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
