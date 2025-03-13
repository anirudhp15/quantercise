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
import NewsletterSignUp from "./components/parts/NewsletterSignUp";
import Pricing from "./components/landing/pricing/Pricing";
import StripeCheckout from "./components/landing/tba/StripeCheckout";
import SuccessPage from "./components/auth/onboarding/SuccessPage";
import Onboarding from "./components/auth/onboarding/Onboarding";
import { Analytics } from "@vercel/analytics/react";
import AnimatedGrid from "./components/landing/animatedGrid/AnimatedGrid";
import ResetPage from "./components/parts/ResetPage";
import useFavicon from "./hooks/useFavicon";
import "./index.css";
import Applications from "./components/parts/common/Applications";
import NotFoundPage from "./components/parts/404Page";
import { useLowDetail } from "./contexts/LowDetailContext";
import { path } from "animejs";
import axios from "axios";
import { UserProvider } from "./contexts/userContext";
import ErrorBoundary from "./components/parts/common/ErrorBoundary";
import AuthenticatedLayout from "./components/layout/authenticated/AuthenticatedLayout";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://quantercise-api.vercel.app"
    : "http://localhost:4242";
axios.defaults.withCredentials = true;

// Smart wildcard redirect component
function SmartRedirect() {
  const { currentUser, isLoading } = useAuth();

  // Wait for authentication to load
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

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

// Add the AuthDebugger component
const AuthDebugger = () => {
  const { registrationStep, currentUser } = useAuth();

  React.useEffect(() => {
    console.log("AuthDebugger - Current registration step:", registrationStep);
    console.log("AuthDebugger - User authenticated:", !!currentUser);
  }, [registrationStep, currentUser]);

  return null; // This component doesn't render anything
};

// Authenticated route with layout
const AuthenticatedRouteWithLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </ProtectedRoute>
  );
};

function RouteComponent() {
  const { lowDetailMode } = useLowDetail();
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  const routesArray = [
    { path: "/", element: <LandingPage /> },
    { path: "/landing", element: <LandingPage /> },
    {
      path: "/login",
      element: currentUser ? <Navigate to="/home" replace /> : <Login />,
    },
    {
      path: "/register",
      element: currentUser ? <Navigate to="/home" replace /> : <Register />,
    },
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
    // Authenticated routes with sidebar layout
    {
      path: "/home",
      element: (
        <AuthenticatedRouteWithLayout>
          <Home />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/practice-problems",
      element: (
        <AuthenticatedRouteWithLayout>
          <PracticeProblems />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/profile",
      element: (
        <AuthenticatedRouteWithLayout>
          <Profile />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/edit-profile",
      element: (
        <AuthenticatedRouteWithLayout>
          <EditProfile />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/progress",
      element: (
        <AuthenticatedRouteWithLayout>
          <ProgressTracker />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/analytics",
      element: (
        <AuthenticatedRouteWithLayout>
          <PerformanceAnalytics />
        </AuthenticatedRouteWithLayout>
      ),
    },
    {
      path: "/applications",
      element: (
        <AuthenticatedRouteWithLayout>
          <Applications />
        </AuthenticatedRouteWithLayout>
      ),
    },
    { path: "/newsletter-sign-up", element: <NewsletterSignUp /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/checkout", element: <StripeCheckout /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "/onboarding", element: <Onboarding /> },
    { path: "*", element: <SmartRedirect /> },
  ];

  // Move useRoutes up here, before any conditional rendering
  let routesElement = useRoutes(routesArray);

  // Use our favicon hook to ensure favicon is properly loaded
  useFavicon();

  // Wait for authentication to load
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  // Check for public pages that need the original layout
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/landing" ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/reset" ||
    location.pathname === "/newsletter-sign-up" ||
    location.pathname === "/pricing" ||
    location.pathname === "/checkout" ||
    location.pathname === "/success" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/404" ||
    location.pathname === "/plan-selection";

  // Authenticated routes use the AuthenticatedLayout component directly
  const isAuthenticatedPage = currentUser && !isPublicPage;

  // Only show the traditional header on public pages
  const showHeader =
    isPublicPage &&
    location.pathname !== "/register" &&
    location.pathname !== "/success" &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/login" &&
    location.pathname !== "/plan-selection";

  // Determine whether to show the background animation
  const showAnimatedGrid = !lowDetailMode && isPublicPage;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Only show header on public pages that aren't onboarding/auth */}
      {showHeader && <Header />}

      {/* Only show animated grid on public pages when lowDetailMode is off */}
      {showAnimatedGrid && <AnimatedGrid />}

      <div className="flex flex-col flex-grow w-full">
        <AuthDebugger />
        {routesElement}
      </div>

      {/* Footer is handled by AuthenticatedLayout for authenticated pages */}
      {isPublicPage &&
        location.pathname !== "/applications" &&
        location.pathname !== "/" &&
        location.pathname !== "/landing" &&
        location.pathname !== "/newsletter-sign-up" &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" && <Footer />}
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
