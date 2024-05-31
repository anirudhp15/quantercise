import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import PracticeProblems from "./components/sections/PracticeProblems";
import Profile from "./components/header/Profile";
import { AuthProvider } from "./contexts/authContext";
import Footer from "./components/footer/Footer";
import EditProfile from "./components/header/EditProfile";

function RouteComponent() {
  const routesArray = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/practice-problems", element: <PracticeProblems /> },
    { path: "/profile", element: <Profile /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "*", element: <Login /> }, // Fallback route for unknown paths
  ];

  let routesElement = useRoutes(routesArray);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-grow w-full bg-gray-800">
        {routesElement}
      </div>
      <Footer />
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
