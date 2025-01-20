import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Expense Manager
        </Link>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.username}</span>
          {user?.accountType === "ADMIN" && (
            <Link to="/admin" className="hover:underline">
              Admin Panel
            </Link>
          )}
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
