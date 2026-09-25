import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import DashboardHead from "@/components/shared/dashboard.head";
import { Info, TrendingUp, BarChart3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// ── Pill-bar rendering (reference-design match) ────────────────────────────
// Only kicks in when EVERY series on the card is a bar series (e.g.
// "Plan-wise Revenue", "Top Selling Plans"). Area/line charts — and any
// mixed bar+line/area combo — fall straight through to the original
// rendering below, completely untouched.
//
// The value badge + connector dot are drawn as plain SVG *inside this same
// shape*, anchored directly to the bar's own x/y — NOT via Recharts'
// <Tooltip>, which positions off the mouse cursor and would drift away
// from the bar as the pointer moves inside it. Drawing it here guarantees
// the badge always sits exactly above the bar it belongs to.
// Builds a bar outline with rounded TOP corners only and a flat bottom
// edge — a plain <rect rx/ry> can't do this because rx/ry round all four
// corners equally. M→L→Q→L→Q→L→Z: start bottom-left, go up the flat left
// edge, arc the top-left corner, go across the flat top, arc the
// top-right corner, go down the flat right edge, then Z closes it with a
// straight line back along the bottom.
function topRoundedPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height);
  return `
    M ${x},${y + height}
    L ${x},${y + r}
    Q ${x},${y} ${x + r},${y}
    L ${x + width - r},${y}
    Q ${x + width},${y} ${x + width},${y + r}
    L ${x + width},${y + height}
    Z
  `;
}

function PillBar({
  x,
  y,
  width,
  height,
  index,
  value,
  isActive,
  color,
  gradientId,
  patternId,
  dataLength,
}) {
  if (width <= 0 || height <= 0) return null;
  // Flat-bottom, rounded-top bars — swap this constant for
  // Math.min(width / 2, height / 2) if the full pill (rounded top+bottom)
  // look is wanted again.
  const radius = width / 2;

  if (!isActive) {
    return (
      <path
        d={topRoundedPath(x, y, width, height, radius)}
        fill={`url(#${patternId})`}
      />
    );
  }

  const cx = x + width / 2;
  const actualValue = Array.isArray(value) ? value[1] - value[0] : value;
  const label = Number(actualValue).toLocaleString();
  const badgeWidth = Math.max(42, label.length * 8 + 26);
  const badgeHeight = 26;
  const dotR = 5;
  const gap = 10;
  const badgeY = y - dotR - gap - badgeHeight;

  // Keep the badge from overflowing the chart edges for the first/last bar.
  let badgeShift = 0;
  if (index === 0) badgeShift = badgeWidth / 2 - width / 2;
  if (index === (dataLength ?? 0) - 1) badgeShift = -(badgeWidth / 2 - width / 2);
  const badgeX = cx + badgeShift - badgeWidth / 2;

  return (
    <g>
      <path
        d={topRoundedPath(x, y, width, height, radius)}
        fill={`url(#${gradientId})`}
      />
      <circle cx={cx} cy={y} r={dotR} fill={color} stroke="#fff" strokeWidth={2} />
      <g transform={`translate(${badgeX}, ${badgeY})`}>
        <rect width={badgeWidth} height={badgeHeight} rx={badgeHeight / 2} fill={color} />
        <text
          x={badgeWidth / 2}
          y={badgeHeight / 2 + 4}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#fff"
        >
          {label}
        </text>
      </g>
    </g>
  );
}

function FitzoneBar({
  x,
  y,
  width,
  height,
  value,
  maxValue,
  isHighest,
}) {
  if (width <= 0 || height <= 0) return null;
  const actualValue = Array.isArray(value) ? value[1] - value[0] : value;

  const getFitzoneColor = (val, maxVal) => {
    if (maxVal <= 0 || val <= 0) return "#B9E9FF";
    if (val === maxVal) return "#009EE9";
    const ratio = val / maxVal;
    if (ratio < 0.1) return "#B9E9FF";
    if (ratio < 0.25) return "#90DBFF";
    if (ratio < 0.5) return "#66CEFF";
    if (ratio < 0.8) return "#3DC1FF";
    return "#0082C0";
  };

  const color = getFitzoneColor(actualValue, maxValue);
  const cleanHex = color.replace("#", "");
  const patternId = `fitzone-bar-stripe-${cleanHex}`;
  const radius = Math.min(width / 2, 8);
  const cx = x + width / 2;

  const isLight =
    color.toLowerCase() === "#b9e9ff" || color.toLowerCase() === "#90dbff";
  const strokeColor = isLight ? "#94C7E3" : "rgba(255, 255, 255, 0.38)";

  return (
    <g className="transition-all duration-300">
      <defs>
        <pattern
          id={patternId}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="7" fill={color} />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke={strokeColor}
            strokeWidth="1.8"
          />
        </pattern>
      </defs>

      {/* Rounded Top Vertical Bar */}
      <path
        d={topRoundedPath(x, y, width, height, radius)}
        fill={`url(#${patternId})`}
      />

      {/* Value Badge & Dot for Highest Bar, or Count Text for other bars */}
      {isHighest ? (
        <g>
          {/* White Dot on Top of Bar */}
          <circle
            cx={cx}
            cy={y}
            r={4}
            fill={color}
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* Floating Rounded Value Badge above Bar */}
          <g transform={`translate(${cx - 24}, ${y - 34})`}>
            <rect
              width="48"
              height="24"
              rx="12"
              fill={color}
              className="shadow-md"
            />
            <text
              x="24"
              y="16"
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill="#ffffff"
            >
              {actualValue.toLocaleString()}
            </text>
          </g>
        </g>
      ) : (
        actualValue > 0 && (
          <text
            x={cx}
            y={y - 8}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#6B7785"
          >
            {actualValue.toLocaleString()}
          </text>
        )
      )}
    </g>
  );
}

// Compact tick formatter for the pill-bar Y axis (40000 -> "40k"). Only
// used in pure-bar mode, so charts with small counts elsewhere are
// unaffected.
const formatCompact = (value) => {
  const num = Number(value);
  if (Math.abs(num) >= 1000) {
    const trimmed =
      num % 1000 === 0 ? (num / 1000).toFixed(0) : (num / 1000).toFixed(1);
    return `${trimmed}k`;
  }
  return num.toLocaleString();
};

/**
 * Reusable trend widget — one series renders as a plain line/bar (no legend
 * needed, the title already names it); two or more always get a legend, per
 * the dashboard's chart convention. `series[].type` is "line" or "bar";
 * mixing both (e.g. bar for volume + line for a rate) is supported.
 */

function FocusTimelineUI({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-600",
  iconBg = "bg-slate-100/50",
  data = [],
  xKey,
  periodLabel,
  series = [],
  note,
}) {
  const totalValue = data.reduce(
    (sum, point) => sum + (Number(point?.[series[0]?.key]) || 0),
    0,
  );
  const activeUsersText = totalValue === 1 ? "active user" : "active users";

  const maxIndex = useMemo(() => {
    if (!data || data.length === 0 || series.length === 0) return undefined;
    const key = series[0]?.key;
    let maxIdx = 0;
    let maxValue = -1;
    data.forEach((d, idx) => {
      const val = Number(d[key]) || 0;
      if (val > maxValue) {
        maxValue = val;
        maxIdx = idx;
      }
    });
    return maxIdx;
  }, [data, series]);

  const [selectedIndex, setSelectedIndex] = useState(maxIndex);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setSelectedIndex(maxIndex);
  }, [maxIndex]);

  // Calculate Y-axis domain
  const values = data.map((d) => Number(d[series[0]?.key] || 0));
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const spread = max - min;
  const domainMin = Math.max(0, min - spread * 0.35);
  const domainMax = max + spread * 0.2;

  // X-axis label interval
  const xInterval =
    data.length <= 8 ? 0 : Math.max(0, Math.ceil(data.length / 7) - 1);

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60 flex items-center justify-between gap-4">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={note}
        />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {Number(totalValue).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500 capitalize">
              Total {activeUsersText}
            </span>
          </div>
        </div>

        <div className="w-full flex-1 min-h-[220px]">
          {data.length > 0 ? (
            <ChartContainer config={{}} className="w-full h-full min-h-[220px]">
              <ComposedChart
                key={chartKey}
                data={data}
                margin={{ top: 8, right: 16, left: 16, bottom: 4 }}
                onMouseMove={(state) => {
                  if (state?.activeTooltipIndex !== undefined) {
                    setSelectedIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => {
                  setSelectedIndex(maxIndex);
                  setChartKey((prev) => prev + 1);
                }}
              >
                <defs>
                  <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#007FC0" stopOpacity={0.15} />
                    <stop offset="50%" stopColor="#007FC0" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#007FC0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(215, 25%, 94%)"
                  strokeWidth={1}
                />
                <XAxis
                  dataKey={xKey}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={4}
                  height={24}
                  padding={{ left: 16, right: 16 }}
                  interval={xInterval}
                  tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                  tickFormatter={(value) => {
                    if (
                      data.length === 1 &&
                      String(value).toLowerCase() === "today" &&
                      periodLabel &&
                      periodLabel !== "Today"
                    ) {
                      return periodLabel;
                    }
                    return value;
                  }}
                />
                <YAxis
                  domain={[domainMin, domainMax]}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  width={45}
                  tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                  tickFormatter={(val) => {
                    if (val >= 1000)
                      return `${(val / 1000).toFixed(1).replace(".0", "")}k`;
                    return val;
                  }}
                />
                <ChartTooltip
                  defaultIndex={selectedIndex ?? maxIndex}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    fill: "transparent",
                  }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const dataPoint = payload[0];
                    const displayLabel =
                      data.length === 1 &&
                      String(label).toLowerCase() === "today" &&
                      periodLabel &&
                      periodLabel !== "Today"
                        ? periodLabel
                        : label;
                    return (
                      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 flex items-center gap-3.5 ml-2 mt-2 max-w-max z-50">
                        {/* Left circular blue icon bubble */}
                        <div className="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0 relative z-10">
                          <TrendingUp
                            className="w-5 h-5 text-[#007FC0]"
                            strokeWidth={2.5}
                          />
                        </div>

                        {/* Right text */}
                        <div className="flex flex-col gap-1 relative z-10 pr-2">
                          <div className="text-[14px] font-bold text-[#007FC0] leading-none">
                            {Number(dataPoint.value).toLocaleString()}{" "}
                            {dataPoint.name || "Daily Active Users"}
                          </div>
                          <div className="text-[13px] text-slate-500 font-semibold leading-none">
                            {displayLabel}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={series[0]?.key}
                  stroke="#007FC0"
                  strokeWidth={2.5}
                  fill="url(#dauGradient)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{
                    r: 5,
                    fill: "#007FC0",
                    stroke: "#ffffff",
                    strokeWidth: 2.5,
                  }}
                />
              </ComposedChart>
            </ChartContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200/80 rounded-2xl min-h-[220px] select-none">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primary2/10 border border-app-primary2/20 text-app-primary2 shadow-sm mb-3">
                <BarChart3 className="h-6 w-6" strokeWidth={2} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                No data for selected period
              </h4>
              <p className="mt-1 max-w-[260px] text-[11px] font-medium text-slate-500 leading-relaxed">
                No activity recorded for this timeframe. Try choosing a different date range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TrendChartCard = ({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-700",
  iconBg = "bg-slate-50",
  tooltipText,
  data = [],
  xKey,
  periodLabel,
  series = [],
  note,
  height = "flex-1 min-h-[240px]",
  focusTimeline = false,
  hideLegend = false,
}) => {
  if (focusTimeline) {
    return (
      <FocusTimelineUI
        title={title}
        subtitle={subtitle}
        Icon={Icon}
        iconColor={iconColor}
        iconBg={iconBg}
        data={data}
        xKey={xKey}
        periodLabel={periodLabel}
        series={series}
        note={note || tooltipText}
      />
    );
  }

  const [hoverState, setHoverState] = useState({ index: null, key: null });

  const defaultHover = useMemo(() => {
    if (!data || data.length === 0 || series.length === 0) return { index: null, key: null };
    const isPure = series.every((s) => s.type === "bar");
    if (!isPure) return { index: null, key: null };
    
    const key = series[0].key;
    let maxIndex = 0;
    let maxValue = -1;
    data.forEach((d, idx) => {
      const val = Number(d[key]) || 0;
      if (val > maxValue) {
        maxValue = val;
        maxIndex = idx;
      }
    });
    return { index: maxIndex, key };
  }, [data, series]);

  const activeIndex = hoverState.index != null ? hoverState.index : defaultHover.index;
  const activeKey = hoverState.key != null ? hoverState.key : defaultHover.key;

  const chartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );
  // Ensure we actually have non-zero data to plot, not just a padded zero-value array
  // which can happen for single-day periods like 'Yesterday' or 'Today'.
  const hasData =
    data.length > 0 &&
    data.some((point) => series.some((s) => Number(point[s.key]) > 0));

  // Every series is a bar → use the reference-design pill treatment.
  // Any area/line present → fall through to the original chart untouched.
  const isPureBarChart =
    series.length > 0 && series.every((s) => s.type === "bar");

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={tooltipText || note}
        />
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-3">
        {hasData ? (
          <ChartContainer config={chartConfig} className={`w-full ${height}`}>
            <ComposedChart
              data={data}
              margin={
                isPureBarChart
                  ? { top: 40, right: 16, left: 16, bottom: 4 }
                  : { top: 8, right: 16, left: 16, bottom: 4 }
              }
              onMouseMove={(state) => {
                if (isPureBarChart && state?.activeTooltipIndex !== undefined) {
                  setHoverState((prev) => {
                    if (prev.index !== state.activeTooltipIndex || !prev.key) {
                      return { index: state.activeTooltipIndex, key: series[0]?.key };
                    }
                    return prev;
                  });
                }
              }}
              onMouseLeave={() => isPureBarChart && setHoverState({ index: null, key: null })}
            >
              <defs>
                {series.map((s) => {
                  if (s.type === "area") {
                    return (
                      <linearGradient
                        key={`gradient-${s.key}`}
                        id={`gradient-${s.key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={s.color}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={s.color}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    );
                  }
                  return null;
                })}
                {isPureBarChart &&
                  series.map((s) => (
                    <React.Fragment key={`bar-defs-${s.key}`}>
                      <linearGradient
                        id={`bar-gradient-${s.key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={s.color} stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor={s.color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <pattern
                        id={`bar-hatch-${s.key}`}
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect width="6" height="6" fill="#eef1f5" />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="#dbe2ea"
                          strokeWidth="2.5"
                        />
                      </pattern>
                    </React.Fragment>
                  ))}
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="hsl(215, 20%, 90%)"
                strokeDasharray={isPureBarChart ? "3 4" : undefined}
              />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={4}
                height={24}
                padding={{ left: isPureBarChart ? 20 : 12, right: isPureBarChart ? 20 : 12 }}
                tickFormatter={(value) => {
                  if (
                    data.length === 1 &&
                    String(value).toLowerCase() === "today" &&
                    periodLabel &&
                    periodLabel !== "Today"
                  ) {
                    // Custom date ranges come back as "Mar 01 - Mar 01, 2026", we just use it directly
                    // Pre-defined ranges like Yesterday come back as "Yesterday"
                    return periodLabel;
                  }
                  return value;
                }}
              />
              <YAxis
                type="number"
                domain={[0, "auto"]}
                allowDecimals={false}
                tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                width={45}
                tickFormatter={isPureBarChart ? formatCompact : undefined}
              />
              {/* Pure-bar mode draws its own value badge inside PillBar, glued
                  to the bar's own coordinates — Recharts' cursor-following
                  Tooltip is skipped entirely so it can't drift off the bar. */}
              {!isPureBarChart && (
                <ChartTooltip
                  defaultIndex={defaultHover.index}
                  cursor={{
                    stroke: "hsl(215, 20%, 90%)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    fill: "transparent",
                  }}
                  content={
                    <ChartTooltipContent
                      className="bg-white"
                      labelFormatter={(label) => {
                        if (
                          data.length === 1 &&
                          String(label).toLowerCase() === "today" &&
                          periodLabel &&
                          periodLabel !== "Today"
                        ) {
                          return periodLabel;
                        }
                        return label;
                      }}
                      formatter={(value, name) => {
                        const matchedSeries = series.find(
                          (s) => s.key === name,
                        );
                        return (
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor:
                                    matchedSeries?.color ||
                                    "hsl(215, 16%, 65%)",
                                }}
                              />
                              <span className="text-muted-foreground">
                                {matchedSeries?.label || name}
                              </span>
                            </div>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {Number(value).toLocaleString()}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
              )}
              {series.length > 1 && !hideLegend && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((s) => {
                const effectiveType = data.length === 1 ? "bar" : s.type;
                if (effectiveType === "bar") {
                  if (title === "Fitzone Users Assigned") {
                    const maxVal = Math.max(
                      ...data.map((d) => Number(d[s.key]) || 0),
                    );
                    return (
                      <Bar
                        key={s.key}
                        dataKey={s.key}
                        maxBarSize={52}
                        shape={(shapeProps) => {
                          const val = Number(shapeProps.value) || 0;
                          const isHighest = val > 0 && val === maxVal;
                          return (
                            <FitzoneBar
                              {...shapeProps}
                              maxValue={maxVal}
                              isHighest={isHighest}
                            />
                          );
                        }}
                      />
                    );
                  }
                  if (isPureBarChart) {
                    return (
                      <Bar
                        key={s.key}
                        dataKey={s.key}
                        stackId="pill"
                        maxBarSize={56}
                        onMouseEnter={(_, idx) => setHoverState({ index: idx, key: s.key })}
                        onMouseMove={(_, idx) => setHoverState({ index: idx, key: s.key })}
                        onMouseLeave={() => setHoverState({ index: null, key: null })}
                        shape={(shapeProps) => (
                          <PillBar
                            {...shapeProps}
                            isActive={shapeProps.index === activeIndex && s.key === activeKey}
                            color={s.color}
                            gradientId={`bar-gradient-${s.key}`}
                            patternId={`bar-hatch-${s.key}`}
                            dataLength={data.length}
                          />
                        )}
                      />
                    );
                  }
                  return (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      fill={s.color}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    />
                  );
                } else if (effectiveType === "area") {
                  return (
                    <Area
                      key={s.key}
                      type={s.curveType || "monotone"}
                      dataKey={s.key}
                      stroke={s.color}
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill={`url(#gradient-${s.key})`}
                      activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
                    />
                  );
                } else {
                  return (
                    <Line
                      key={s.key}
                      type={s.curveType || "monotone"}
                      dataKey={s.key}
                      stroke={s.color}
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                }
              })}
            </ComposedChart>
          </ChartContainer>
        ) : (
          <div
            className={`w-full ${height} flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200/80 rounded-2xl select-none`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primary2/10 border border-app-primary2/20 text-app-primary2 shadow-sm mb-3">
              <BarChart3 className="h-6 w-6" strokeWidth={2} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              No data for selected period
            </h4>
            <p className="mt-1 max-w-[260px] text-[11px] font-medium text-slate-500 leading-relaxed">
              No records found for this timeframe. Try choosing a different date range.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChartCard;
