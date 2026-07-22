import React from "react";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import { LuUsersRound } from "react-icons/lu";

export function GenderRatio({ data }) {
  if (!data) return null;

  // Extract the specific metric from zoneC if needed
  const metric = data.metrics?.find((m) => m.label === "Gender Ratio") || data;

  const maleCount = metric.maleCount || 0;
  const femaleCount = metric.femaleCount || 0;
  const totalCount = maleCount + femaleCount;

  let maleRatioText = 0;
  let femaleRatioText = 0;

  if (totalCount > 0) {
    if (maleCount > 0 && femaleCount > 0) {
      const rawMaleRatio = (maleCount / totalCount) * 100;
      const roundedMale = Math.round(rawMaleRatio);

      if (roundedMale >= 100) {
        maleRatioText = 99;
        femaleRatioText = 1;
      } else if (roundedMale <= 0) {
        maleRatioText = 1;
        femaleRatioText = 99;
      } else {
        maleRatioText = roundedMale;
        femaleRatioText = 100 - roundedMale;
      }
    } else if (maleCount > 0) {
      maleRatioText = 100;
      femaleRatioText = 0;
    } else if (femaleCount > 0) {
      maleRatioText = 0;
      femaleRatioText = 100;
    }
  }

  const maleProgressWidth = maleRatioText;
  const femaleProgressWidth = femaleRatioText;

  return (
    <div className="bg-white border border-slate-300/60 rounded-2xl pt-5 pb-0 shadow-sm hover:border-blue-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-3 px-6 pb-3.5 border-b border-slate-300/60">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100/50 flex items-center justify-center">
            <LuUsersRound className="text-xl text-slate-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900">Gender Ratio</h3>
            <p className="text-[11px] font-medium text-slate-400">
              {metric.subtitle || "Distribution of male vs female signups"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-4 mt-4">
        {/* Ratio Text */}
        <div className="mb-4">
          <div className="text-xl font-black text-slate-900 leading-none">
            {maleRatioText} : {femaleRatioText}
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Male : Female
          </div>
        </div>

        <div className="relative h-7 w-full bg-slate-100 rounded-md flex overflow-hidden mb-4">
          {/* Segments */}
          {maleProgressWidth > 0 && (
            <div
              className="h-full bg-[#44cacfff] transition-all duration-1000 ease-out"
              style={{ width: `${maleProgressWidth}%` }}
            />
          )}
          {femaleProgressWidth > 0 && (
            <div
              className="h-full bg-[#44cacfff]/30 transition-all duration-1000 ease-out"
              style={{ width: `${femaleProgressWidth}%` }}
            />
          )}

          {/* Absolute Labels Overlay */}
          <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none">
            {maleProgressWidth > 0 ? (
              <span
                className={`text-[10px] font-black whitespace-nowrap ${
                  maleProgressWidth > 15
                    ? "text-white drop-shadow-sm"
                    : "text-brand-blue"
                }`}
              >
                {maleRatioText}%
              </span>
            ) : (
              <div />
            )}
            {femaleProgressWidth > 0 ? (
              <span className="text-[10px] font-black whitespace-nowrap text-brand-blue">
                {femaleRatioText}%
              </span>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Signup Counts */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-1">
            <IconGenderMale className="w-6 h-6 text-[#44cacfff]" stroke={2} />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-[#0F172A]">
                {/* {ratio}%  */}
                Male
              </span>
              <span className="text-[10px] font-medium text-slate-400 italic">
                ({metric.maleCount || 0} signups)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-1">
            <IconGenderFemale className="w-6 h-6 text-[#ec4899]" stroke={2} />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-black text-[#0F172A]">
                {/* {femaleRatio}%  */}
                Female
              </span>
              <span className="text-[10px] font-medium text-slate-400 italic">
                ({metric.femaleCount || 0} signups)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
