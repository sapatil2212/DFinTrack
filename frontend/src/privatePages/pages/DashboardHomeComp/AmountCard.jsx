import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { getAllRevenues } from "../../../slices/PersonalRevenueSlice";
import { fetchRevenues } from "../../../slices/RevenuSlice";
import ExpenseService from "../../../services/ExpenseService";
import { jwtDecode } from "jwt-decode";
import { fetchBookings } from "../../../slices/BookingSlice";

const TIME_PERIODS = {
  TODAY: "Today",
  LAST_WEEK: "Last Week",
  CURRENT_MONTH: "Current Month",
  LAST_MONTH: "Last Month",
};

function AmountCard({ title, value, icon: Icon, data, timeFilter, type }) {
  const [filteredValue, setFilteredValue] = useState(value);

  const filterData = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    if (!Array.isArray(data)) {
      return 0;
    }

    let filtered;
    switch (period) {
      case "Today":
        filtered = data.filter((item) => {
          const date = new Date(
            type === "booking"
              ? item.bookingDateTime
              : type === "expense"
              ? item.createdAt
              : type === "personalRevenue"
              ? item.dateTime
              : item.dateTime
          );
          return date >= today;
        });
        break;
      case "Last Week":
        filtered = data.filter((item) => {
          const date = new Date(
            type === "booking"
              ? item.bookingDateTime
              : type === "expense"
              ? item.createdAt
              : type === "personalRevenue"
              ? item.dateTime
              : item.dateTime
          );
          return date >= lastWeekStart && date <= today;
        });
        break;
      case "Current Month":
        filtered = data.filter((item) => {
          const date = new Date(
            type === "booking"
              ? item.bookingDateTime
              : type === "expense"
              ? item.createdAt
              : type === "personalRevenue"
              ? item.dateTime
              : item.dateTime
          );
          return date >= currentMonthStart;
        });
        break;
      case "Last Month":
        filtered = data.filter((item) => {
          const date = new Date(
            type === "booking"
              ? item.bookingDateTime
              : type === "expense"
              ? item.createdAt
              : type === "personalRevenue"
              ? item.dateTime
              : item.dateTime
          );
          return date >= lastMonthStart && date <= lastMonthEnd;
        });
        break;
      default:
        filtered = data;
    }

    if (type === "booking") {
      return filtered.length;
    } else if (type === "expense") {
      // Sum up all expenses across all properties
      return filtered.reduce((total, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return total + amount;
      }, 0);
    } else {
      return filtered.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );
    }
  };

  useEffect(() => {
    const newValue = filterData(timeFilter);
    setFilteredValue(newValue);
  }, [timeFilter, data]);

  const getPercentageChange = () => {
    if (!data || data.length === 0) return 0;

    const currentValue = filterData(timeFilter);
    let previousValue;

    switch (timeFilter) {
      case "Today":
        previousValue = filterData("Last Week");
        break;
      case "Last Week":
        previousValue = filterData("Current Month");
        break;
      case "Current Month":
        previousValue = filterData("Last Month");
        break;
      default:
        previousValue = currentValue;
    }

    if (previousValue === 0) return 0;
    return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
  };

  const percentageChange = getPercentageChange();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1 text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">
            {type !== "booking"
              ? `₹${filteredValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}`
              : filteredValue}
          </p>
          <div className="flex items-center text-xs">
            <span
              className={cn(
                "mr-1 font-medium",
                percentageChange > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {percentageChange > 0 ? "+" : ""}
              {percentageChange}%
            </span>
            <span className="text-muted-foreground">from previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsDashboard() {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [globalTimeFilter, setGlobalTimeFilter] = useState(
    TIME_PERIODS.CURRENT_MONTH
  );

  const {
    revenues: personalRevenues,
    loading: personalRevenuesLoading,
    error: personalRevenuesError,
  } = useSelector((state) => state.personalRevenues);

  const { revenues: propertyRevenues } = useSelector((state) => state.revenue);
  const { bookings } = useSelector((state) => state.bookings);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.accountType);
      setUserId(decodedToken.id);
      setPropertyId(decodedToken.propertyId);

      dispatch(getAllRevenues(decodedToken.id));
      dispatch(fetchRevenues());
      dispatch(fetchBookings());

      const fetchExpenses = async () => {
        try {
          const expensesData =
            decodedToken.accountType === "ADMIN"
              ? await ExpenseService.getAllExpenses()
              : await ExpenseService.getExpenses();
          setExpenses(expensesData);
        } catch (err) {
          console.error("Error fetching expenses:", err.message);
        }
      };

      fetchExpenses();
    }
  }, [dispatch]);

  const filteredPropertyRevenues =
    userRole === "USER"
      ? propertyRevenues.filter((revenue) => revenue.propertyId === propertyId)
      : propertyRevenues;

  const relevantBookings =
    userRole === "USER"
      ? bookings.filter((booking) => booking.propertyId === propertyId)
      : bookings;

  const filteredExpenses =
    userRole === "USER"
      ? expenses.filter((expense) => expense.propertyId === propertyId)
      : expenses;

  const stats = [
    {
      title: "Total Personal Revenues",
      value: 0,
      icon: Users,
      data: personalRevenues,
      type: "personalRevenue",
    },
    {
      title: "Total Property Revenue",
      value: 0,
      icon: DollarSign,
      data: filteredPropertyRevenues,
      type: "propertyRevenue",
    },
    {
      title: "Property Expense",
      value: 0,
      icon: ShoppingCart,
      data: filteredExpenses,
      type: "expense",
    },
    {
      title: "Total Bookings",
      value: 0,
      icon: TrendingUp,
      data: relevantBookings,
      type: "booking",
    },
  ];

  if (personalRevenuesLoading) return <div className="p-6">Loading...</div>;
  if (personalRevenuesError)
    return <div className="p-6">Error: {personalRevenuesError}</div>;

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const processRevenueData = (data, period) => {
    if (!Array.isArray(data)) return [];

    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.dateTime);
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[key] = (acc[key] || 0) + parseFloat(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  const processExpenseVsRevenue = () => {
    const totalExpense = filteredExpenses.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    const totalRevenue = filteredPropertyRevenues.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    const totalPersonalRevenue = personalRevenues.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    return [
      { name: "Expenses", value: totalExpense, color: "#ff6b6b" },
      { name: "Property Revenue", value: totalRevenue, color: "#4ecdc4" },
      {
        name: "Personal Revenue",
        value: totalPersonalRevenue,
        color: "#45b7d1",
      },
    ];
  };

  const processBookingTrends = () => {
    const monthlyBookings = relevantBookings.reduce((acc, booking) => {
      const month = new Date(booking.bookingDateTime).toLocaleDateString(
        "en-US",
        { month: "short" }
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyBookings).map(([month, count]) => ({
      month,
      bookings: count,
    }));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap">
        <div className="w-full sm:w-auto">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-gray-600">
            Welcome to your Personalised Finance Tracker
          </p>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
          <Select value={globalTimeFilter} onValueChange={setGlobalTimeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.values(TIME_PERIODS).map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDate(new Date())}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <AmountCard key={index} {...stat} timeFilter={globalTimeFilter} />
        ))}
      </div>

      {/* New Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trends */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={processRevenueData(filteredPropertyRevenues)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4ecdc4"
                  fill="#4ecdc4"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Expense Distribution */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">
              Revenue vs Expense Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processExpenseVsRevenue()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {processExpenseVsRevenue().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Trends */}
        <Card className="p-4 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processBookingTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#45b7d1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StatsDashboard;
