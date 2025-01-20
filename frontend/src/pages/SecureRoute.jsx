import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const SecureRoute = ({ children }) => {
  const location = useLocation();

  const jwt = useSelector((state) => state.jwt);

  const isAuthenticated = (() => {
    if (jwt) return true;
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      return !!(token && user);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  })();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please log in to access this page",
        }}
        replace
      />
    );
  }

  return children;
};

export default SecureRoute;
