import React from "react";
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IconChartBarOff } from "@tabler/icons-react";

export default function SubscriberGrowthChart({
  subscriberGrowthChartData,
  isSubscriberGrowthEmpty,
}) {
  // Scale net values to be between 0.75 and 1
  const scaledData = subscriberGrowthChartData?.map((item) => {
    const maxBarValue = Math.max(item.new || 0, item.cancelled || 0);
    // Scale net to be 75% of max bar value (keeping it between 0.75 and 1)
    const netScaled = Math.max((item.net || 0) * 0.75, maxBarValue * 0.75);

    return {
      ...item,
      net: Math.min(netScaled, maxBarValue),
    };
  }) || [];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden h-[440px] flex flex-col">
      <div className="p-[18px_22px] border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center bg-[#F1F5F9] text-[#475569]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#1F2937]">
              Subscriber Growth
            </div>
            <div className="text-[11.5px] text-[#9CA3AF] mt-[1px]">
              New vs cancelled vs net
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 min-h-0 overflow-hidden">
        {isSubscriberGrowthEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
            <IconChartBarOff className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold text-center">
              No growth data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={scaledData} barGap={2} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="#F1F5F9"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
                width={35}
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                  fontWeight: 600,
                  dx: -5,
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1F2937",
                  color: "#F8FAFC",
                  fontSize: "12px",
                  padding: "12px",
                }}
                itemStyle={{ color: "#F8FAFC" }}
                labelStyle={{ color: "#FFFFFF", fontWeight: 700 }}
                cursor={false}
              />

              {/* Bars First (Behind) */}
              <Bar
                dataKey="new"
                // fill="#4F46E5"
                fill="#007FC0" // primary2
                radius={[4, 4, 0, 0]}
                name="New"
                barSize={20}
              />
              <Bar
                dataKey="cancelled"
                // fill="#EF4444"
                fill="#FF5252" // caloriesRed
                radius={[4, 4, 0, 0]}
                name="Cancelled"
                barSize={20}
              />

              {/* Area/Line Last (On Top - In Front) */}
              <Area
                type="monotone"
                dataKey="net"
                name="Net Growth"
                // stroke="#10B981"
                stroke="#15B097" // cardGreen
                strokeWidth={3}
                fill="transparent"
                fillOpacity={0}
                dot={{
                  fill: "#fff",
                  // stroke: "#10B981",
                  stroke: "#15B097",
                  strokeWidth: 2,
                  r: 4,
                }}
                // activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: "#15B097", strokeWidth: 2 }}
              />

              <Legend
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#64748B",
                  paddingTop: "20px",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}