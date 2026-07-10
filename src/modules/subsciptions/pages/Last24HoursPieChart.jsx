/* eslint-disable no-unused-vars */
import React, { useMemo, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Calendar, TrendingUp, Activity } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#CCF2F4", // Lightest (New Subs)
  "#7FE5E5", // Medium Light (Consumables)
  "#2CBDBD", // Medium Dark (Cancellations)
  "#1A8F8F", // Darkest (Expiring)
];

const LABELS = [
  "New Subs",
  "Consumables Bought",
  "Cancellations",
  "Expiring Soon",
];

const LINE_LENGTH = 28; // px — how far the line extends past the doughnut edge
const CHIP_H = 14;      // chip height px
const CHIP_PX = 7;      // chip horizontal padding px

const Last24HoursPieChart = ({ last24HoursActivity }) => {
  const chartRef = useRef(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const { chartData, total, values, isEmpty, maxLabel, maxPct } =
    useMemo(() => {
      const {
        newSubscriptions = 0,
        walletPacksBought = 0,
        cancellations = 0,
        plansExpiringSoon = 0,
      } = last24HoursActivity || {};

      const values = [newSubscriptions, walletPacksBought, cancellations, plansExpiringSoon];
      const total = values.reduce((a, b) => a + b, 0);
      const isEmpty = total === 0;

      let maxVal = -1;
      let maxIdx = -1;
      values.forEach((v, i) => {
        if (v > maxVal) {
          maxVal = v;
          maxIdx = i;
        }
      });

      const maxLabel = isEmpty ? "" : LABELS[maxIdx];
      const maxPct = isEmpty ? 0 : ((maxVal / total) * 100).toFixed(0);

      const data = {
        labels: LABELS,
        datasets: [
          {
            label: "Activity",
            data: isEmpty ? [1] : values,
            backgroundColor: isEmpty ? ["#e2e8f0"] : COLORS,
            hoverBackgroundColor: isEmpty ? ["#e2e8f0"] : COLORS,
            hoverOffset: 0,
            borderWidth: 0,
          },
        ],
      };

      return { chartData: data, total, values, isEmpty, maxLabel, maxPct };
    }, [last24HoursActivity]);

  const options = {
    layout: { padding: 30 },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { animateRotate: true, animateScale: true },
    onHover: (_event, elements, chart) => {
      if (!elements || elements.length === 0) {
        setHoveredSlice(null);
        return;
      }

      const { index } = elements[0];
      const meta = chart.getDatasetMeta(0);
      const arc = meta.data[index];
      if (!arc) return;

      const angle = (arc.startAngle + arc.endAngle) / 2;
      const outerRadius = arc.outerRadius;

      // Chart center (accounts for layout.padding correctly)
      const xCenter = chart.chartArea.left + chart.chartArea.width / 2;
      const yCenter = chart.chartArea.top + chart.chartArea.height / 2;

      const val = chart.data.datasets[0].data[index];
      const tot = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      const pct = tot > 0 ? ((val / tot) * 100).toFixed(0) : "0";

      setHoveredSlice({
        index,
        pct,
        angle,
        color: COLORS[index],
        // Dot: exactly on the outer edge
        xDot: xCenter + Math.cos(angle) * outerRadius,
        yDot: yCenter + Math.sin(angle) * outerRadius,
        // Chip anchor: line end
        xChip: xCenter + Math.cos(angle) * (outerRadius + LINE_LENGTH),
        yChip: yCenter + Math.sin(angle) * (outerRadius + LINE_LENGTH),
        // SVG viewBox dimensions
        svgW: chart.width,
        svgH: chart.height,
      });
    },
  };

  // Compute chip rect dimensions for SVG rendering
  // Chip is always centered on the line end point — no left/right flipping
  const buildChip = (slice) => {
    if (!slice) return null;
    const label = `${slice.pct}%`;
    // Approximate text width: ~7px per char for bold 10px font
    const textW = label.length * 7;
    const chipW = textW + CHIP_PX * 2;
    const chipX = slice.xChip - chipW / 2; // centered on line end
    const chipY = slice.yChip - CHIP_H / 2;
    return { chipX, chipY, chipW, label };
  };

  const chip = buildChip(hoveredSlice);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full w-full">
      {/* ─── HEADER ─── */}
      <div className="px-4 py-[18px] border-b border-[#E5E7EB] flex items-center justify-between gap-4">
        <DashboardHead
          title="Last 24 Hours Activity"
          subtitle="Overview of daily events"
          Icon={Activity}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />

        {/* Total Events Box */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar size={18} className="text-[#2CBDBD]" strokeWidth={2} />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-500 leading-none">
              Total Events
            </span>
            <span className="text-xs font-bold text-slate-900">{total}</span>
          </div>
        </div>
      </div>

      {/* ─── BODY (CHART & LEGEND) ─── */}
      <div className="px-6 flex-1 flex flex-col lg:flex-row items-center">
        {/* Chart Side */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="h-[300px] sm:h-[250px] w-full sm:w-[250px] relative">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center text-slate-400 h-full w-full bg-slate-50 rounded-full">
                <p className="text-sm font-bold text-center">No Activity</p>
              </div>
            ) : (
              <>
                {/* Doughnut chart — no canvas plugin needed */}
                <Doughnut
                  ref={chartRef}
                  data={chartData}
                  options={options}
                />

                {/* ── SVG Overlay: line + chip rendered on hover ── */}
                {hoveredSlice && chip && (
                  <svg
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      overflow: "visible",
                    }}
                    viewBox={`0 0 ${hoveredSlice.svgW} ${hoveredSlice.svgH}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* 1. Line — drawn first so chip rect covers its end */}
                    <line
                      x1={hoveredSlice.xDot}
                      y1={hoveredSlice.yDot}
                      x2={hoveredSlice.xChip}
                      y2={hoveredSlice.yChip}
                      stroke={hoveredSlice.color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* 2. Chip background (on top of line, hides line end) */}
                    <rect
                      x={chip.chipX}
                      y={chip.chipY}
                      width={chip.chipW}
                      height={CHIP_H}
                      rx="10"
                      fill="#E8F6F6"
                    />

                    {/* 3. Dot on the doughnut edge */}
                    <circle
                      cx={hoveredSlice.xDot}
                      cy={hoveredSlice.yDot}
                      r="3"
                      fill={hoveredSlice.color}
                    />

                    {/* 4. Chip text (topmost) */}
                    <text
                      x={chip.chipX + chip.chipW / 2}
                      y={hoveredSlice.yChip + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#0F172A"
                      fontFamily='"Plus Jakarta Sans", sans-serif'
                    >
                      {chip.label}
                    </text>
                  </svg>
                )}

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {total}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 mt-1">
                    Total Events
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legend Side */}
        <div className="w-full lg:w-8/12 flex flex-col gap-0 border border-slate-200/60 rounded-2xl p-2 bg-white">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-[#9CA3AF] py-10">
              <p className="text-[11px] font-medium text-center">
                No activity recorded for the last 24 hours
              </p>
            </div>
          ) : (
            LABELS.map((label, i) => {
              const val = values[i];
              const pct = ((val / total) * 100).toFixed(0);

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-xl transition-colors hover:bg-slate-50 ${i !== LABELS.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-[10px]"
                      style={{ backgroundColor: COLORS[i] }}
                    ></div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-800 leading-none">
                        {label}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-1.5 leading-none">
                        {val} {val === 1 ? "event" : "events"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-xs"
                      style={{ color: COLORS[i] }}
                    >
                      {pct}%
                    </span>
                    <span className="font-black text-sm text-slate-900 w-6 text-right">
                      {val}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── FOOTER BANNER ─── */}
      <div className="px-5 pb-5">
        <div className="w-full bg-brand-aqua/5 border border-brand-aqua/40 rounded-xl text-foreground/80 p-1.5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#edffff] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <TrendingUp
              size={16}
              strokeWidth={1.8}
              className="text-[#2CBDBD]"
            />
          </div>
          <p className="text-sm font-medium">
            <strong className="text-[#2CBDBD] font-bold">{maxLabel}</strong>{" "}
            leads with{" "}
            <strong className="text-slate-900 font-bold">{maxPct}%</strong> of
            total events in the last 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Last24HoursPieChart;
