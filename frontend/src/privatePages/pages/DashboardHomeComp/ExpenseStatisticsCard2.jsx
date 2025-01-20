import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B6B6B",
  "#77DD77",
];

const ExpenseStatisticsCard = ({ expenses, isAdmin }) => {
  const [showMonthlyChart, setShowMonthlyChart] = useState(false);
  const [showWeeklyChart, setShowWeeklyChart] = useState(false);
  const [showCategoryChart, setShowCategoryChart] = useState(false);
  const [showPropertyChart, setShowPropertyChart] = useState(false);

  const calculateMonthlyData = (expenses) => {
    const monthlyMap = {};
    let total = 0;
    expenses.forEach((expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "short",
      });
      if (!monthlyMap[month]) monthlyMap[month] = 0;
      monthlyMap[month] += expense.amount;
      total += expense.amount;
    });
    return {
      data: Object.keys(monthlyMap).map((month) => ({
        month,
        amount: monthlyMap[month],
      })),
      total,
    };
  };

  const calculateWeeklyData = (expenses) => {
    const weeklyMap = {};
    let total = 0;
    expenses.forEach((expense) => {
      const dayOfWeek = new Date(expense.date).toLocaleString("default", {
        weekday: "short",
      });
      if (!weeklyMap[dayOfWeek]) weeklyMap[dayOfWeek] = 0;
      weeklyMap[dayOfWeek] += expense.amount;
      total += expense.amount;
    });
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      data: daysOrder.map((day) => ({
        day,
        amount: weeklyMap[day] || 0,
      })),
      total,
    };
  };

  const calculateExpensesByCategory = (expenses) => {
    const categoryMap = {};
    let total = 0;
    expenses.forEach((expense) => {
      if (!categoryMap[expense.category]) categoryMap[expense.category] = 0;
      categoryMap[expense.category] += expense.amount;
      total += expense.amount;
    });
    return {
      data: Object.keys(categoryMap).map((category) => ({
        name: category,
        value: categoryMap[category],
      })),
      total,
    };
  };

  const calculateExpensesByProperty = (expenses) => {
    const propertyMap = {};
    let total = 0;
    expenses.forEach((expense) => {
      if (!propertyMap[expense.propertyName])
        propertyMap[expense.propertyName] = 0;
      propertyMap[expense.propertyName] += expense.amount;
      total += expense.amount;
    });
    return {
      data: Object.keys(propertyMap).map((property) => ({
        property,
        amount: propertyMap[property],
      })),
      total,
    };
  };

  const { data: monthlyData, total: monthlyTotal } =
    calculateMonthlyData(expenses);
  const { data: weeklyData, total: weeklyTotal } =
    calculateWeeklyData(expenses);
  const { data: categoryData, total: categoryTotal } =
    calculateExpensesByCategory(expenses);
  const { data: propertyData, total: propertyTotal } =
    calculateExpensesByProperty(expenses);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CardHeaderContent = ({ title, total, showChart, setShowChart }) => (
    <div className="w-full flex items-start justify-between">
      <div className="flex items-center gap-4">
        <CardTitle>{title}</CardTitle>
        <span className="text-red-500 text-sm font-medium">
          {formatCurrency(total)}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-gray-600 -mt-1"
        onClick={() => setShowChart(!showChart)}
      >
        {showChart ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Expenses Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardHeaderContent
              title="Monthly Expenses"
              total={monthlyTotal}
              showChart={showMonthlyChart}
              setShowChart={setShowMonthlyChart}
            />
          </CardHeader>
          {showMonthlyChart && (
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer>
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="month" tickMargin={10} />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      width={80}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={COLORS[0]}
                      strokeWidth={3}
                      dot={{ fill: COLORS[0], r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Weekly Expenses Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardHeaderContent
              title="Weekly Expenses"
              total={weeklyTotal}
              showChart={showWeeklyChart}
              setShowChart={setShowWeeklyChart}
            />
          </CardHeader>
          {showWeeklyChart && (
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="day" tickMargin={10} />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      width={80}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="amount">
                      {weeklyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Category Expenses Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardHeaderContent
              title="Expenses by Category"
              total={categoryTotal}
              showChart={showCategoryChart}
              setShowChart={setShowCategoryChart}
            />
          </CardHeader>
          {showCategoryChart && (
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Property Expenses Card */}
        {isAdmin && (
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardHeaderContent
                title="Expenses by Property"
                total={propertyTotal}
                showChart={showPropertyChart}
                setShowChart={setShowPropertyChart}
              />
            </CardHeader>
            {showPropertyChart && (
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <BarChart
                      data={propertyData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="property" tickMargin={10} />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                        width={80}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="amount">
                        {propertyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpenseStatisticsCard;
