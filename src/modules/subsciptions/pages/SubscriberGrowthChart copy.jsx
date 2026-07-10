import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IconChartBarOff } from "@tabler/icons-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-[12px] p-[12px_16px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] font-['Plus_Jakarta_Sans'] min-w-[160px]">
        <p className="text-[12px] font-bold text-slate-800 mb-2 capitalize">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-6 text-[12px]">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill || item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="text-slate-900 font-extrabold">
                {item.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function SubscriberGrowthChart({
  subscriberGrowthChartData,
  isSubscriberGrowthEmpty,
}) {
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
      <div className="flex-1 p-6 min-h-0">
        {isSubscriberGrowthEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
            <IconChartBarOff className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold text-center">
              No growth data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={subscriberGrowthChartData} barGap={4}>
              <CartesianGrid
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "Plus Jakarta Sans",
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
                width={35}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: 600,
                  fontFamily: "Plus Jakarta Sans",
                  dx: -5,
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc", radius: 6 }}
              />
              <Bar
                dataKey="new"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                name="New"
                barSize={25}
              />
              <Bar
                dataKey="cancelled"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Cancelled"
                barSize={20}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#10B981"
                strokeWidth={1.5}
                name="Net Growth"
                dot={{ stroke: "#10B981", strokeWidth: 1.5, fill: "#fff", r: 3 }}
                activeDot={{ stroke: "#10B981", strokeWidth: 1.5, fill: "#fff", r: 5 }}
              />
              <Legend
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#64748B",
                  fontFamily: "Plus Jakarta Sans",
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
