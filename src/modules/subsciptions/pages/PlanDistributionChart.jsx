import React, { useMemo } from "react";
import { Layers } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ Custom Tooltip Positioner: Anchors to the left outer edge or right outer edge
Tooltip.positioners.outerEdge = function (elements) {
  if (!elements.length) {
    return false;
  }
  const chart = this.chart;
  const arc = elements[0].element;

  // Calculate center of the chart area
  const cx = (chart.chartArea.left + chart.chartArea.right) / 2;
  const cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;

  // Get outer radius
  const radius = arc.outerRadius || 90;

  // Calculate center angle of the segment
  const angle = (arc.startAngle + arc.endAngle) / 2;
  let normAngle = angle % (2 * Math.PI);
  if (normAngle < 0) normAngle += 2 * Math.PI;

  // If angle falls on the left hemisphere (between 90 and 270 degrees)
  const isLeftSide = normAngle > Math.PI / 2 && normAngle < (3 * Math.PI) / 2;

  return {
    x: isLeftSide ? cx - radius : cx + radius, // Pop out to Left or Right edge
    y: cy, // Centered vertically
  };
};

// ✅ Official HTML Mockup Colors
const COLORS = [
  "#3b82f6", // Blue
  "#f472b6", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#ec4899", // Pink-500
];

const PlanDistributionChart = ({ planData = [] }) => {
  const { chartData, total, names, values, bgColors } = useMemo(() => {
    const names = [];
    const values = [];
    const bgColors = [];

    (planData || []).forEach((item, i) => {
      names.push(item.name || `Plan ${i + 1}`);
      values.push(Number(item.subscribers || 0));
      bgColors.push(COLORS[i % COLORS.length]);
    });

    const total = values.reduce((a, b) => a + b, 0);

    const data = {
      labels: names,
      datasets: [
        {
          label: "Active Users",
          data: total === 0 ? [1] : values,
          backgroundColor: total === 0 ? ["#e2e8f0"] : bgColors,
          hoverOffset: 0, // Hover par bahar (pop out) aane wala effect band karne ke liye 0 kar diya
          borderWidth: 0,
          borderColor: "transparent",
        },
      ],
    };

    return { chartData: data, total, names, values, bgColors };
  }, [planData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%", // Matches HTML mock proportion
    layout: {
      padding: 10, // ✅ Fix: Adds internal canvas padding so hoverOffset doesn't get cut off
    },
    plugins: {
      legend: {
        display: false, // Custom legend niche hai
      },
      tooltip: {
        enabled: total > 0,
        backgroundColor: "rgba(39, 39, 42, 0.95)", // Match dark theme style loosely
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 6,
        titleFont: {
          size: 14,
          weight: "bold",
          family: "system-ui, sans-serif",
        },
        bodyFont: { size: 13, family: "system-ui, sans-serif" },
        displayColors: true, // Show small color box in tooltip
        boxPadding: 4,
        position: "outerEdge", // ✅ Dynamically places coordinate on left or right edge
        xAlign: (context) => {
          // If the tooltip is on the left side of the chart, we want the body to go LEFT of the caret ("right" alignment)
          const tooltip = context.tooltip;
          if (!tooltip) return "left";
          const cx = context.chart.width / 2;
          return tooltip.caretX < cx ? "right" : "left";
        },
        yAlign: "center", // ✅ Center the caret vertically
        callbacks: {
          // ✅ FIX: Sirf Value aur Percentage return karo. Name mat return karo.
          // Chart.js automatically Name ko Title mein dikhata hai.
          label: (context) => {
            const val = context.parsed;
            const pct = ((val / total) * 100).toFixed(1);
            return ` ${val} Users (${pct}% users)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-[10px]">
        <DashboardHead
          title="Plan Distribution"
          subtitle="Active Subscription Tiers"
          Icon={Layers}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />
      </div>

      <div className="p-6 text-center flex-1 flex flex-col justify-center items-center gap-10">
        <div className="h-[200px] w-full relative flex justify-center">
          <Doughnut data={chartData} options={options} />
        </div>

        <div className="flex flex-col gap-3 w-full px-2">
          {total === 0 ? (
            <div className="flex flex-col items-center justify-center text-[#9CA3AF] py-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mb-2 opacity-50"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <p className="text-xs font-bold text-center">
                No plan data available
              </p>
            </div>
          ) : (
            names.map((name, i) => {
              const pct = ((values[i] / total) * 100).toFixed(0);
              return (

                <div
                  key={i}
                  className="flex items-center justify-between text-[12px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[10px] h-[10px] rounded-[2px]"
                      style={{ backgroundColor: bgColors[i] }}
                    ></div>
                    <span className="font-semibold text-[#6B7280]">{name}</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-[#1F2937]">
                      {values[i]}
                    </span>
                    <span className="text-[#9CA3AF] ml-1">users ({pct}%)</span>
                  </div>
                </div>
                // <div
                //   key={i}
                //   className="flex items-center justify-between text-[12px]"
                // >
                //   <div className="flex items-center gap-2">
                //     <div
                //       className="w-[10px] h-[10px] rounded-[2px]"
                //       style={{ backgroundColor: bgColors[i] }}
                //     ></div>
                //     <span className="font-semibold text-[#6B7280]">{name}</span>
                //   </div>
                //   <div>
                //     <span className="font-extrabold text-[#1F2937]">
                //       {values[i]}
                //     </span>
                //     <span className="text-[#9CA3AF] ml-1">Users</span>
                //     {/* {pct%} */}
                //   </div>
                // </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDistributionChart;
