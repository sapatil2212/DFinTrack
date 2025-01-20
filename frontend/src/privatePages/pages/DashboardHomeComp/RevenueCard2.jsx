import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import {
  fetchRevenuesForProperty,
  fetchRevenues,
} from "../../../slices/RevenuSlice";

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("jwtToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.userId;
  const accountType = decodedToken?.accountType;
  const propertyId = "some-property-id";

  const revenues = useSelector((state) => state.revenue.revenues || []);
  const personalRevenues = useSelector(
    (state) => state.personalRevenues.revenues || []
  );

  useEffect(() => {
    if (userId && accountType) {
      if (accountType === "ADMIN") {
        dispatch(fetchRevenues());
      } else if (propertyId) {
        dispatch(fetchRevenuesForProperty({ userId, propertyId }));
      }
    }
  }, [dispatch, userId, accountType, propertyId]);

  const processDataForChart = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((revenue) => ({
      name: new Date(revenue.dateTime).toLocaleString("default", {
        month: "short",
      }),
      revenue: Number(revenue.amount) || 0,
      bookings: 1,
    }));
  };

  const calculateTotal = (data) => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((sum, rev) => sum + (Number(rev.amount) || 0), 0);
  };

  const calculateGrowthPercentage = (data) => {
    if (!Array.isArray(data) || data.length < 2) return 0;
    const lastWeek = data
      .slice(-7)
      .reduce((sum, rev) => sum + (Number(rev.amount) || 0), 0);
    const totalRevenue = calculateTotal(data);
    return totalRevenue ? ((lastWeek / totalRevenue) * 100).toFixed(2) : 0;
  };

  const propertyData = processDataForChart(revenues);
  const personalData = processDataForChart(personalRevenues);

  const totalPersonalRevenue = calculateTotal(personalRevenues).toFixed(2);
  const totalPropertyRevenue = calculateTotal(revenues).toFixed(2);

  return (
    <div className="p-4 space-y-6 bg-gray-50/50">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-6 md:grid-cols-2">
          {accountType === "ADMIN" && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h2 className="text-sm text-muted-foreground">
                    Total Personal Revenue
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      ₹{totalPersonalRevenue}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Revenues: {personalRevenues.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h2 className="text-sm text-muted-foreground">
                  {accountType === "ADMIN"
                    ? "Total Property Revenue"
                    : "Property Revenue"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    ₹{totalPropertyRevenue}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Revenues: {revenues.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
