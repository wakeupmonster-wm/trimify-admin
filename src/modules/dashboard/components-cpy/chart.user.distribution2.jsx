import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Info, HelpCircle, Leaf, UtensilsCrossed } from "lucide-react";
import DashboardHead from "./dashboard.head";
import { LuSalad } from "react-icons/lu";

export default function ChartDietaryDistribution2({
  data: inputData,
  title = "Vegetarian Vs Non-Veg",
  subtitle = "Dietary preferences of users",
  Icon = LuSalad,
  iconColor = "text-amber-600",
  iconBg = "bg-amber-50",
  footnote,
}) {
  // Normalize incoming data format safely
  const normalizedData = React.useMemo(() => {
    if (inputData && !Array.isArray(inputData)) {
      return [];
    }
    return Array.isArray(inputData) ? inputData : [];
  }, [inputData]);

  // Calculate the grand total
  const total = React.useMemo(
    () =>
      normalizedData.reduce(
        (acc, curr) =>
          acc + (curr.count !== undefined ? curr.count : curr.value || 0),
        0,
      ),
    [normalizedData],
  );

  // Compute final structural dataset with respective UX colors and category icons
  const chartData = React.useMemo(() => {
    if (normalizedData.length === 0) {
      return [
        {
          name: "Unspecified",
          value: 54,
          count: 402,
          color: "#007ec6",
          bg: "bg-blue-50/50",
          border: "border-blue-100",
          icon: HelpCircle,
        },
        {
          name: "Non-Vegetarian",
          value: 43,
          count: 316,
          color: "#3dc5a8",
          bg: "bg-emerald-50/50",
          border: "border-emerald-100",
          icon: UtensilsCrossed,
        },
        {
          name: "Vegetarian",
          value: 3,
          count: 24,
          color: "#e17b34",
          bg: "bg-orange-50/40",
          border: "border-orange-100",
          icon: Leaf,
        },
      ];
    }

    return normalizedData.map((item) => {
      const name = item.name || item.label || "Unknown";
      const hasCount = item.count !== undefined;
      const rawCount = hasCount ? item.count : item.value || 0;
      const percent =
        total === 0 ? 0 : Number(((rawCount / total) * 100).toFixed(0));

      // UI Context mapping based on naming conventions
      let uiMeta = {
        color: "#007ec6",
        bg: "bg-blue-100/50",
        border: "border-blue-200",
        icon: HelpCircle,
      };
      if (name.toLowerCase().includes("non-veg")) {
        uiMeta = {
          color: "#3dc5a8",
          bg: "bg-emerald-100/50",
          border: "border-emerald-200",
          icon: UtensilsCrossed,
        };
      } else if (name.toLowerCase().includes("veg")) {
        uiMeta = {
          color: "#e17b34",
          bg: "bg-orange-100/50",
          border: "border-orange-200",
          icon: Leaf,
        };
      }

      return {
        ...item,
        name,
        count: rawCount,
        value: percent,
        ...uiMeta,
      };
    });
  }, [normalizedData, total]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeItem = chartData[activeIndex] ||
    chartData[0] || { name: "N/A", value: 0, count: 0 };

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

      {/* Main Content Area Split */}
      <CardContent className="flex-1 flex flex-col lg:flex-row items-center gap-4 pl-0 pr-6 pt-2">
        {/* Left Side: Thicker Premium Donut View */}
        <div className="relative flex justify-center items-center h-[230px] w-full md:w-[45%] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                startAngle={95}
                endAngle={-265}
                onClick={(_, index) => setActiveIndex(index)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all duration-300 cursor-pointer outline-none"
                    style={{ opacity: activeIndex === index ? 1 : 0.85 }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Meta Info Block */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {activeItem.value}%
            </span>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
              Total Users
            </span>
          </div>
        </div>

        {/* Right Side: Enhanced Structured Grid Segment Cards */}
        <div className="flex-1 w-full flex flex-col gap-3.5">
          {chartData.map((item, index) => {
            const isSelected = activeIndex === index;
            const StatusIcon = item.icon;

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full flex flex-col gap-2.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${item.bg} ${item.border} shadow-xs`
                    : "bg-transparent border-transparent hover:bg-slate-50/50"
                }`}
              >
                {/* Meta text row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-slate-400">
                      Category:
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {item.name}
                    </span>
                  </div>
                  {/* Category contextual status icon right aligned */}
                  <StatusIcon
                    size={16}
                    className={
                      isSelected ? "text-slate-700" : "text-slate-400/80"
                    }
                  />
                </div>

                {/* Sub row showing split metric values metrics info */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-normal">
                      Total Users:
                    </span>
                    <span className="text-slate-800 font-bold text-sm">
                      {item.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-normal">
                      Percentage:
                    </span>
                    <span className="text-slate-800 font-bold text-sm">
                      {item.value}%
                    </span>
                  </div>
                </div>

                {/* Micro Linear Progress Tracker Base */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
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

      {/* Primary Highlight Insight Footnote Container */}
      <CardFooter className="pt-1">
        <div className="mt-6 w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-blue-400 shrink-0" />
          </div>
          <span>
            {footnote
              ? footnote
              : `Critical Insight: A large share of users haven't filled this field in — tracked as Unspecified rather than dropped.`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
