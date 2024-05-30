import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import PracticeProblems from "./components/sections/PracticeProblems";
import { AuthProvider } from "./contexts/authContext";

function RouteComponent() {
  const routesArray = [
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/practice-problems", element: <PracticeProblems /> },
    // Add more routes as needed
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <RouteComponent />
    </Router>
  );
}

export default App;
