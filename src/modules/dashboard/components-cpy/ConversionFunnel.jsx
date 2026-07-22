import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Info, Filter, ArrowDown, ArrowUp } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";

export const ConversionFunnel = ({ data }) => {
  if (!data) return null;
  const stages = Array.isArray(data.stages) ? data.stages : [];

  // Parameters to control the funnel shape
  const totalStages = stages.length;
  // We'll define the width at the very top and very bottom
  // and interpolate for segments in between.
  const startWidth = 100; // top of first segment
  const endWidth = 40; // bottom of last segment

  // How much the width decreases across the entire funnel
  const totalReduction = startWidth - endWidth;
  // Reduction per segment
  const reductionPerSegment = totalReduction / totalStages;

  return (
    <Card className="flex flex-col h-full bg-white border-slate-300/60 hover:border-blue-200 transition-all duration-300 py-5 gap-4 shadow-sm rounded-2xl overflow-hidden">
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

      <CardContent className="flex-1 flex flex-col pt-4 px-6">
        <div className="flex-1 flex flex-col gap-2">
          {stages.map((stage, idx) => {
            // Calculate the top and bottom widths for this specific trapezoid
            const currentTop = startWidth - idx * reductionPerSegment;
            const currentBottom = startWidth - (idx + 1) * reductionPerSegment;

            // Convert width to percentage strings for clip-path
            // We center the trapezoid, so we need to calculate the offset (x)
            const x1 = (100 - currentTop) / 2;
            const x2 = 100 - x1;
            const x3 = 100 - (100 - currentBottom) / 2;
            const x4 = (100 - currentBottom) / 2;

            return (
              <div key={idx} className="flex items-center gap-6 min-h-[70px]">
                {/* Funnel Segment — Rounded Clip-Path */}
                <div className="flex-1 relative h-full flex items-center justify-center">
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <clipPath
                        id={`funnel-clip-${idx}`}
                        clipPathUnits="objectBoundingBox"
                      >
                        <path
                          d={`
                          M ${(x1 + 4) / 100} 0 
                          L ${(x2 - 4) / 100} 0 
                          Q ${x2 / 100} 0 ${(x2 - 1) / 100} 0.15
                          L ${(x3 + 3) / 100} 0.80
                          Q ${x3 / 100} 1 ${(x3 - 4) / 100} 1
                          L ${(x4 + 3) / 100} 1  
                          Q ${x4 / 100} 1 ${(x4 - 1.5) / 105} 0.78
                          L ${(x1 + 2) / 105} 0.2
                          Q ${x1 / 100} 0 ${(x1 + 4) / 100} 0
                          Z 
                        `}
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <div
                    className="w-full h-full flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: stage.color,
                      clipPath: `url(#funnel-clip-${idx})`,
                      WebkitClipPath: `url(#funnel-clip-${idx})`,
                    }}
                  >
                    <span className="text-sm font-bold text-white text-center px-4 leading-tight tracking-tight">
                      {stage.label}
                    </span>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="w-[160px] flex flex-col justify-center shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[22px] font-bold text-slate-900 leading-none tracking-tight">
                      {stage.value.toLocaleString()}
                    </span>
                    {stage.dropOff !== 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-100/50 rounded-full text-rose-500 text-[11px] font-bold">
                        <ArrowDown size={12} strokeWidth={3} />
                        {Math.abs(stage.dropOff).toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-slate-400 mt-1.5">
                    {((stage.value / stages[0].value) * 100)
                      .toFixed(2)
                      .replace(/\.00$/, "")}
                    %
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full breakdown — the funnel bars above only show the 2 sequential
            checkpoints (signups -> paid), so notPaidUsers/conversionRate/
            dropOffRate are surfaced here as their own numbers rather than
            only being implied by the drop-off badge. */}
        {(data.notPaidUsers !== undefined ||
          data.conversionRate !== undefined) && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-100 border border-slate-200/80 px-4 py-4 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-slate-500">
                Not Paid Yet
              </p>
              <p className="text-[22px] font-extrabold text-[#e17b34] mt-2 leading-none">
                {(data.notPaidUsers ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 border border-slate-200/80 px-4 py-4 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-slate-500">
                Conversion Rate
              </p>
              <p className="text-[22px] font-extrabold text-[#15b097] mt-2 leading-none">
                {data.conversionRate ?? 0}%
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 border border-slate-200/80 px-4 py-4 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-slate-500">
                Drop-off Rate
              </p>
              <p className="text-[22px] font-extrabold text-rose-500 mt-2 leading-none">
                {data.dropOffRate ?? 0}%
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {/* Primary Highlight Insight Footnote Container */}
      <CardFooter className="pt-1">
        <div className="mt-6 w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-blue-400 shrink-0" />
          </div>
          <span>{data.insight}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
