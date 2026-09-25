import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Users, TrendingUp, TrendingDown } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";

export const ConversionFunnel = ({ data }) => {
  if (!data) return null;
  const stages = Array.isArray(data.stages) ? data.stages : [];

  const stage0 = stages[0] || { label: "Total Signups", value: 0 };
  const stage1 = stages[1] || { label: "Paid Users", value: 0 };

  const stage0Val = stage0.value || 0;
  const stage1Val = stage1.value || 0;

  const conversionPct =
    stage0Val > 0
      ? ((stage1Val / stage0Val) * 100).toFixed(2).replace(/\.00$/, "")
      : "0";
  const conversionPctStr = `${conversionPct}%`;

  const notPaidVal =
    data.notPaidUsers !== undefined
      ? data.notPaidUsers
      : Math.max(0, stage0Val - stage1Val);

  const conversionRateDisplay =
    data.conversionRate !== undefined
      ? `${data.conversionRate}%`
      : `${conversionPctStr}`;

  const dropOffRateDisplay =
    data.dropOffRate !== undefined
      ? `${data.dropOffRate}%`
      : stage0Val > 0
        ? `${(100 - (stage1Val / stage0Val) * 100).toFixed(2).replace(/\.00$/, "")}%`
        : "0%";

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

      <CardContent className="flex-1 flex flex-col justify-between p-6 gap-6">
        {/* Main Curved Horizontal Funnel Area */}
        <div className="w-full flex flex-col gap-2 relative">
          {/* Main counts ABOVE the funnel */}
          <div className="w-full flex items-center justify-around px-8">
            <div className="flex-1 text-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                {stage0Val.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                {stage1Val.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Curved Funnel SVG Diagram with Overlay Percentage Pills */}
          <div className="relative w-full aspect-[6/2] max-h-[190px] my-2">
            <svg
              viewBox="0 0 600 180"
              className="w-full h-full overflow-visible select-none block"
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
                  <rect width="7" height="7" fill="#009EE9" />
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
                  <rect width="7" height="7" fill="#3DC1FF" />
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
                d="M 15,10 C 130,10 195,50 300,50 L 300,130 C 195,130 130,170 15,170 Z"
                fill="#B9E9FF"
                opacity="0.4"
              />
              <path
                d="M 300,50 C 410,50 485,58 585,58 L 585,122 C 485,122 410,130 300,130 Z"
                fill="#B9E9FF"
                opacity="0.3"
              />

              {/* --- SECOND TRANSLUCENT DEPTH LAYER --- */}
              <path
                d="M 17,17 C 132,17 197,55 300,55 L 300,125 C 197,125 132,163 17,163 Z"
                fill="#90DBFF"
                opacity="0.55"
              />
              <path
                d="M 300,55 C 410,55 485,62 585,62 L 585,118 C 485,118 410,125 300,125 Z"
                fill="#90DBFF"
                opacity="0.45"
              />

              {/* --- MAIN INNER FUNNEL STAGE 1 (TOTAL SIGNUPS) --- */}
              <path
                d="M 20,24 C 135,24 200,60 300,60 L 300,120 C 200,120 135,156 20,156 Z"
                fill="url(#funnel-stripe-dark)"
              />

              {/* --- MAIN INNER FUNNEL STAGE 2 (PAID USERS) --- */}
              <path
                d="M 300,60 C 410,60 485,66 585,66 L 585,114 C 485,114 410,120 300,120 Z"
                fill="url(#funnel-stripe-light)"
              />

              {/* Vertical divider line between Stage 1 & Stage 2 */}
              <line
                x1="300"
                y1="57"
                x2="300"
                y2="123"
                stroke="white"
                strokeWidth="2.5"
              />
            </svg>

            {/* Percentage Pill for Stage 1 (100%) */}
            <div className="absolute top-1/2 left-[26%] -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-white shadow-md rounded-full border border-slate-100 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                100%
              </span>
            </div>

            {/* Percentage Pill for Stage 2 (Conversion %) */}
            <div className="absolute top-1/2 left-[73%] -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-white shadow-md rounded-full border border-slate-100 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-extrabold text-[#009EE9] tabular-nums">
                {conversionPctStr}
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
    </Card>
  );
};
