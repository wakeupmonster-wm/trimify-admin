import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const AuditLogItem = ({ item, isLast }) => {
  const getStatusColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes("ban") || a.includes("reject")) return "bg-rose-500";
    if (a.includes("suspend") || a.includes("delete")) return "bg-amber-500";
    if (
      a.includes("approve") ||
      a.includes("unban") ||
      a.includes("unsuspend") ||
      a.includes("activate")
    )
      return "bg-emerald-500";
    return "bg-slate-400";
  };

  const getStatusBorder = (action) => {
    const a = action.toLowerCase();
    if (a.includes("ban") || a.includes("reject")) return "border-rose-100";
    if (a.includes("suspend") || a.includes("delete"))
      return "border-amber-100";
    if (
      a.includes("approve") ||
      a.includes("unban") ||
      a.includes("unsuspend") ||
      a.includes("activate")
    )
      return "border-emerald-100";
    return "border-slate-100";
  };

  return (
    <div className="relative flex gap-3.5 pb-6">
      {!isLast && (
        <div className="absolute left-[7px] top-[28px] bottom-0 w-[2px] bg-slate-200" />
      )}

      <div
        className={cn(
          "relative z-10 w-4 h-4 rounded-full border-4 mt-1.5 shrink-0",
          getStatusColor(item.action),
          getStatusBorder(item.action),
        )}
      />

      <div className="space-y-2 flex-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            {item.timestamp
              ? format(new Date(item.timestamp), "dd MMMM, yyyy • hh:mm a")
              : "N/A"}
          </span>
          <h4 className="text-[13px] font-bold text-slate-900 capitalize">
            {item.action}
          </h4>
        </div>

        {(item.reason ||
          item.details?.replyMessage ||
          item.details?.durationHours) && (
          <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-lg p-3 space-y-2 mt-1">
            {item.reason && (
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Reason:
                </p>
                <p className="text-[10px] text-slate-600 italic">
                  "{item.reason}"
                </p>
              </div>
            )}

            {item.details?.replyMessage && (
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-brand-aqua uppercase tracking-widest">
                  Admin Correspondence:
                </p>
                <p className="text-[10px] text-slate-700 capitalize font-medium">
                  {item.details.replyMessage}
                </p>
              </div>
            )}

            {item.details?.durationHours && (
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                  Suspension Duration:
                </p>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                    {item.details.durationHours} Hours
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] font-medium text-slate-400">
            Action By:
          </span>
          <span
            className={cn(
              "text-[10px] font-bold",
              item.by === "System" ? "text-slate-500" : "text-brand-aqua",
            )}
          >
            {item.by}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AuditLogDialog = ({ isOpen, onOpenChange, logs = [] }) => {
  // Use provided logs or fallback to dummy data for design demonstration
  const displayLogs =
    logs.length > 0
      ? logs
      : [
          {
            timestamp: "2026-04-28T14:45:00Z",
            action: "Account Permanently Banned",
            reason:
              "Multiple violations of community guidelines. Inappropriate behavior reported by 5+ users.",
            by: "Admin John",
          },
          {
            timestamp: "2026-04-20T11:20:00Z",
            action: "Gallery Photos Deleted",
            reason:
              "3 photos removed due to platform policy violations (NSFW content).",
            by: "System (Auto-Mod)",
          },
          {
            timestamp: "2026-04-16T09:15:00Z",
            action: "Account Created",
            reason: "New user registration via Email.",
            by: "System",
          },
        ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-white flex flex-col h-[600px]">
          <div className="p-8 pb-4 flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Profile Audit Log
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
            <div className="space-y-0">
              {displayLogs.map((log, index) => (
                <AuditLogItem
                  key={index}
                  item={log}
                  isLast={index === displayLogs.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
