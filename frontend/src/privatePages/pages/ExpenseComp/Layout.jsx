import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
};

export default Layout;
