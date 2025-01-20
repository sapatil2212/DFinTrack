import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Store";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/Aboutus";
import Services from "./pages/Services";
import Forgotpass from "./pages/Forgotpass";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  // Effect to check if the user is authenticated and handle session timeout
  useEffect(() => {
    let timeout;

    const handleUserActivity = () => {
      clearTimeout(timeout);
      startInactivityTimer();
    };

    const startInactivityTimer = () => {
      timeout = setTimeout(() => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        setShowAlert(true);
      }, 1 * 60 * 1000); // 1 minute inactivity timeout
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    startInactivityTimer();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleLogout = () => {
    // Immediately update authentication state and clear session
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  };

  return (
    <Provider store={Store}>
      <div>
        {location.pathname !== "/dashboard" && <Header />}

        {showAlert && (
          <div
            role="alert"
            className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <span className="text-red-500">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Session Expired
                </h3>
                <p className="text-sm text-gray-700">
                  You have been logged out due to inactivity.
                </p>
              </div>
              <button
                onClick={closeAlert}
                className="ml-4 text-gray-600 hover:text-gray-800"
              >
                ✖️
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<Forgotpass />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        <Footer />
      </div>
    </Provider>
  );
};

export default App;
