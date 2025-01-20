import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoIcon from "../../../src/assets/logo.png";
import {
  Home,
  DollarSign,
  FileText,
  Building,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  MessageCircleQuestion,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "../../slices/UserSlices";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard2/home", icon: <Home /> },
    { name: "Revenue", path: "/dashboard2/revenue", icon: <DollarSign /> },
    { name: "Expenses", path: "/dashboard2/expenses", icon: <FileText /> },
    { name: "Properties", path: "/dashboard2/properties", icon: <Building /> },
    { name: "Bookings", path: "/dashboard2/bookings", icon: <Calendar /> },
    { name: "ManageUsers", path: "/dashboard2/ManageUser", icon: <Users /> },
    //{ name: "Settings", path: "/dashboard2/settings", icon: <Settings /> },

    /*{
      name: "Logout",
      path: "#",
      icon: <LogOut />,
      onClick: () => setShowLogoutModal(true),
    },*/
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-2 left-4 z-50 bg-white p-2 text-gray-600 "
      >
        {isMobileMenuOpen ? <X size={15} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm fixed md:static top-0 left-0 
          transform transition-transform duration-300 z-50
          md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button for Mobile Menu */}
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-50 md:hidden bg-white p-2 text-gray-600 "
          >
            <X size={15} />
          </button>
        )}

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img
              src={LogoIcon}
              alt="Logo"
              className="block w-28 h-auto md:w-40"
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name} className="px-2">
                <NavLink
                  to={item.path}
                  onClick={item.onClick || (() => setIsMobileMenuOpen(false))}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <span className="mr-4 transition-transform group-hover:scale-110">
                    {React.cloneElement(item.icon, {
                      className: "w-5 h-5",
                      strokeWidth: 1.5,
                    })}
                  </span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Help Center Section */}
        <div className="px-6 py-3 mt-auto border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            Help Center
            <MessageCircleQuestion className="w-4 h-4 ml-1" />
          </h3>

          <p className="text-xs text-gray-600 pb-3">
            Need assistance? Contact us
          </p>
          <p className="text-xs text-gray-600 mb-1 flex items-center">
            📧{" "}
            <a
              href="mailto:help@digiworldinfotech.com"
              className="text-blue-600 hover:underline ml-1"
            >
              help@digiworldinfotech.com
            </a>
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            📞{" "}
            <a
              href="tel:+918830553868"
              className="text-blue-600 hover:underline ml-1"
            >
              +91 883 055 3868
            </a>
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
};

export default Sidebar;
