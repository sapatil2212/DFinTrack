"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = [
  { name: "Sep", revenue: 22, sales: 28 },
  { name: "Oct", revenue: 10, sales: 25 },
  { name: "Nov", revenue: 20, sales: 35 },
  { name: "Dec", revenue: 25, sales: 30 },
  { name: "Jan", revenue: 12, sales: 42 },
  { name: "Feb", revenue: 20, sales: 35 },
  { name: "Mar", revenue: 35, sales: 62 },
  { name: "Apr", revenue: 20, sales: 50 },
  { name: "May", revenue: 42, sales: 58 },
  { name: "Jun", revenue: 20, sales: 35 },
  { name: "Jul", revenue: 30, sales: 38 },
  { name: "Aug", revenue: 43, sales: 50 },
];

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState("Day");

  return (
    <Card className="w-full border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div>
                <div className="text-sm font-medium">Total Revenue</div>
                <div className="text-xs text-muted-foreground">
                  12.04.2022 - 12.05.2022
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div>
                <div className="text-sm font-medium">Total Bookings</div>
                <div className="text-xs text-muted-foreground">
                  12.04.2022 - 12.05.2022
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {["Day", "Week", "Month"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
