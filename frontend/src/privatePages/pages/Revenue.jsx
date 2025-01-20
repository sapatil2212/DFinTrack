import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

import AddRevenueForm from "./RevenueComp/AddRevenueForm";
import RevenueTable from "./RevenueComp/RevenueTable";
import AdminPersonalRevenue from "./AdminPersonalRevenueComp/AdminPersonalRevenue";
import RevenueCard from "./RevenueComp/RevenueCard";

const Revenue = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const accountType = decodedToken?.accountType;

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRevenue(null);
  };

  const handleEdit = (revenue) => {
    setEditingRevenue(revenue);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-lightblue p-6">
      <RevenueCard />
      {accountType === "ADMIN" && <AdminPersonalRevenue />}
      <RevenueTable />
    </div>
  );
};

export default Revenue;
