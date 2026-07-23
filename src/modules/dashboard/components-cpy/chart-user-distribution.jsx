import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import DashboardHead from "./dashboard.head";
import { LuUsersRound } from "react-icons/lu";

export default function ChartUserDistribution({
  data: inputData,
  title = "User Distribution",
  subtitle = "Account status distribution of users",
  Icon = LuUsersRound,
  iconColor = "text-slate-600",
  iconBg = "bg-slate-100/50",
  footnote,
}) {
  // console.log("inputData: ", inputData)

  // const total = inputData.reduce((sum, d) => sum + (d.value || 0), 0);
  // Support legacy { active, inactive } object format for backwards compatibility
  const normalizedData = React.useMemo(() => {
    if (
      inputData &&
      !Array.isArray(inputData) &&
      ("active" in inputData || "inactive" in inputData)
    ) {
      return [
        {
          name: "Active Users",
          count: inputData.active || 0,
          color: "#15B097",
        },
        {
          name: "Inactive Users",
          count: inputData.inactive || 0,
          color: "#2B2829",
        },
      ];
    }
    return Array.isArray(inputData) ? inputData : [];
  }, [inputData]);

  const total = React.useMemo(
    () =>
      normalizedData.reduce(
        (acc, curr) =>
          acc + (curr.count !== undefined ? curr.count : curr.value || 0),
        0,
      ),
    [normalizedData],
  );

  const chartData = React.useMemo(() => {
    if (normalizedData.length === 0) {
      return [
        { name: "Active Users", value: 0, color: "#15B097" },
        { name: "Inactive Users", value: 0, color: "#2B2829" },
      ];
    }

    return normalizedData.map((item) => {
      // If count is provided, compute percentage. Otherwise assume 'value' is already the percentage.
      const hasCount = item.count !== undefined;
      const percent = hasCount
        ? total === 0
          ? 0
          : Number(((item.count / total) * 100).toFixed(1))
        : item.value || 0;

      return {
        ...item,
        value: percent,
      };
    });
  }, [normalizedData, total]);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeItem = chartData[activeIndex] ||
    chartData[0] || { name: "N/A", value: 0 };

  return (
    <Card className="rounded-xl shadow-sm bg-white gap-0 border border-slate-300/60 hover:border-blue-200 transition-all duration-300 w-full h-full flex flex-col py-5">
      <CardHeader className="px-0 pb-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-300/60">
          <DashboardHead
            title={title}
            subtitle={subtitle}
            Icon={Icon}
            iconColor={iconColor}
            iconBg={iconBg}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col lg:flex-row items-center gap-4 pl-0 pr-6 pt-2">
        {/* Left Side: Doughnut Chart */}
        <div className="relative flex justify-center items-center h-[270px] w-full lg:w-[42%]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            key={chartData.map((d) => d.value).join("-")}
          >
            <PieChart style={{ outline: "none" }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                stroke="white"
                strokeWidth={0.5}
                startAngle={90}
                endAngle={-270}
                onClick={(_, index) => setActiveIndex(index)}
                className="cursor-pointer outline-none"
                style={{ outline: "none" }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === index ? 1 : 0.8}
                    style={{ outline: "none" }}
                    className="transition-all duration-300 hover:opacity-100 border-none ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Inner Text Center overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-[#1e293b] leading-tight tracking-tight transition-all duration-300">
              {total.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mt-1">
              Total
            </span>
          </div>
        </div>

        {/* Right Side: Legend List with Progress Bars */}
        <div
          className={`flex-1 flex flex-col gap-2 w-full px-1 custom-scrollbar-chart ${chartData.length > 4 ? "max-h-[220px] overflow-y-auto overflow-x-hidden pr-2" : ""}`}
        >
          {chartData.map((item, index) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div
                key={index}
                className={`flex flex-col gap-1.5 cursor-pointer transition-all duration-300 ${activeIndex === index ? "opacity-100 scale-[1.02]" : "opacity-80 hover:opacity-100"}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-[12px] ${activeIndex === index ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] ${activeIndex === index ? "font-bold text-slate-800" : "font-semibold text-slate-600"}`}
                  >
                    {item.value.toLocaleString()} · {pct}%
                  </span>
                </div>

                {/* Progress Bar under the text */}
                <div
                  className="w-full h-1.5 bg-slate-300 rounded-full overflow-hidden ml-[24px]"
                  style={{ width: "calc(100% - 24px)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Info Banner Footer */}
      <CardFooter className="pt-1">
        <div className="mt-6 w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-app-primary2 shrink-0" />
          </div>
          <span>
            {footnote
              ? footnote
              : `${activeItem.label} represent ${activeItem.value}% of total users`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
