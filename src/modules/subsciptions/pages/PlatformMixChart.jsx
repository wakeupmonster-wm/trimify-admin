import React from "react";
import { cn } from "@/lib/utils";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { LiaUserTieSolid } from "react-icons/lia";
import { IconChartBarOff } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function PlatformMixChart({ platformData, isPlatformMixEmpty }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[14px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-[440px] flex flex-col">
      <div className="p-[18px_22px] border-b border-[#E5E7EB] flex items-center gap-[10px]">
        <div className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center bg-[#F1F5F9] text-[#475569]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <div>
          <div className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#1F2937]">
            Platform Mix
          </div>
          <div className="text-[11.5px] text-[#9CA3AF] mt-[1px]">
            Revenue by platform
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 overflow-y-auto flex flex-col">
        {isPlatformMixEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF]">
            <IconChartBarOff className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold text-center">
              No platform data available
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {(() => {
              const normalized = [
                { name: "Apple iOS", value: 0, _isIOS: true },
                { name: "Android", value: 0, _isAndroid: true },
              ];
              const others = [];

              (platformData || []).forEach((p) => {
                const pName = (p.name || "").toUpperCase();
                if (pName.includes("IOS") || pName.includes("APPLE")) {
                  normalized[0].value += p.value || 0;
                } else if (
                  pName.includes("ANDROID") ||
                  pName.includes("GOOGLE")
                ) {
                  normalized[1].value += p.value || 0;
                } else {
                  others.push(p);
                }
              });

              const combined = [...normalized, ...others];
              const total = combined.reduce(
                (acc, curr) => acc + (curr.value || 0),
                0
              );

              return combined.map((platform, idx) => {
                const percentage =
                  total > 0 ? ((platform.value || 0) / total) * 100 : 0;
                const pName = (platform.name || "").toUpperCase();
                const isIOS =
                  platform._isIOS ||
                  pName.includes("IOS") ||
                  pName.includes("APPLE");
                const isAndroid =
                  platform._isAndroid ||
                  pName.includes("ANDROID") ||
                  pName.includes("GOOGLE");

                return (
                  <div
                    key={idx}
                    className="p-[16px] rounded-[12px] border border-slate-200 bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between mb-[12px]">
                      <div className="flex items-center gap-[12px]">
                        <div
                          className={cn(
                            "w-[36px] h-[36px] rounded-[10px] flex items-center justify-center border",
                            isAndroid
                              ? "bg-emerald-100/60 border-emerald-200 text-emerald-600"
                              : isIOS
                                ? "bg-slate-100/60 border-slate-200 text-slate-800"
                                : "bg-purple-100/60 border-purple-200 text-purple-800"
                          )}
                        >
                          {isAndroid ? (
                            <AiFillAndroid className="w-[18px] h-[18px]" />
                          ) : isIOS ? (
                            <AiFillApple className="w-[18px] h-[18px]" />
                          ) : (
                            <LiaUserTieSolid className="w-[18px] h-[18px]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1F2937]">
                            {isIOS
                              ? "Apple iOS"
                              : isAndroid
                                ? "Android"
                                : platform.name}
                          </p>
                          <p className="text-[11px] font-medium text-[#9CA3AF]">
                            {percentage.toFixed(1)}% of total revenue
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-extrabold text-[#1F2937]">
                          $
                          {platform.value?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="h-[6px] bg-slate-200 rounded-[6px] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-[6px]",
                          isAndroid
                            ? "bg-emerald-500"
                            : isIOS
                              ? "bg-slate-800"
                              : "bg-purple-500"
                        )}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
