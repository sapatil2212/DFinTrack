import React, { useState } from "react";
import {
  Home,
  DollarSign,
  CreditCard,
  Users,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sidebar Component
const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: <Home />, label: "Home", path: "/dashboard" },

    { icon: <CreditCard />, label: "Expenses", path: "/expenses" },
    { icon: <Users />, label: "Caretakers", path: "/caretakers" },
    { icon: <Building />, label: "Properties", path: "/properties" },
    { icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`
      ${
        isMobile
          ? `fixed top-0 left-0 w-64 h-full bg-gray-800 z-50 transform transition-transform duration-300 
           ${isOpen ? "translate-x-0" : "-translate-x-full"}`
          : "w-64 bg-gray-800"
      } text-white`}
    >
      {isMobile && (
        <button onClick={toggleSidebar} className="absolute top-4 right-4 z-60">
          <X size={24} />
        </button>
      )}
      <div className="p-4 text-center font-bold text-xl border-b border-gray-700">
        Property Manager
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              isMobile && toggleSidebar();
            }}
            className="w-full flex items-center p-3 hover:bg-gray-700 transition"
          >
            {item.icon}
            {!isMobile && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
        <button
          onClick={() => {
            // Logout logic
            localStorage.clear();
            navigate("/login");
          }}
          className="w-full flex items-center p-3 hover:bg-red-700 text-red-500 hover:text-white transition mt-4"
        >
          <LogOut />
          {!isMobile && <span className="ml-3">Logout</span>}
        </button>
      </nav>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sample data for charts (replace with actual data)
  const revenueData = [
    { name: "Jan", revenue: 4000, expense: 2400 },
    { name: "Feb", revenue: 3000, expense: 1398 },
    { name: "Mar", revenue: 2000, expense: 9800 },
  ];

  // Responsive check
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        >
          <Menu />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        isOpen={isMobileMenuOpen}
        toggleSidebar={toggleMobileMenu}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-6 ${isMobile ? "ml-0" : "ml-64"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" />
                <Bar dataKey="expense" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Maintenance", value: 400 },
                    { name: "Utilities", value: 300 },
                    { name: "Salaries", value: 300 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  fill="#8884d8"
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">₹1,50,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">₹75,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-gray-500">Net Profit</h3>
            <p className="text-2xl font-bold text-blue-600">₹75,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-gray-500">Properties</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
