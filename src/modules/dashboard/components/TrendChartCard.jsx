// // import React from "react";
// // import {
// //   ComposedChart,
// //   Line,
// //   Bar,
// //   Area,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// // } from "recharts";
// // import {
// //   ChartContainer,
// //   ChartTooltip,
// //   ChartTooltipContent,
// //   ChartLegend,
// //   ChartLegendContent,
// // } from "@/components/ui/chart";
// // import DashboardHead from "@/components/shared/dashboard.head";

// // /**
// //  * Reusable trend widget — one series renders as a plain line/bar (no legend
// //  * needed, the title already names it); two or more always get a legend, per
// //  * the dashboard's chart convention. `series[].type` is "line" or "bar";
// //  * mixing both (e.g. bar for volume + line for a rate) is supported.
// //  */
// // const TrendChartCard = ({
// //   title,
// //   subtitle,
// //   Icon,
// //   iconColor = "text-slate-700",
// //   iconBg = "bg-slate-50",
// //   tooltipText,
// //   data = [],
// //   xKey,
// //   periodLabel,
// //   series = [],
// //   note,
// //   height = "flex-1 min-h-[240px]",
// // }) => {
// //   const chartConfig = Object.fromEntries(
// //     series.map((s) => [s.key, { label: s.label, color: s.color }]),
// //   );
// //   // Ensure we actually have non-zero data to plot, not just a padded zero-value array
// //   // which can happen for single-day periods like 'Yesterday' or 'Today'.
// //   const hasData =
// //     data.length > 0 &&
// //     data.some((point) => series.some((s) => Number(point[s.key]) > 0));

// //   return (
// //     <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
// //       <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
// //         <DashboardHead
// //           title={title}
// //           subtitle={subtitle}
// //           Icon={Icon}
// //           iconColor={iconColor}
// //           iconBg={iconBg}
// //           tooltipText={tooltipText || note}
// //         />
// //       </div>

// //       <div className="flex-1 flex flex-col p-4 pb-6">
// //         {hasData ? (
// //           <ChartContainer config={chartConfig} className={`w-full ${height}`}>
// //             <ComposedChart
// //               data={data}
// //               margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
// //             >
// //               <defs>
// //                 {series.map((s) => {
// //                   if (s.type === "area") {
// //                     return (
// //                       <linearGradient
// //                         key={`gradient-${s.key}`}
// //                         id={`gradient-${s.key}`}
// //                         x1="0"
// //                         y1="0"
// //                         x2="0"
// //                         y2="1"
// //                       >
// //                         <stop
// //                           offset="5%"
// //                           stopColor={s.color}
// //                           stopOpacity={0.4}
// //                         />
// //                         <stop
// //                           offset="95%"
// //                           stopColor={s.color}
// //                           stopOpacity={0}
// //                         />
// //                       </linearGradient>
// //                     );
// //                   }
// //                   return null;
// //                 })}
// //               </defs>
// //               <CartesianGrid vertical={false} stroke="hsl(215, 20%, 92%)" />
// //               <XAxis
// //                 dataKey={xKey}
// //                 tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
// //                 axisLine={false}
// //                 tickLine={false}
// //                 tickMargin={10}
// //                 tickFormatter={(value) => {
// //                   if (
// //                     data.length === 1 &&
// //                     String(value).toLowerCase() === "today" &&
// //                     periodLabel &&
// //                     periodLabel !== "Today"
// //                   ) {
// //                     // Custom date ranges come back as "Mar 01 - Mar 01, 2026", we just use it directly
// //                     // Pre-defined ranges like Yesterday come back as "Yesterday"
// //                     return periodLabel;
// //                   }
// //                   return value;
// //                 }}
// //               />
// //               <YAxis
// //                 type="number"
// //                 domain={[0, "auto"]}
// //                 allowDecimals={false}
// //                 tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
// //                 axisLine={false}
// //                 tickLine={false}
// //                 tickMargin={10}
// //                 width={45}
// //               />
// //               <ChartTooltip
// //                 content={
// //                   <ChartTooltipContent
// //                     className="bg-white"
// //                     labelFormatter={(label) => {
// //                       if (
// //                         data.length === 1 &&
// //                         String(label).toLowerCase() === "today" &&
// //                         periodLabel &&
// //                         periodLabel !== "Today"
// //                       ) {
// //                         return periodLabel;
// //                       }
// //                       return label;
// //                     }}
// //                     formatter={(value, name) => {
// //                       const matchedSeries = series.find((s) => s.key === name);
// //                       return (
// //                         <div className="flex w-full items-center justify-between gap-2">
// //                           <div className="flex items-center gap-1.5">
// //                             <div
// //                               className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
// //                               style={{
// //                                 backgroundColor:
// //                                   matchedSeries?.color || "hsl(215, 16%, 65%)",
// //                               }}
// //                             />
// //                             <span className="text-muted-foreground">
// //                               {matchedSeries?.label || name}
// //                             </span>
// //                           </div>
// //                           <span className="font-mono font-medium tabular-nums text-foreground">
// //                             {Number(value).toLocaleString()}
// //                           </span>
// //                         </div>
// //                       );
// //                     }}
// //                   />
// //                 }
// //                 cursor={{
// //                   stroke: "hsl(215, 20%, 90%)",
// //                   strokeWidth: 1,
// //                   strokeDasharray: "4 4",
// //                   fill: "transparent",
// //                 }}
// //               />
// //               {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
// //               {series.map((s) => {
// //                 const effectiveType = data.length === 1 ? "bar" : s.type;
// //                 if (effectiveType === "bar") {
// //                   return (
// //                     <Bar
// //                       key={s.key}
// //                       dataKey={s.key}
// //                       fill={s.color}
// //                       radius={[4, 4, 0, 0]}
// //                       maxBarSize={48}
// //                     />
// //                   );
// //                 } else if (effectiveType === "area") {
// //                   return (
// //                     <Area
// //                       key={s.key}
// //                       type="monotone"
// //                       dataKey={s.key}
// //                       stroke={s.color}
// //                       strokeWidth={1.5}
// //                       fillOpacity={1}
// //                       fill={`url(#gradient-${s.key})`}
// //                       activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
// //                     />
// //                   );
// //                 } else {
// //                   return (
// //                     <Line
// //                       key={s.key}
// //                       type="monotone"
// //                       dataKey={s.key}
// //                       stroke={s.color}
// //                       strokeWidth={1.5}
// //                       dot={false}
// //                       activeDot={{ r: 4 }}
// //                     />
// //                   );
// //                 }
// //               })}
// //             </ComposedChart>
// //           </ChartContainer>
// //         ) : (
// //           <div
// //             className={`w-full ${height} flex items-center justify-center text-xs text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl`}
// //           >
// //             No data available
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TrendChartCard;


// import React, { useState } from "react";
// import {
//   ComposedChart,
//   Line,
//   Bar,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
// } from "@/components/ui/chart";
// import DashboardHead from "@/components/shared/dashboard.head";
// import { Info } from "lucide-react";

// // ── Pill-bar rendering (reference-design match) ────────────────────────────
// // Only kicks in when EVERY series on the card is a bar series (e.g.
// // "Plan-wise Revenue", "Top Selling Plans"). Area/line charts — and any
// // mixed bar+line/area combo — fall straight through to the original
// // rendering below, completely untouched.
// //
// // Default bars: diagonal hatch fill. Hovered bar: solid top→bottom
// // gradient + a small connector dot, with a floating pill tooltip above it.
// function PillBar({ x, y, width, height, index, isActive, color, gradientId, patternId }) {
//   if (width <= 0 || height <= 0) return null;
//   const radius = Math.min(width / 2, height / 2);
//   return (
//     <g>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         rx={radius}
//         ry={radius}
//         fill={isActive ? `url(#${gradientId})` : `url(#${patternId})`}
//         className="transition-[fill] duration-150"
//       />
//       {isActive && (
//         <circle
//           cx={x + width / 2}
//           cy={y}
//           r={5}
//           fill={color}
//           stroke="#fff"
//           strokeWidth={2}
//         />
//       )}
//     </g>
//   );
// }

// function PillTooltip({ active, payload, series }) {
//   if (!active || !payload?.length) return null;
//   const item = payload[0];
//   const matched = series.find((s) => s.key === item.dataKey) || series[0];
//   return (
//     <div
//       className="rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg whitespace-nowrap"
//       style={{ background: matched?.color }}
//     >
//       {Number(item.value).toLocaleString()}
//     </div>
//   );
// }

// // Compact tick formatter for the pill-bar Y axis (40000 -> "40k"). Only
// // used in pure-bar mode, so charts with small counts elsewhere are
// // unaffected.
// const formatCompact = (value) => {
//   const num = Number(value);
//   if (Math.abs(num) >= 1000) {
//     const trimmed = num % 1000 === 0 ? (num / 1000).toFixed(0) : (num / 1000).toFixed(1);
//     return `${trimmed}k`;
//   }
//   return num.toLocaleString();
// };

// /**
//  * Reusable trend widget — one series renders as a plain line/bar (no legend
//  * needed, the title already names it); two or more always get a legend, per
//  * the dashboard's chart convention. `series[].type` is "line" or "bar";
//  * mixing both (e.g. bar for volume + line for a rate) is supported.
//  */
// const TrendChartCard = ({
//   title,
//   subtitle,
//   Icon,
//   iconColor = "text-slate-700",
//   iconBg = "bg-slate-50",
//   tooltipText,
//   data = [],
//   xKey,
//   periodLabel,
//   series = [],
//   note,
//   height = "flex-1 min-h-[240px]",
// }) => {
//   const [hoverIndex, setHoverIndex] = useState(null);

//   const chartConfig = Object.fromEntries(
//     series.map((s) => [s.key, { label: s.label, color: s.color }]),
//   );
//   // Ensure we actually have non-zero data to plot, not just a padded zero-value array
//   // which can happen for single-day periods like 'Yesterday' or 'Today'.
//   const hasData = data.length > 0 && data.some(point =>
//     series.some(s => Number(point[s.key]) > 0)
//   );

//   // Every series is a bar → use the reference-design pill treatment.
//   // Any area/line present → fall through to the original chart untouched.
//   const isPureBarChart = series.length > 0 && series.every((s) => s.type === "bar");

//   return (
//     <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md flex flex-col h-full overflow-hidden">
//       <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
//         <DashboardHead
//           title={title}
//           subtitle={subtitle}
//           Icon={Icon}
//           iconColor={iconColor}
//           iconBg={iconBg}
//           tooltipText={tooltipText || note}
//         />
//       </div>

//       <div className="flex-1 flex flex-col p-4 pb-6">
//         {hasData ? (
//           <ChartContainer config={chartConfig} className={`w-full ${height}`}>
//             <ComposedChart
//               data={data}
//               margin={
//                 isPureBarChart
//                   ? { top: 28, right: 12, left: 0, bottom: 0 }
//                   : { top: 8, right: 12, left: 0, bottom: 0 }
//               }
//               onMouseLeave={() => isPureBarChart && setHoverIndex(null)}
//             >
//               <defs>
//                 {series.map((s) => {
//                   if (s.type === "area") {
//                     return (
//                       <linearGradient
//                         key={`gradient-${s.key}`}
//                         id={`gradient-${s.key}`}
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                       >
//                         <stop
//                           offset="5%"
//                           stopColor={s.color}
//                           stopOpacity={0.4}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor={s.color}
//                           stopOpacity={0}
//                         />
//                       </linearGradient>
//                     );
//                   }
//                   return null;
//                 })}
//                 {isPureBarChart &&
//                   series.map((s) => (
//                     <React.Fragment key={`bar-defs-${s.key}`}>
//                       <linearGradient
//                         id={`bar-gradient-${s.key}`}
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                       >
//                         <stop offset="0%" stopColor={s.color} stopOpacity={1} />
//                         <stop offset="100%" stopColor={s.color} stopOpacity={0.1} />
//                       </linearGradient>
//                       <pattern
//                         id={`bar-hatch-${s.key}`}
//                         width="6"
//                         height="6"
//                         patternTransform="rotate(45)"
//                         patternUnits="userSpaceOnUse"
//                       >
//                         <rect width="6" height="6" fill="#eef1f5" />
//                         <line x1="0" y1="0" x2="0" y2="6" stroke="#dbe2ea" strokeWidth="2.5" />
//                       </pattern>
//                     </React.Fragment>
//                   ))}
//               </defs>
//               <CartesianGrid
//                 vertical={false}
//                 stroke="hsl(215, 20%, 90%)"
//                 strokeDasharray={isPureBarChart ? "3 4" : undefined}
//               />
//               <XAxis
//                 dataKey={xKey}
//                 tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickMargin={10}
//                 tickFormatter={(value) => {
//                   if (
//                     data.length === 1 &&
//                     String(value).toLowerCase() === "today" &&
//                     periodLabel &&
//                     periodLabel !== "Today"
//                   ) {
//                     // Custom date ranges come back as "Mar 01 - Mar 01, 2026", we just use it directly
//                     // Pre-defined ranges like Yesterday come back as "Yesterday"
//                     return periodLabel;
//                   }
//                   return value;
//                 }}
//               />
//               <YAxis
//                 type="number"
//                 domain={[0, "auto"]}
//                 allowDecimals={false}
//                 tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickMargin={10}
//                 width={45}
//                 tickFormatter={isPureBarChart ? formatCompact : undefined}
//               />
//               <ChartTooltip
//                 cursor={
//                   isPureBarChart
//                     ? false
//                     : {
//                       stroke: "hsl(215, 20%, 90%)",
//                       strokeWidth: 1,
//                       strokeDasharray: "4 4",
//                       fill: "transparent",
//                     }
//                 }
//                 content={
//                   isPureBarChart ? (
//                     <PillTooltip series={series} />
//                   ) : (
//                     <ChartTooltipContent
//                       className="bg-white"
//                       labelFormatter={(label) => {
//                         if (
//                           data.length === 1 &&
//                           String(label).toLowerCase() === "today" &&
//                           periodLabel &&
//                           periodLabel !== "Today"
//                         ) {
//                           return periodLabel;
//                         }
//                         return label;
//                       }}
//                       formatter={(value, name) => {
//                         const matchedSeries = series.find((s) => s.key === name);
//                         return (
//                           <div className="flex w-full items-center justify-between gap-2">
//                             <div className="flex items-center gap-1.5">
//                               <div
//                                 className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
//                                 style={{
//                                   backgroundColor:
//                                     matchedSeries?.color || "hsl(215, 16%, 65%)",
//                                 }}
//                               />
//                               <span className="text-muted-foreground">
//                                 {matchedSeries?.label || name}
//                               </span>
//                             </div>
//                             <span className="font-mono font-medium tabular-nums text-foreground">
//                               {Number(value).toLocaleString()}
//                             </span>
//                           </div>
//                         );
//                       }}
//                     />
//                   )
//                 }
//               />
//               {series.length > 1 && (
//                 <ChartLegend content={<ChartLegendContent />} />
//               )}
//               {series.map((s) => {
//                 const effectiveType = data.length === 1 ? "bar" : s.type;
//                 if (effectiveType === "bar") {
//                   if (isPureBarChart) {
//                     return (
//                       <Bar
//                         key={s.key}
//                         dataKey={s.key}
//                         maxBarSize={56}
//                         onMouseEnter={(_, idx) => setHoverIndex(idx)}
//                         shape={(shapeProps) => (
//                           <PillBar
//                             {...shapeProps}
//                             isActive={shapeProps.index === hoverIndex}
//                             color={s.color}
//                             gradientId={`bar-gradient-${s.key}`}
//                             patternId={`bar-hatch-${s.key}`}
//                           />
//                         )}
//                       />
//                     );
//                   }
//                   return (
//                     <Bar
//                       key={s.key}
//                       dataKey={s.key}
//                       fill={s.color}
//                       radius={[4, 4, 0, 0]}
//                       maxBarSize={48}
//                     />
//                   );
//                 } else if (effectiveType === "area") {
//                   return (
//                     <Area
//                       key={s.key}
//                       type="monotone"
//                       dataKey={s.key}
//                       stroke={s.color}
//                       strokeWidth={1.5}
//                       fillOpacity={1}
//                       fill={`url(#gradient-${s.key})`}
//                       activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
//                     />
//                   );
//                 } else {
//                   return (
//                     <Line
//                       key={s.key}
//                       type="monotone"
//                       dataKey={s.key}
//                       stroke={s.color}
//                       strokeWidth={1.5}
//                       dot={false}
//                       activeDot={{ r: 4 }}
//                     />
//                   );
//                 }
//               })}
//             </ComposedChart>
//           </ChartContainer>
//         ) : (
//           <div
//             className={`w-full ${height} flex items-center justify-center text-xs text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl`}
//           >
//             No data available
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrendChartCard;

import React, { useState } from "react";
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
import { Info } from "lucide-react";

// ── Pill-bar rendering (reference-design match) ────────────────────────────
// Only kicks in when EVERY series on the card is a bar series (e.g.
// "Plan-wise Revenue", "Top Selling Plans"). Area/line charts — and any
// mixed bar+line/area combo — fall straight through to the original
// rendering below, completely untouched.
//
// Default bars: diagonal hatch fill. Hovered bar: solid top→bottom
// gradient + a small connector dot, with a floating pill tooltip above it.
function PillBar({ x, y, width, height, index, isActive, color, gradientId, patternId }) {
  if (width <= 0 || height <= 0) return null;
  const radius = Math.min(width / 2, height / 2);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={isActive ? `url(#${gradientId})` : `url(#${patternId})`}
        className="transition-[fill] duration-150"
      />
      {isActive && (
        <circle
          cx={x + width / 2}
          cy={y}
          r={5}
          fill={color}
          stroke="#fff"
          strokeWidth={2}
        />
      )}
    </g>
  );
}

function PillTooltip({ active, payload, series }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const matched = series.find((s) => s.key === item.dataKey) || series[0];
  return (
    <div
      className="rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg whitespace-nowrap"
      style={{ background: matched?.color }}
    >
      {Number(item.value).toLocaleString()}
    </div>
  );
}

// Compact tick formatter for the pill-bar Y axis (40000 -> "40k"). Only
// used in pure-bar mode, so charts with small counts elsewhere are
// unaffected.
const formatCompact = (value) => {
  const num = Number(value);
  if (Math.abs(num) >= 1000) {
    const trimmed = num % 1000 === 0 ? (num / 1000).toFixed(0) : (num / 1000).toFixed(1);
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
}) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const chartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );
  // Ensure we actually have non-zero data to plot, not just a padded zero-value array
  // which can happen for single-day periods like 'Yesterday' or 'Today'.
  const hasData = data.length > 0 && data.some(point =>
    series.some(s => Number(point[s.key]) > 0)
  );

  // Every series is a bar → use the reference-design pill treatment.
  // Any area/line present → fall through to the original chart untouched.
  const isPureBarChart = series.length > 0 && series.every((s) => s.type === "bar");

  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md flex flex-col h-full overflow-hidden">
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

      <div className="flex-1 flex flex-col p-4 pb-6">
        {hasData ? (
          <ChartContainer config={chartConfig} className={`w-full ${height}`}>
            <ComposedChart
              data={data}
              margin={
                isPureBarChart
                  ? { top: 28, right: 12, left: 0, bottom: 0 }
                  : { top: 8, right: 12, left: 0, bottom: 0 }
              }
              onMouseLeave={() => isPureBarChart && setHoverIndex(null)}
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
                        <stop offset="100%" stopColor={s.color} stopOpacity={0.1} />
                      </linearGradient>
                      <pattern
                        id={`bar-hatch-${s.key}`}
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect width="6" height="6" fill="#eef1f5" />
                        <line x1="0" y1="0" x2="0" y2="6" stroke="#dbe2ea" strokeWidth="2.5" />
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
                tickMargin={10}
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
              <ChartTooltip
                cursor={
                  isPureBarChart
                    ? false
                    : {
                      stroke: "hsl(215, 20%, 90%)",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                      fill: "transparent",
                    }
                }
                content={
                  isPureBarChart ? (
                    <PillTooltip series={series} />
                  ) : (
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
                        const matchedSeries = series.find((s) => s.key === name);
                        return (
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor:
                                    matchedSeries?.color || "hsl(215, 16%, 65%)",
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
                  )
                }
              />
              {series.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((s) => {
                const effectiveType = data.length === 1 ? "bar" : s.type;
                if (effectiveType === "bar") {
                  if (isPureBarChart) {
                    return (
                      <Bar
                        key={s.key}
                        dataKey={s.key}
                        maxBarSize={56}
                        onMouseEnter={(_, idx) => setHoverIndex(idx)}
                        onMouseMove={(_, idx) => setHoverIndex(idx)}
                        onMouseLeave={() => setHoverIndex(null)}
                        shape={(shapeProps) => (
                          <PillBar
                            {...shapeProps}
                            isActive={shapeProps.index === hoverIndex}
                            color={s.color}
                            gradientId={`bar-gradient-${s.key}`}
                            patternId={`bar-hatch-${s.key}`}
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
                      type="monotone"
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
                      type="monotone"
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
            className={`w-full ${height} flex items-center justify-center text-xs text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl`}
          >
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChartCard;