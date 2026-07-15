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
export function ChartUserDistribution({ data: userDistribution }) {
  const activeCount = userDistribution?.active ?? 0;
  const inactiveCount = userDistribution?.inactive ?? 0;

  const total = activeCount + inactiveCount;

  const getPercent = (count) => {
    if (total === 0) return 0;
    return Number(((count / total) * 100).toFixed(1));
  };

  const data = [
    {
      name: "Active Users",
      value: getPercent(activeCount),
      color: "hsl(182, 59%, 54%)",
    },
    {
      name: "Inactive Users",
      value: getPercent(inactiveCount),
      color: "hsl(215, 20%, 65%)",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeItem = data[activeIndex] ||
    data[0] || { name: "Active Users", value: 0 };

  return (
    <Card className="rounded-xl shadow-sm bg-white gap-0 border border-slate-200 hover:border-blue-200 transition-all duration-300 w-full h-full flex flex-col py-5">
      <CardHeader className="px-0 pb-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-200">
          <DashboardHead
            title="User Distribution"
            subtitle="Account status distribution of users"
            Icon={LuUsersRound}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col lg:flex-row items-center gap-4 px-8 pt-2">
        {/* Left Side: Doughnut Chart */}
        <div className="relative flex justify-center items-center h-[260px] w-full lg:w-6/12">
          <ResponsiveContainer
            width="100%"
            height="100%"
            key={data.map((d) => d.value).join("-")}
          >
            <PieChart style={{ outline: "none" }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                stroke="white"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
                onClick={(_, index) => setActiveIndex(index)}
                className="cursor-pointer outline-none"
                style={{ outline: "none" }}
              >
                {data.map((entry, index) => (
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
            <span className="text-[32px] font-black text-[#1e293b] leading-tight tracking-tight transition-all duration-300">
              {activeItem.value}%
            </span>
            <span className="text-[13px] font-semibold text-slate-500 transition-all duration-300">
              {activeItem.name}
            </span>
          </div>
        </div>

        {/* Right Side: Legend List with Progress Bars */}
        <div className="flex-1 flex flex-col gap-3 w-full pl-0">
          {data.map((item, index) => (
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
                    {item.name}
                  </span>
                </div>
                <span
                  className={`text-[12px] ${activeIndex === index ? "font-bold text-slate-800" : "font-semibold text-slate-600"}`}
                >
                  {item.value}%
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
          ))}
        </div>
      </CardContent>

      {/* Info Banner Footer */}
      <CardFooter className="pt-1">
        <div className="mt-6 w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-brand-blue shrink-0" />
          </div>
          <span>
            {activeItem.name} represent {activeItem.value}% of total users
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
