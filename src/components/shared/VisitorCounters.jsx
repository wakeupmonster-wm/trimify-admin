import React from "react";
import { cn } from "@/lib/utils";

export function VisitorTopCounters({ currentAndroid, currentIos, activeChart, onToggleChart }) {
  return (
    <div className="w-full flex items-center justify-between gap-4 px-6 mt-4">
      <div className="flex items-center gap-8">
        {/* Android Counter */}
        <div
          onClick={() => onToggleChart("android")}
          className={cn(
            "flex flex-col items-center cursor-pointer hover:opacity-80 transition-all select-none",
            activeChart !== "both" && activeChart !== "android" && "opacity-40 grayscale"
          )}
        >
          <p className="text-base font-bold text-slate-800">
            {currentAndroid.toLocaleString()}
          </p>
          <div className="flex gap-2 items-center leading-none">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-emerald-100" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Android
            </span>
          </div>
        </div>

        {/* iOS Counter */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onToggleChart("ios")}
            className={cn(
              "flex flex-col items-center cursor-pointer hover:opacity-80 transition-all select-none",
              activeChart !== "both" && activeChart !== "ios" && "opacity-40 grayscale"
            )}
          >
            <p className="text-base font-bold text-slate-800">
              {currentIos.toLocaleString()}
            </p>
            <div className="flex gap-2 items-center leading-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-100" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                iOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisitorBottomLegends({ activeChart, onToggleChart }) {
  return (
    <div className="flex w-full mt-6 items-center justify-center gap-6 px-4">
      <div
        onClick={() => onToggleChart("android")}
        className={cn(
          "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all select-none",
          activeChart !== "both" && activeChart !== "android" && "opacity-40 grayscale"
        )}
      >
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-xs font-bold text-slate-500">Android</span>
      </div>
      <div
        onClick={() => onToggleChart("ios")}
        className={cn(
          "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all select-none",
          activeChart !== "both" && activeChart !== "ios" && "opacity-40 grayscale"
        )}
      >
        <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
        <span className="text-xs font-bold text-slate-500">iOS</span>
      </div>
    </div>
  );
}
