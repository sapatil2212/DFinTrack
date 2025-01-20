import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserRevenueTable from "./UserRevenueTable";
import AdminRevenueTable from "./AdminRevenueTable";
import AddRevenueForm from "./AddRevenueForm";

const RevenueTable = () => {
  const [accountType, setAccountType] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setAccountType(decodedToken.accountType);
        setPropertyId(decodedToken.propertyId || null);
      } else {
        console.error("Token not found in localStorage.");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading account information...</p>
      </div>
    );
  }

  if (!accountType) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Unable to determine account type.</p>
      </div>
    );
  }

  return (
    <div>
      {accountType === "USER" && propertyId ? (
        <UserRevenueTable propertyId={propertyId} />
      ) : accountType === "ADMIN" ? (
        <AdminRevenueTable />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Invalid account type detected.</p>
        </div>
      )}
    </div>
  );
};

export default RevenueTable;
