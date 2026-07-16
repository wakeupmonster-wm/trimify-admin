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
    <Card className="flex flex-col h-full bg-white border-slate-200 hover:border-blue-200 transition-all duration-300 py-5 gap-4 shadow-sm rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-4 px-6 border-b border-slate-200">
        <DashboardHead
          title="Conversion Funnel"
          subtitle="Where users drop off"
          Icon={Filter}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
          tooltipText="Tracks the percentage of users successfully moving through key milestones — from installing the app to purchasing a subscription."
        />
      </div>

      <CardContent className="flex-1 flex flex-col pt-1">
        <div className="flex-1 flex flex-col pt-1">
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
              <div
                key={idx}
                className="grid grid-cols-[1fr_70px_70px] items-center group min-h-[52px]"
              >
                {/* Funnel Segment — Rounded Clip-Path */}
                <div className="relative h-full flex items-center justify-center px-1 md:px-20 lg:px-0.5">
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
                          L ${(x3 + 1) / 100} 0.78
                          Q ${x3 / 100} 1 ${(x3 - 4) / 100} 1
                          L ${(x4 + 4) / 100} 1
                          Q ${x4 / 100} 1 ${(x4 - 1.5) / 100} 0.78
                          L ${(x1 + 1) / 100} 0.15
                          Q ${x1 / 100} 0 ${(x1 + 4) / 100} 0
                          Z
                        `}
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <div
                    className="w-full h-full max-h-[50px] flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: stage.color,
                      clipPath: `url(#funnel-clip-${idx})`,
                      WebkitClipPath: `url(#funnel-clip-${idx})`,
                    }}
                  >
                    <span className="text-[11px] font-bold text-foreground opacity-90 text-center px-2 leading-tight tracking-tight">
                      {stage.label}
                    </span>
                  </div>
                </div>

                {/* Value (Count) */}
                <div className="pl-3 text-[13px] font-bold text-[#202939]">
                  {stage.value.toLocaleString()}
                </div>

                {/* Drop-off Percentage — Premium Pill Badge */}
                <div className="flex justify-end pr-2">
                  {stage.dropOff !== 0 && (
                    <div
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm/5 border ${
                        stage.dropOff > 0
                          ? "bg-emerald-50 border-emerald-100 text-emerald-500"
                          : "bg-rose-50 border-rose-100 text-rose-500"
                      }`}
                    >
                      {stage.dropOff > 0 ? (
                        <ArrowUp size={10} strokeWidth={3} />
                      ) : (
                        <ArrowDown size={10} strokeWidth={3} />
                      )}
                      {Math.abs(stage.dropOff)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight Box */}
        {/* <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-brand-blue border border-brand-blue rounded-xl text-muted-foreground text-[10px] font-bold leading-snug">
          <Info size={15} className="text-[#46C7CD] shrink-0" />
          {data.insight}
        </div> */}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="mt-4 w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={14} className="text-brand-blue shrink-0" />
          </div>
          {data.insight}
        </div>
      </CardFooter>
    </Card>
  );
};
