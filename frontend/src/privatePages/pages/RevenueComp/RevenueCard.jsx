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
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {accountType === "ADMIN"
              ? "Manage Revenues"
              : "Manage Property Revenues"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Upward arrow indicating an increase in revenue compared to the
            previous period.
          </p>
        </div>
      </div>

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
                    <span className="flex items-center text-sm text-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      {calculateGrowthPercentage(personalRevenues)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Revenues: {personalRevenues.length}
                  </p>
                  <div className="h-24 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={personalData}>
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
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
                  <span className="flex items-center text-sm text-green-500">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {calculateGrowthPercentage(revenues)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Revenues: {revenues.length}
                </p>
                <div className="h-24 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyData}>
                      <Bar dataKey="bookings" fill="#22c55e" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-[250px]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                {accountType === "ADMIN" && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Total Revenue
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Total Bookings
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={propertyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <Tooltip />
                  {accountType === "ADMIN" && (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stackId="2"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
