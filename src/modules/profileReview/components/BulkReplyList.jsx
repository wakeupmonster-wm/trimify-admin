import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dummyImg from "@/assets/web/dummyImg.webp";
import { cn } from "@/lib/utils";

/**
 * Modular component for Bulk Replying to multiple reports
 * Now acts as a read-only targeted list, as the reply message is unified.
 */
export const BulkReplyList = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="sticky top-0 bg-white pb-2 z-10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            Targeted Reporters ({reports.length})
          </h4>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-blue text-brand-blue rounded-full">
            Bulk Mode Active
          </span>
        </div>
        <div className="h-px bg-slate-100 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-3 pb-2">
        {reports.map((r) => {
          return (
            <div
              key={r._id}
              className={cn(
                "p-3 rounded-xl border transition-all duration-300",
                "bg-slate-50/30 border-slate-200",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-full border-2 border-white shadow-sm">
                    <AvatarImage src={r.reportedBy?.avatar || dummyImg} />
                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                      {r.reportedBy?.nickname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-800 tracking-tight">
                      {r.reportedBy?.nickname || "User"}
                    </p>
                    <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-wider line-clamp-1">
                      {r.reason?.replace(/_/g, " ") || "Reported"}
                    </p>
                  </div>
                </div>
              </div>

              {r.description && (
                <div className="mt-2.5 bg-white/80 p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                    "{r.description}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
