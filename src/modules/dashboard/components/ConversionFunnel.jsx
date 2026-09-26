import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Users, TrendingUp, TrendingDown } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { SECTION_CHART_COLORS } from "@/config/theme.config";

export const ConversionFunnel = ({ data }) => {
  const stages = Array.isArray(data?.stages) ? data.stages : [];

  const stage0 = stages[0] || { label: "Total Signups", value: 0 };
  const stage1 = stages[1] || { label: "Paid Users", value: 0 };

  const stage0Val = stage0.value || 0;
  const stage1Val = stage1.value || 0;

  // Empty state: no meaningful data
  const hasData = stages.some((s) => (s.value || 0) > 0);

  const notPaidVal =
    data?.notPaidUsers !== undefined
      ? data.notPaidUsers
      : Math.max(0, stage0Val - stage1Val);

  const conversionRateDisplay =
    data?.conversionRate !== undefined
      ? `${data.conversionRate}%`
      : stage0Val > 0
        ? `${((stage1Val / stage0Val) * 100).toFixed(2).replace(/\.00$/, "")}%`
        : "0%";

  const dropOffRateDisplay =
    data?.dropOffRate !== undefined
      ? `${data.dropOffRate}%`
      : stage0Val > 0
        ? `${(100 - (stage1Val / stage0Val) * 100).toFixed(2).replace(/\.00$/, "")}%`
        : "0%";

  const funnelColors = SECTION_CHART_COLORS?.dashboard?.funnel || {
    primaryStripe: "#009EE9",
    secondaryStripe: "#3DC1FF",
    depthOuter: "#B9E9FF",
    depthInner: "#90DBFF",
  };

  return (
    <Card className="flex flex-col h-full bg-white border-slate-200 hover:border-slate-300 transition-all duration-300 py-5 gap-4 shadow-sm rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title="Conversion Funnel"
          subtitle="Where users drop off"
          Icon={Filter}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
          tooltipText="Tracks the percentage of users successfully moving through key milestones — from installing the app to purchasing a subscription."
        />
      </div>

      {!hasData ? (
        /* ── Empty State ── */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[220px] select-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primary2/10 border border-app-primary2/20 text-app-primary2 shadow-sm mb-3">
            <Filter className="h-6 w-6" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            No data for selected period
          </h4>
          <p className="mt-1 max-w-[280px] text-xs font-medium text-slate-500 leading-relaxed">
            No conversion funnel data recorded for this timeframe. Try choosing a different date range.
          </p>
        </div>
      ) : (
        <CardContent className="flex-1 flex flex-col justify-between p-6 gap-6">
          {/* Main Curved Horizontal Funnel Area */}
          <div className="w-full flex flex-col gap-2 relative">
            {/* Curved Funnel SVG Diagram with Overlay Count Pills */}
            <div className="relative w-full aspect-[6/2] max-h-[190px] my-2">
              <svg
                viewBox="0 0 600 180"
                className="block h-full w-full origin-top scale-y-[1.12] select-none overflow-visible"
              >
                <defs>
                  {/* Stripe pattern matching exact approved pattern */}
                  <pattern
                    id="funnel-stripe-dark"
                    width="7"
                    height="7"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="7" height="7" fill={funnelColors.primaryStripe} />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="7"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.8"
                    />
                  </pattern>

                  <pattern
                    id="funnel-stripe-light"
                    width="7"
                    height="7"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="7" height="7" fill={funnelColors.secondaryStripe} />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="7"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.8"
                    />
                  </pattern>
                </defs>

                {/* --- OUTMOST TRANSLUCENT DEPTH LAYER --- */}
                <path
                  d="M 15,-22 C 90,-22 120,-2 150,10 C 175,16 188,14 215,20 C 245,26 270,41 300,48 L 300,132 C 265,138 238,147 205,152 C 176,157 158,155 132,160 C 98,167 68,184 15,192 Z"
                  fill={funnelColors.depthOuter}
                  opacity="0.4"
                />
                <path
                  d="M 300,48 C 360,50 400,56 435,65 C 458,70 475,67 500,71 C 530,75 558,72 585,70 L 585,120 C 558,120 530,123 500,127 C 475,131 458,128 435,132 C 400,136 360,136 300,132 Z"
                  fill={funnelColors.depthOuter}
                  opacity="0.3"
                />

                {/* --- SECOND TRANSLUCENT DEPTH LAYER --- */}
                <path
                  d="M 15,-12 C 92,-12 122,6 152,18 C 177,24 190,22 217,28 C 247,34 271,48 300,55 L 300,125 C 266,130 240,139 207,144 C 178,149 160,147 134,152 C 100,159 70,175 15,183 Z"
                  fill={funnelColors.depthInner}
                  opacity="0.55"
                />
                <path
                  d="M 300,55 C 360,57 400,63 435,72 C 458,77 475,74 500,78 C 530,82 558,79 585,76 L 585,114 C 558,114 530,117 500,121 C 475,125 458,122 435,126 C 400,130 360,130 300,125 Z"
                  fill={funnelColors.depthInner}
                  opacity="0.45"
                />

                {/* --- MAIN INNER FUNNEL STAGE 1 (TOTAL SIGNUPS) --- */}
                <path
                  d="M 15,-2 C 95,-2 125,14 155,28 C 180,34 193,32 220,38 C 249,44 272,57 300,63 L 300,117 C 267,121 242,130 210,135 C 181,140 163,138 137,143 C 103,150 73,166 15,174 Z"
                  fill="url(#funnel-stripe-dark)"
                />

                {/* --- MAIN INNER FUNNEL STAGE 2 (PAID USERS) --- */}
                <path
                  d="M 300,63 C 360,65 400,71 435,80 C 458,85 475,82 500,86 C 530,90 558,86 585,83 L 585,107 C 558,107 530,110 500,114 C 475,118 458,115 435,119 C 400,123 360,121 300,117 Z"
                  fill="url(#funnel-stripe-light)"
                />

                {/* One continuous divider keeps every funnel layer aligned. */}
                <line
                  x1="300"
                  y1="52"
                  x2="300"
                  y2="128"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </svg>

              {/* Count Pill for Stage 1 (Total Signups — from API) */}
              <div className="absolute top-1/2 left-[26%] -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-white shadow-md rounded-full border border-slate-100 flex items-center justify-center pointer-events-none">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                  {stage0Val.toLocaleString()}
                </span>
              </div>

              {/* Count Pill for Stage 2 (Paid Users — from API, shifted lower and right inside secondary blue section) */}
              <div className="absolute top-[61%] left-[70%] -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-white shadow-md rounded-full border border-slate-100 flex items-center justify-center pointer-events-none">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                  {stage1Val.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Labels BELOW the funnel */}
            <div className="w-full flex items-center justify-around px-8">
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-[#6B7785]">
                  {stage0.label}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-[#6B7785]">
                  {stage1.label}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom 3 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all duration-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#6B7785] truncate">
                  Not Paid Yet
                </span>
                <span className="text-xl font-extrabold text-slate-900 tabular-nums tracking-tight mt-0.5">
                  {notPaidVal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all duration-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <TrendingUp className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#6B7785] truncate">
                  Conversion Rate
                </span>
                <span className="text-xl font-extrabold text-emerald-600 tabular-nums tracking-tight mt-0.5">
                  {conversionRateDisplay}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 transition-all duration-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingDown className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#6B7785] truncate">
                  Drop-off Rate
                </span>
                <span className="text-xl font-extrabold text-rose-600 tabular-nums tracking-tight mt-0.5">
                  {dropOffRateDisplay}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
