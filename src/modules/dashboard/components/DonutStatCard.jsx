import React from "react";
import { PieChart, Pie, Tooltip, Label, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart as PieChartIcon } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const color = item.fillColor || item.fill;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2 z-50">
      <div
        className="w-2.5 h-2.5 rounded-full"
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
 * all read as one visual system. `scrollableLegend` caps the legend height
 * for series with many entries (e.g. user goals).
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
}) => {
  const isGauge = title === "User Goal Distribution";
  const isGender = title === "Gender Distribution";
  const isDiet =
    title === "Vegetarian vs Non-veg" ||
    title?.toLowerCase().includes("vegetarian");
  const isProgramSplit =
    title === "Program Enrollment Split" ||
    title?.toLowerCase().includes("program enrollment");
  const hasData = data.some((d) => d.value > 0);
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  // Controlled restrained palette assignment based on card type
  let processedData = [];
  if (isGender) {
    const COLOR_MALE = "#006696";
    const COLOR_FEMALE = "#3DC1FF";
    const GREY = "#D9E0E6";

    processedData = data.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      let color = d.color;
      if (lbl.includes("female")) {
        color = COLOR_FEMALE;
      } else if (lbl.includes("male")) {
        color = COLOR_MALE;
      } else if (
        lbl.includes("other") ||
        lbl.includes("unspecified") ||
        lbl.includes("unknown") ||
        lbl.includes("none")
      ) {
        color = GREY;
      } else {
        color = COLOR_MALE;
      }
      return { ...d, color };
    });
  } else if (isDiet) {
    const GREY = "#D9E0E6";

    const nonVegItem = data.find((d) =>
      (d.label || d.name || "").toLowerCase().includes("non"),
    );
    const vegItem = data.find(
      (d) =>
        (d.label || d.name || "").toLowerCase().includes("veg") &&
        !(d.label || d.name || "").toLowerCase().includes("non"),
    );

    const nonVegVal = nonVegItem?.value || 0;
    const vegVal = vegItem?.value || 0;

    processedData = data.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      const isUnspecified =
        lbl.includes("unspecified") ||
        lbl.includes("other") ||
        lbl.includes("unknown") ||
        lbl.includes("none");

      let color = d.color;
      if (isUnspecified) {
        color = GREY;
      } else if (lbl.includes("non")) {
        color = nonVegVal >= vegVal ? "#0082C0" : "#66CEFF";
      } else if (lbl.includes("veg")) {
        color = vegVal > nonVegVal ? "#0082C0" : "#66CEFF";
      }
      return { ...d, color };
    });
  } else if (isProgramSplit) {
    const PROGRAM_BLUES = [
      "#004365", // Largest / dominant
      "#006193",
      "#007FC0", // Medium
      "#009DEE",
      "#1CB2FF",
      "#49C1FF", // Smaller
      "#77D1FF",
      "#A4E0FF",
      "#D2F0FF",
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
        const stepColors = [
          "#004365",
          "#006193",
          "#007FC0",
          "#1CB2FF",
          "#49C1FF",
          "#77D1FF",
          "#A4E0FF",
        ];
        color =
          stepColors[activeCount] ||
          PROGRAM_BLUES[activeCount % PROGRAM_BLUES.length];
        activeCount++;
      }
      return { ...d, color };
    });
  } else {
    let activeCount = 0;
    processedData = data.map((d) => {
      const lbl = (d.label || d.name || "").toLowerCase();
      const isInactive =
        lbl.includes("unspecified") ||
        lbl.includes("other") ||
        lbl.includes("inactive") ||
        lbl.includes("none");
      let color = d.color;
      if (isGauge) {
        if (isInactive) {
          color = "#D9E0E6";
        } else {
          const palette = [
            "#009EE9",
            "#006696",
            "#004A6C",
            "#90DBFF",
            "#B9E9FF",
          ];
          color = palette[activeCount % palette.length];
          activeCount++;
        }
      }
      return { ...d, color, isInactive };
    });
  }

  const chartConfig = Object.fromEntries(
    processedData.map((d) => [
      d.label.toLowerCase().replace(/\s+/g, "_"),
      { label: d.label, color: d.color },
    ]),
  );

  const chartData = hasData
    ? processedData.map((d) => ({
        name: d.label,
        value: d.value,
        fill: d.color,
        fillColor: d.color,
      }))
    : [{ name: "No Data", value: 1, fill: "#f1f5f9", fillColor: "#f1f5f9" }];

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
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
            <PieChartIcon className="h-6 w-6" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            No data for selected period
          </h4>
          <p className="mt-1 max-w-[280px] text-xs font-medium text-slate-500 leading-relaxed">
            No {title?.toLowerCase() || "records"} recorded for this timeframe. Try choosing a different date range.
          </p>
        </div>
      ) : isGender ? (
        <div className="flex-1 flex flex-col justify-between p-6 gap-6">
          {/* Shared SVG Defs matching exact stripe pattern from User Goal Distribution */}
          <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <defs>
              {processedData.map((entry) => {
                const cleanHex = entry.color.replace("#", "");
                const patternId = `gender-stripe-${cleanHex}`;
                const isGrey = entry.color.toLowerCase() === "#d9e0e6";
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
                      fill={entry.color}
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
          </svg>

          {/* Bordered rounded container around horizontal segmented bar (increased height to h-11) */}
          <div className="w-full p-2 bg-[#F3F5F7] border border-slate-200/80 rounded-2xl shadow-inner/5">
            <div className="w-full h-11 rounded-xl flex items-center gap-1 overflow-hidden p-0.5 bg-slate-100/50">
              {processedData.map((item, idx) => {
                const pct = total > 0 ? (item.value / total) * 100 : 0;
                if (pct === 0) return null;
                const cleanHex = item.color.replace("#", "");

                return (
                  <div
                    key={idx}
                    className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-500 relative overflow-hidden group cursor-pointer"
                    style={{ width: `${pct}%` }}
                    title={`${item.label}: ${item.value.toLocaleString()} (${Math.round(
                      pct,
                    )}%)`}
                  >
                    <svg className="w-full h-full block">
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#gender-stripe-${cleanHex})`}
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend list below with rows: Male, Female, Other */}
          <div className="w-full divide-y divide-slate-100">
            {processedData.map((item, idx) => {
              const pct =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
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
      ) : isDiet ? (
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-7 gap-6">
          {/* Shared SVG Defs matching exact stripe pattern */}
          <svg
            className="absolute w-0 h-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              {processedData.map((entry) => {
                const cleanHex = entry.color.replace("#", "");
                const patternId = `diet-stripe-${cleanHex}`;
                const isGrey = entry.color.toLowerCase() === "#d9e0e6";
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
          </svg>

          {/* Standalone segmented horizontal comparison bar matching reference image */}
          <div className="w-full h-16 sm:h-18 flex items-center gap-2.5 my-auto">
            {processedData.map((item, idx) => {
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              if (pct === 0) return null;
              const cleanHex = item.color.replace("#", "");

              return (
                <div
                  key={idx}
                  className="h-full rounded-2xl overflow-hidden transition-all duration-500 relative group cursor-pointer shadow-sm"
                  style={{ width: `${pct}%` }}
                  title={`${item.label}: ${item.value.toLocaleString()} (${Math.round(
                    pct,
                  )}%)`}
                >
                  <svg className="w-full h-full block">
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#diet-stripe-${cleanHex})`}
                    />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Info row matching reference image layout */}
          <div className="w-full flex items-center justify-start gap-10 sm:gap-16 flex-wrap">
            {processedData.map((item, idx) => {
              const pct =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-[#6B7785] truncate">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-slate-400 tabular-nums">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isProgramSplit ? (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center px-6 py-7">
          {/* Donut / Ring chart with diagonal stripe pattern & center total */}
          <div className="relative w-full aspect-square max-w-[210px] mx-auto flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <defs>
                  {chartData.map((entry) => {
                    const cleanHex = (entry.fillColor || entry.fill).replace(
                      "#",
                      "",
                    );
                    const patternId = `program-stripe-${cleanHex}`;
                    const isGrey =
                      (entry.fillColor || entry.fill).toLowerCase() ===
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
                <Tooltip content={<CustomTooltip />} cursor={false} />
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
                      fill={`url(#program-stripe-${(
                        entry.fillColor || entry.fill
                      ).replace("#", "")})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Center label inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-medium text-[#6B7785]">Total</span>
              <span className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                {total.toLocaleString()} Enrollments
              </span>
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
      ) : isGauge ? (
        <div className="flex-1 flex flex-col justify-between">
          {/* Compact Legend Bar above the semi-circular gauge */}
          <div className="w-full px-6 py-3 border-b border-slate-100/80 bg-[#F3F5F7]/40 flex items-center justify-between flex-wrap gap-y-2 gap-x-3">
            {processedData.map((item, idx) => {
              const pct =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[#6B7785]">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                  <span className="font-medium text-slate-400 tabular-nums">
                    ({pct}%)
                  </span>
                  {idx < processedData.length - 1 && (
                    <span className="hidden sm:inline-block w-[1px] h-3 bg-slate-200 ml-1.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Semi-circular Gauge Chart */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[200px]">
            <div className="relative w-full aspect-[2/1] max-w-[280px] mx-auto flex items-center justify-center">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full aspect-[2/1]"
              >
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    {chartData.map((entry) => {
                      const cleanHex = (entry.fillColor || entry.fill).replace(
                        "#",
                        "",
                      );
                      const patternId = `stripe-${cleanHex}`;
                      const isGrey =
                        (entry.fillColor || entry.fill).toLowerCase() ===
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
                  <Tooltip content={<CustomTooltip />} cursor={false} />
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
                        fill={`url(#stripe-${(
                          entry.fillColor || entry.fill
                        ).replace("#", "")})`}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Total Users Label in the center bottom of the semi-circle */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#004A6C] tracking-tight leading-none">
                  {total.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#6B7785] tracking-[0.12em] uppercase mt-1">
                  TOTAL USERS
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center px-6 py-8">
          <div className="relative w-full aspect-square max-w-[200px] mx-auto flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Tooltip content={<CustomTooltip />} cursor={false} />
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
