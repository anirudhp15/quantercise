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
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/practice-problems", element: <PracticeProblems /> },
    { path: "/profile", element: <Profile /> }, // Add the Profile route
    { path: "/edit-profile", element: <EditProfile /> }, // Add EditProfile route

    // Add more routes as needed
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="flex-grow w-full bg-gray-800 flex flex-col">
        {routesElement}
      </div>
      <Footer /> {/* Add Footer here */}
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <RouteComponent />
      </div>
    </Router>
  );
}

export default App;
