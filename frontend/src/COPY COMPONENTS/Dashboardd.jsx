import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../slices/UserSlices";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();

    dispatch(removeUser());

    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-xl font-semibold">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
        </div>
        <div className="text-white flex items-center gap-4">
          <span className="font-semibold">Welcome, User!</span>{" "}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to the Dashboard!
        </h1>
        <p className="mt-4 text-gray-700">
          You are now logged in and can view your personal data.
        </p>
        <p className="mt-2 text-gray-500">Enjoy your experience!</p>
      </div>
    </div>
  );
};

export default Dashboard;
