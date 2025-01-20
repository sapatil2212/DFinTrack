"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

export const RevenueChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={{
          personal: { label: "Personal Revenue", color: colors[0] },
          property: { label: "Property Revenue", color: colors[1] },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="personal" stroke={colors[0]} />
            <Line type="monotone" dataKey="property" stroke={colors[1]} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const BookingsChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Bookings by Month</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={{
          bookings: { label: "Bookings", color: colors[2] },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="bookings" fill={colors[2]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const ExpensePieChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Expense Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={data.reduce((acc, item, index) => {
          acc[item.name] = {
            label: item.name,
            color: colors[index % colors.length],
          };
          return acc;
        }, {})}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);
