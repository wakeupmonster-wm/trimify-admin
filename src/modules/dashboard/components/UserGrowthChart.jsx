import React, { useMemo } from "react";
import { EmptyState } from "./EmptyState";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Info } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { LuActivity } from "react-icons/lu";

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(182 59% 54%)",
  },
  female: {
    label: "Female",
    color: "hsl(182 59% 82%)",
  },
};

export function UserGrowthChart({ data, selectedDate }) {
  // Process and aggregate data based on the actual range length provided in data
  const displayData = useMemo(() => {
    if (!data) return null;

    const signups = data.userSignupTrend || [];
    const active = data.activeUsersTrend || [];

    // The backend now provides pre-formatted chronological strings in the `date` field.
    // e.g. '14 Jul', 'Week 1', 'Apr'. We just need to merge the two arrays while preserving order.
    const uniqueDates = Array.from(
      new Set([...signups.map((s) => s.date), ...active.map((a) => a.date)]),
    );

    const formattedData = uniqueDates.map((dateLabel) => {
      const signupPoint = signups.find((s) => s.date === dateLabel);
      const activePoint = active.find((a) => a.date === dateLabel);
      return {
        day: dateLabel, // X-Axis label
        signups: signupPoint ? signupPoint.total : 0,
        activeUsers: activePoint ? activePoint.active_users : 0,
      };
    });

    return {
      data: formattedData,
      subtitle: "Signups and active users over time",
    };
  }, [data]);

  if (!displayData) return null;

  const hasData =
    displayData.data &&
    displayData.data.some((d) => (d.male || 0) > 0 || (d.female || 0) > 0);

  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col gap-5 py-5 h-full">
      <div className="flex items-center justify-between pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title="User Growth by Gender"
          subtitle={displayData.subtitle || "Daily signups for the last 7 days"}
          Icon={LuActivity}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
          tooltipText="Number of new user registrations broken down by gender over the selected time period."
        />
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[110px] h-8 text-xs font-semibold text-slate-500 hover:text-white bg-slate-50 hover:bg-app-primary5 border-slate-300/60 hover:border-transparent rounded-md transition-all duration-300 focus:ring-0 focus:ring-offset-0"
            aria-label="Select time range"
          >
            <SelectValue placeholder="7 Days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-300/60">
            <SelectItem value="today" className="text-xs">
              Today
            </SelectItem>
            <SelectItem value="7d" className="text-xs">
              7 Days
            </SelectItem>
            <SelectItem value="30d" className="text-xs">
              30 Days
            </SelectItem>
            <SelectItem value="3m" className="text-xs">
              3 Months
            </SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex-1 min-h-[200px] w-full px-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="h-full w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-white"
          >
            <BarChart
              data={displayData.data}
              margin={{ top: 0, right: 0, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                domain={[0, "auto"]}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-white" />}
              />
              <Bar
                dataKey="male"
                stackId="a"
                fill="var(--color-male)"
                radius={[0, 0, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="female"
                stackId="a"
                fill="var(--color-female)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <ChartLegend content={<ChartLegendContent />} className="mt-0" />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            title="No Activity"
            description="No user growth data found for the selected period."
          />
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 mx-6 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
        <div className="w-5 h-5 rounded-full flex items-center justify-center">
          <Info size={12} className="text-brand-blue ml-auto" />
        </div>
        {displayData.insight || "Male signups are up 18% this week"}
      </div>
    </div>
  );
}
