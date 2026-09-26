import React from "react";
import { PieChart, Pie, Tooltip, Label, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart as PieChartIcon } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { SECTION_CHART_COLORS, STATUS_COLORS } from "@/config/theme.config";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const color = item.fillColor || item.fill;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2 z-50 pointer-events-none whitespace-nowrap">
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-3">
        <span className="text-slate-500 text-xs font-medium">{item.name}</span>
        <span className="text-slate-900 text-xs font-bold">
          {item.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

/**
 * Reusable donut/pie widget — matches the RevenueBreakdown card shell so
 * plan-type, transaction-status, user-goal, gender & diet-preference charts
 * all read as one visual system.
 */
const DonutStatCard = ({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-700",
  iconBg = "bg-slate-50",
  tooltipText,
  data = [],
  centerLabel = "TOTAL",
  footnote,
  palette,
}) => {
  const isGoals =
    title === "User Goal Distribution" ||
    title?.toLowerCase().includes("user goal") ||
    title?.toLowerCase().includes("goal distribution");
  const isGender = title === "Gender Distribution";
  const isDiet =
    title === "Vegetarian vs Non-veg" ||
    title?.toLowerCase().includes("vegetarian") ||
    title?.toLowerCase().includes("diet");
  const isProgramSplit =
    title === "Program Enrollment Split" ||
    title?.toLowerCase().includes("program enrollment");
  const isPlanType =
    title === "Users by Plan Type" ||
    title?.toLowerCase().includes("plan type");
  const isTxHealth =
    title === "Transaction Health" ||
    title?.toLowerCase().includes("transaction health") ||
    title?.toLowerCase().includes("transaction status");

  const hasData = data.some((d) => d.value > 0);
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const EmptyIcon = Icon || PieChartIcon;

  // Controlled restrained palette assignment based on card type
  let processedData = [];
  if (isGender) {
    const COLOR_MALE =
      palette?.male ||
      SECTION_CHART_COLORS?.dashboard?.gender?.male ||
      "#007fc0";
    const COLOR_FEMALE =
      palette?.female ||
      SECTION_CHART_COLORS?.dashboard?.gender?.female ||
      "#3dc1ff";
    const GREY =
      palette?.other ||
      SECTION_CHART_COLORS?.dashboard?.gender?.other ||
      "#D9E0E6";

    const maleEntry = data.find(
      (d) => (d.label || d.name || "").toLowerCase() === "male",
    );
    const femaleEntry = data.find(
      (d) => (d.label || d.name || "").toLowerCase() === "female",
    );
    const otherEntry = data.find((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      return (
        lbl === "other" ||
        lbl === "others" ||
        lbl === "unspecified" ||
        lbl === "unknown" ||
        lbl === "none"
      );
    });

    processedData = [
      {
        label: "Male",
        name: "Male",
        value: maleEntry ? Number(maleEntry.value) || 0 : 0,
        color: COLOR_MALE,
      },
      {
        label: "Female",
        name: "Female",
        value: femaleEntry ? Number(femaleEntry.value) || 0 : 0,
        color: COLOR_FEMALE,
      },
      {
        label: "Other",
        name: "Other",
        value: otherEntry ? Number(otherEntry.value) || 0 : 0,
        color: GREY,
      },
    ];
  } else if (isDiet) {
    const COLOR_VEG =
      palette?.veg ||
      SECTION_CHART_COLORS?.dashboard?.diet?.veg ||
      "#007fc0";
    const COLOR_NON_VEG =
      palette?.nonVeg ||
      SECTION_CHART_COLORS?.dashboard?.diet?.nonVeg ||
      "#3dc1ff";
    const GREY = "#D9E0E6";

    // Filter out Unspecified / unknown / none
    const validData = data.filter((d) => {
      const lbl = (d.label || d.name || "").toLowerCase().trim();
      return (
        lbl !== "" &&
        !lbl.includes("unspecified") &&
        !lbl.includes("other") &&
        !lbl.includes("unknown") &&
        !lbl.includes("none")
      );
    });

    const vegItem = validData.find(
      (d) =>
        (d.label || d.name || "").toLowerCase().includes("veg") &&
        !(d.label || d.name || "").toLowerCase().includes("non"),
    );
    const nonVegItem = validData.find((d) =>
      (d.label || d.name || "").toLowerCase().includes("non"),
    );

    const orderedData = [];
    if (vegItem) orderedData.push(vegItem);
    if (nonVegItem) orderedData.push(nonVegItem);
    validData.forEach((d) => {
      if (!orderedData.includes(d)) orderedData.push(d);
    });

    processedData = orderedData.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      let color = d.color;
      if (lbl.includes("non")) {
        color = COLOR_NON_VEG;
      } else if (lbl.includes("veg")) {
        color = COLOR_VEG;
      } else {
        color = GREY;
      }
      return { ...d, color };
    });
  } else if (isProgramSplit) {
    const PROGRAM_BLUES =
      SECTION_CHART_COLORS?.dashboard?.programSplit || [
        "#007fc0",
        "#009dee",
        "#1cb2ff",
        "#3dc1ff",
        "#49c1ff",
        "#77d1ff",
      ];
    const GREY = "#D9E0E6";

    const sorted = [...data].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    let activeCount = 0;
    processedData = sorted.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      const isOther =
        lbl.includes("other") ||
        lbl.includes("unspecified") ||
        lbl.includes("unknown") ||
        lbl.includes("none");

      let color = d.color;
      if (isOther) {
        color = GREY;
      } else {
        color =
          PROGRAM_BLUES[activeCount % PROGRAM_BLUES.length] || "#007fc0";
        activeCount++;
      }
      return { ...d, color };
    });
  } else if (isGoals) {
    const GOAL_PALETTE =
      SECTION_CHART_COLORS?.dashboard?.userGoals || [
        "#007fc0",
        "#009dee",
        "#1cb2ff",
        "#3dc1ff",
        "#49c1ff",
        "#77d1ff",
      ];
    const sorted = [...data].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    let activeCount = 0;
    processedData = sorted.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      const isInactive =
        lbl.includes("unspecified") ||
        lbl.includes("other") ||
        lbl.includes("inactive") ||
        lbl.includes("none");
      let color = d.color;
      if (isInactive) {
        color = "#D9E0E6";
      } else {
        color = GOAL_PALETTE[activeCount % GOAL_PALETTE.length] || "#007fc0";
        activeCount++;
      }
      return { ...d, color, isInactive };
    });
  } else if (isPlanType) {
    const PLAN_COLORS =
      SECTION_CHART_COLORS?.subscription?.planType || [
        "#007fc0",
        "#3dc1ff",
        "#49c1ff",
        "#66ceff",
      ];
    processedData = data.map((d, idx) => {
      let color = d.color || PLAN_COLORS[idx % PLAN_COLORS.length];
      return { ...d, color };
    });
  } else if (isTxHealth) {
    const TX_COLORS = SECTION_CHART_COLORS?.subscription?.txHealth || {
      failed: STATUS_COLORS.failed,
      refunded: STATUS_COLORS.refunded,
      success: STATUS_COLORS.success,
      disputed: STATUS_COLORS.disputed,
      pending: STATUS_COLORS.pending,
    };
    processedData = data.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      let color = d.color;
      if (
        lbl.includes("success") ||
        lbl.includes("paid") ||
        lbl.includes("active")
      ) {
        color = TX_COLORS.success;
      } else if (lbl.includes("fail")) {
        color = TX_COLORS.failed;
      } else if (lbl.includes("refund")) {
        color = TX_COLORS.refunded;
      } else if (lbl.includes("dispute")) {
        color = TX_COLORS.disputed;
      } else if (lbl.includes("pend")) {
        color = TX_COLORS.pending;
      }
      return { ...d, color };
    }).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  } else {
    processedData = data.map((d) => ({ ...d }));
  }

  const chartConfig = Object.fromEntries(
    processedData.map((d) => [
      (d.label || d.name || "item").toLowerCase().replace(/\s+/g, "_"),
      { label: d.label || d.name, color: d.color },
    ]),
  );

  const chartData = hasData
    ? processedData.map((d) => ({
        name: d.label || d.name,
        value: d.value,
        fill: d.color,
        fillColor: d.color,
      }))
    : [{ name: "No Data", value: 1, fill: "#f1f5f9", fillColor: "#f1f5f9" }];

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-visible relative">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={tooltipText || footnote}
        />
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[220px] select-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primary2/10 border border-app-primary2/20 text-app-primary2 shadow-sm mb-3">
            <EmptyIcon className="h-6 w-6" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            No data for selected period
          </h4>
          <p className="mt-1 max-w-[280px] text-xs font-medium text-slate-500 leading-relaxed">
            No {title?.toLowerCase() || "records"} recorded for this timeframe. Try choosing a different date range.
          </p>
        </div>
      ) : isGender ? (
        <div className="flex-1 flex flex-col p-6 gap-0">
          {/* Shared SVG Defs matching exact stripe pattern */}
          <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <defs>
              {processedData.map((entry) => {
                const cleanHex = (entry.color || "#000").replace("#", "");
                const patternId = `gender-stripe-${cleanHex}`;
                const isGrey = (entry.color || "").toLowerCase() === "#d9e0e6";
                const strokeColor = isGrey
                  ? "#C2CBD3"
                  : "rgba(255, 255, 255, 0.35)";
                return (
                  <pattern
                    key={patternId}
                    id={patternId}
                    width="7"
                    height="7"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="7" height="7" fill={entry.color} />
                    <line
                      x1="0" y1="0" x2="0" y2="7"
                      stroke={strokeColor}
                      strokeWidth="1.8"
                    />
                  </pattern>
                );
              })}
            </defs>
          </svg>

          {/* Segmented bar — vertically centered in the flex-1 area */}
          <div className="flex-1 flex items-center">
            <div className="w-full p-2 bg-[#F3F5F7] border border-slate-200/80 rounded-2xl shadow-inner/5 relative">
              <div className="w-full h-11 rounded-xl flex items-center gap-1 p-0.5 bg-slate-100/50 relative">
                {processedData.map((item, idx) => {
                  const pct = total > 0 ? (item.value / total) * 100 : 0;
                  if (pct === 0) return null;
                  const cleanHex = (item.color || "#000").replace("#", "");
                  return (
                    <div
                      key={idx}
                      className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-300 relative group cursor-pointer"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="w-full h-full rounded-[inherit] overflow-hidden">
                        <svg className="w-full h-full block">
                          <rect
                            width="100%"
                            height="100%"
                            fill={`url(#gender-stripe-${cleanHex})`}
                          />
                        </svg>
                      </div>
                      {/* Styled tooltip chip on hover — matches other sections' CustomTooltip */}
                      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 hidden group-hover:flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 whitespace-nowrap pointer-events-none">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs font-medium">{item.label}</span>
                          <span className="text-slate-900 text-xs font-bold">{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend — vertical list: Male, Female, Other */}
          <div className="flex-1 flex items-center">
            <div className="w-full divide-y divide-slate-100">
              {processedData.map((item, idx) => {
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-xs font-medium text-slate-400 tabular-nums">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : isTxHealth ? (
        <div className="flex-1 flex flex-col p-6 gap-0">
          {/* Shared SVG Defs matching exact stripe pattern */}
          <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <defs>
              {processedData.map((entry) => {
                const safeId = (entry.color || "000").replace(/[^a-zA-Z0-9]/g, "");
                const patternId = `tx-stripe-${safeId}`;
                const isGrey = (entry.color || "").toLowerCase() === "#d9e0e6";
                const strokeColor = isGrey
                  ? "#C2CBD3"
                  : "rgba(255, 255, 255, 0.35)";
                return (
                  <pattern
                    key={patternId}
                    id={patternId}
                    width="7"
                    height="7"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="7" height="7" fill={entry.color} />
                    <line
                      x1="0" y1="0" x2="0" y2="7"
                      stroke={strokeColor}
                      strokeWidth="1.8"
                    />
                  </pattern>
                );
              })}
            </defs>
          </svg>

          {/* Segmented bar — vertically centered in the flex-1 area */}
          <div className="flex-1 flex items-center">
            <div className="w-full p-2 bg-[#F3F5F7] border border-slate-200/80 rounded-2xl shadow-inner/5 relative">
              <div className="w-full h-11 rounded-xl flex items-center gap-1 p-0.5 bg-slate-100/50 relative">
                {processedData.map((item, idx) => {
                  const pct = total > 0 ? (item.value / total) * 100 : 0;
                  if (pct === 0) return null;
                  const safeId = (item.color || "000").replace(/[^a-zA-Z0-9]/g, "");
                  return (
                    <div
                      key={idx}
                      className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-300 relative group cursor-pointer"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="w-full h-full rounded-[inherit] overflow-hidden">
                        <svg className="w-full h-full block">
                          <rect
                            width="100%"
                            height="100%"
                            fill={`url(#tx-stripe-${safeId})`}
                          />
                        </svg>
                      </div>
                      {/* Styled tooltip chip on hover */}
                      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 hidden group-hover:flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 whitespace-nowrap pointer-events-none">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs font-medium">{item.label}</span>
                          <span className="text-slate-900 text-xs font-bold">{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend — vertical list matching Gender Distribution */}
          <div className="flex-1 flex items-center">
            <div className="w-full divide-y divide-slate-100">
              {processedData.map((item, idx) => {
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-xs font-medium text-slate-400 tabular-nums">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : isDiet || isPlanType ? (
        <div className="flex-1 flex flex-col justify-between p-6 gap-6">
          {/* Semi-circular Gauge Chart on Top (moved from User Goals to Vegetarian vs Non-veg) */}
          <div className="flex-1 flex flex-col items-center justify-center p-2 min-h-[190px]">
            <div className="relative w-full aspect-[2/1] max-w-[280px] mx-auto flex items-center justify-center overflow-visible">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full aspect-[2/1] relative z-10"
              >
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    {chartData.map((entry) => {
                      const cleanHex = (entry.fillColor || entry.fill || "#000").replace(
                        "#",
                        "",
                      );
                      const patternId = `diet-stripe-${cleanHex}`;
                      const isGrey =
                        (entry.fillColor || entry.fill || "").toLowerCase() ===
                        "#d9e0e6";
                      const strokeColor = isGrey
                        ? "#C2CBD3"
                        : "rgba(255, 255, 255, 0.35)";
                      return (
                        <pattern
                          key={patternId}
                          id={patternId}
                          width="7"
                          height="7"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <rect
                            width="7"
                            height="7"
                            fill={entry.fillColor || entry.fill}
                          />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="7"
                            stroke={strokeColor}
                            strokeWidth="1.8"
                          />
                        </pattern>
                      );
                    })}
                  </defs>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    allowEscapeViewBox={{ x: true, y: true }}
                    wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={68}
                    outerRadius={102}
                    paddingAngle={3}
                    cornerRadius={5}
                    stroke="none"
                    animationDuration={800}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={`url(#diet-stripe-${(
                          entry.fillColor || entry.fill || ""
                        ).replace("#", "")})`}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Total Users Label in the center bottom of the semi-circle */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none flex flex-col items-center justify-center z-0">
                <span className="text-3xl font-extrabold text-[#007fc0] tracking-tight leading-none">
                  {total.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#6B7785] tracking-[0.12em] uppercase mt-1">
                  TOTAL USERS
                </span>
              </div>
            </div>
          </div>

          {/* Info row below for Vegetarian vs Non-veg */}
          <div className="w-full flex items-center justify-around px-4 pt-2 border-t border-slate-100">
            {processedData.map((item, idx) => {
              const pct =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-slate-400 tabular-nums">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isGoals || isProgramSplit ? (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center px-6 py-7">
          {/* Donut / Ring chart with diagonal stripe pattern & center total (matches Program Enrollment Split UI) */}
          <div className="relative w-full aspect-square max-w-[210px] mx-auto flex items-center justify-center overflow-visible">
            <ChartContainer config={chartConfig} className="h-full w-full relative z-10">
              <PieChart>
                <defs>
                  {chartData.map((entry) => {
                    const cleanHex = (entry.fillColor || entry.fill || "#000").replace(
                      "#",
                      "",
                    );
                    const patternId = `ring-stripe-${cleanHex}`;
                    const isGrey =
                      (entry.fillColor || entry.fill || "").toLowerCase() ===
                      "#d9e0e6";
                    const strokeColor = isGrey
                      ? "#C2CBD3"
                      : "rgba(255, 255, 255, 0.35)";
                    return (
                      <pattern
                        key={patternId}
                        id={patternId}
                        width="7"
                        height="7"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                      >
                        <rect
                          width="7"
                          height="7"
                          fill={entry.fillColor || entry.fill}
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="7"
                          stroke={strokeColor}
                          strokeWidth="1.8"
                        />
                      </pattern>
                    );
                  })}
                </defs>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  cornerRadius={5}
                  stroke="none"
                  animationDuration={800}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={`url(#ring-stripe-${(
                        entry.fillColor || entry.fill || ""
                      ).replace("#", "")})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Center label inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none px-2 z-0">
              <span className="text-[10px] font-bold text-[#6B7785] tracking-[0.08em] uppercase leading-none">
                Total
              </span>
              <span className="text-2xl font-black text-slate-900 leading-tight my-0.5 tabular-nums">
                {total.toLocaleString()}
              </span>
              {!isGoals && (
                <span className="text-[9px] font-semibold text-[#6B7785] tracking-wide uppercase leading-none">
                  Enrollments
                </span>
              )}
            </div>
          </div>

          {/* Right side legend list */}
          <div className="w-full my-auto flex-1 h-max min-h-0 overflow-y-auto pr-1">
            <div className="divide-y divide-slate-100">
              {processedData.map((item, idx) => {
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center px-6 py-8">
          <div className="relative w-full aspect-square max-w-[200px] mx-auto flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={85}
                  stroke="none"
                  paddingAngle={hasData ? 1 : 0}
                  animationDuration={800}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy - 4}
                              className="fill-slate-900 text-xl font-black"
                            >
                              {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy + 16}
                              className="fill-slate-400 text-[9px] font-bold tracking-[0.1em] uppercase"
                            >
                              {centerLabel}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="w-full my-auto flex-1 h-max min-h-0 overflow-y-auto pr-1">
            <div className="divide-y divide-slate-100">
              {processedData.map((item, idx) => {
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutStatCard;
