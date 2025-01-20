import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logOut } from "../../slices/UserSlices";

const PrivateHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = (confirm) => {
    if (confirm) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(logOut());

      navigate("/login");
    }
    setShowLogoutModal(false);
  };

  const navigateToProfile = () => {
    navigate("/dashboard2/settings");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4 w-full">
            <div className="lg:hidden">
              <a href="/" className="text-xl font-bold text-blue-600">
                .
              </a>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded-full"
              >
                <User className="w-4 h-5 text-gray-600" />
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name || "Guest"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={navigateToProfile}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2 w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
          role="dialog"
          tabIndex="-1"
          aria-labelledby="logout-alert-label"
        >
          <div className="relative bg-white border shadow-sm rounded-xl overflow-hidden w-full max-w-md mx-auto animate-fade-in-down text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-2 right-2 inline-flex justify-center items-center w-8 h-8 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-4 sm:p-10 overflow-y-auto flex flex-col items-center">
              <div className="flex flex-col items-center gap-y-4 w-full">
                <span className="inline-flex justify-center items-center w-24 h-24 rounded-full border-4 border-red-50 bg-red-100 text-red-500">
                  <LogOut className="w-12 h-12" />
                </span>

                <div className="text-center">
                  <h3
                    id="logout-alert-label"
                    className="mb-2 text-xl font-bold text-gray-800"
                  >
                    Confirm Logout
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    Are you sure you want to log out? You'll need to log in
                    again to access your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-x-2 py-3 px-4 bg-gray-50 border-t">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleLogout(true)}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateHeader;
