import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  android: {
    label: "Android",
    color: "#10b981",
  },
  ios: {
    label: "iOS",
    color: "#3b82f6",
  },
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
};

export function VisitorChart({ filteredData, activeChart }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[220px] w-full"
    >
      <AreaChart
        data={filteredData}
        margin={{ top: 20, left: -10, right: 5, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillAndroid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillIos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="#e2e8f0"
          strokeDasharray="0"
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          minTickGap={10}
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
          tickFormatter={(value) => {
            if (!value) return "";
            if (
              typeof value === "string" &&
              (value.includes("AM") || value.includes("PM") || value.startsWith("Week") || !value.includes("-"))
            ) {
              return value;
            }
            const date = parseLocalDate(value);
            if (isNaN(date.getTime())) return value;
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          domain={[0, (dataMax) => (dataMax === 0 || isNaN(dataMax) ? 10 : dataMax)]}
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip
          cursor={{
            stroke: "#cbd5e1",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                if (!value) return "";
                if (
                  typeof value === "string" &&
                  (value.includes("AM") || value.includes("PM") || value.startsWith("Week") || !value.includes("-"))
                ) {
                  return value;
                }
                const date = parseLocalDate(value);
                if (isNaN(date.getTime())) return value;
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        {(activeChart === "both" || activeChart === "android") && (
          <Area
            dataKey="android"
            type="monotone"
            fill="url(#fillAndroid)"
            stroke="#10b981"
            strokeWidth={1}
            dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#ffffff" }}
            activeDot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
          />
        )}
        {(activeChart === "both" || activeChart === "ios") && (
          <Area
            dataKey="ios"
            type="monotone"
            fill="url(#fillIos)"
            stroke="#3b82f6"
            strokeWidth={1}
            dot={{ r: 3, stroke: "#3b82f6", strokeWidth: 1, fill: "#ffffff" }}
            activeDot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
