import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, History, CheckCircle2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import dummyImg from "@/assets/web/dummyImg.webp";
import { format } from "date-fns";
import { useState } from "react";

const ReportItem = ({ r }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card className="group rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden mb-3 last:mb-0 transition-all shrink-0">
      <CardContent className="p-0">
        {/* 1. Header Section */}
        <div className="flex items-center justify-between px-8 pb-4 bg-slate-50/30 border-b border-slate-300/60">
          <div className="flex items-center gap-3">
            {r.status === "resolved" ? (
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-bold px-3 py-1 shadow-none rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved
              </Badge>
            ) : r.status === "in_progress" ? (
              <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold px-3 py-1 shadow-none rounded-full flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                In progress
              </Badge>
            ) : (
              <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-[10px] font-bold px-3 py-1 shadow-none rounded-full flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </Badge>
            )}

            <Badge
              className={cn(
                "text-[10px] font-semibold tracking-wide px-3 py-1 shadow-none rounded-md border capitalize",
                r.status === "resolved" && (!r.reason || r.reason === "other")
                  ? "bg-slate-50 text-slate-400 border-slate-300/60"
                  : "bg-rose-50 text-rose-500 border-rose-100",
              )}
            >
              {r.reason?.replace(/_/g, " ") || "other"}
            </Badge>
          </div>
          <time className="text-xs font-medium text-muted-foreground/80">
            {r.createdAt ? format(new Date(r.createdAt), "dd MMM, yyyy") : "—"}
          </time>
        </div>

        {/* 2. User Info Section */}
        <div className="px-8 pt-5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-300/60">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-full border-2 border-white shadow-sm">
                <AvatarImage src={r.reportedBy?.avatar || dummyImg} alt="" />
                <AvatarFallback className="bg-slate-100 text-slate-500 font-black text-sm">
                  {r.reportedBy?.nickname?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-black text-slate-900 leading-none mb-1.5">
                  {r.reportedBy?.nickname || "Anonymous"}
                </h4>
                <p className="text-xs font-medium text-muted-foreground/80">
                  Reported this profile
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground/80">
                {r.createdAt
                  ? format(new Date(r.createdAt), "dd MMM, yyyy")
                  : "—"}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground/80 mt-1">
                {r.createdAt ? format(new Date(r.createdAt), "hh:mm aa") : ""}
              </p>
            </div>
          </div>

          {/* 3. Description Box */}
          <div className="bg-slate-50 border border-slate-300/60/80 rounded-lg px-6 py-4">
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed italic">
              "{r.description || "No details provided."}"
            </p>
          </div>

          {/* 4. Admin Action & Collapsible History */}
          {(r.status === "resolved" ||
            (r.replyHistory && r.replyHistory.length > 0)) && (
            <div
              className={cn(
                "border rounded-lg px-6 py-4 flex flex-col gap-3",
                r.status === "resolved"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-300/60",
              )}
            >
              <div className="flex items-center justify-between">
                {/* Latest Decision (if resolved) */}
                <div className="flex items-center gap-2.5">
                  {r.status === "resolved" ? (
                    <>
                      <div className="bg-emerald-100 p-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex flex-col items-start">
                        <h4 className="text-[12px] font-bold text-emerald-600">
                          Decision:{" "}
                          {r.actionTaken?.replace(/_/g, " ") || "Resolved"}
                        </h4>
                        <p className="text-[10px] text-emerald-600 font-bold opacity-60">
                          {r.resolvedAt
                            ? format(new Date(r.resolvedAt), "dd MMM, yyyy")
                            : "—"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <History className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Active Investigation
                      </span>
                    </div>
                  )}
                </div>

                {/* History Toggle Button */}
                {r.replyHistory && r.replyHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300/60 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {r.replyHistory.length}{" "}
                    {r.replyHistory.length === 1 ? "Reply" : "Replies"}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-300",
                        showHistory ? "rotate-180" : "",
                      )}
                    />
                  </button>
                )}
              </div>

              {/* Collapsible History Content */}
              {r.replyHistory && r.replyHistory.length > 0 && showHistory && (
                <div className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="h-px bg-slate-200 mb-4" />
                  {r.replyHistory.map((reply, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex flex-col gap-1.5 bg-white/60 p-3.5 rounded-xl border border-slate-300/60 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                          {reply.repliedBy?.nickname || "Admin"} Response
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {reply.repliedAt
                            ? format(
                                new Date(reply.repliedAt),
                                "dd MMM, hh:mm aa",
                              )
                            : "—"}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ReportsSection = ({ reports, activeTab }) => {
  const pendingReports = reports?.filter((r) => r.status !== "resolved") || [];
  const resolvedReports = reports?.filter((r) => r.status === "resolved") || [];

  const reportsToDisplay =
    activeTab === "reports" ? pendingReports : resolvedReports;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.08em] flex items-center gap-3">
          {activeTab === "reports"
            ? "PENDING INVESTIGATIONS"
            : "REPORT HISTORY"}
          {reportsToDisplay.length > 0 && (
            <Badge
              className={cn(
                "text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-none",
                activeTab === "reports"
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "bg-[#ECFDF5] text-[#10B981]",
              )}
            >
              {reportsToDisplay.length}{" "}
              {activeTab === "reports" ? "PENDING" : "RESOLVED"}
            </Badge>
          )}
        </h3>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 w-full",
          reportsToDisplay.length > 0 &&
            "max-h-[600px] overflow-y-auto pr-4 custom-scrollbar",
        )}
      >
        {reportsToDisplay.length === 0 ? (
          <Card className="rounded-xl border-slate-300/60 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-10 flex flex-col items-center justify-center opacity-60">
              <History className="w-10 h-10 text-muted-foreground/90 mb-3" />
              <p className="font-black text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                No Records Found
              </p>
            </CardContent>
          </Card>
        ) : (
          reportsToDisplay.map((r, idx) => (
            <ReportItem key={r._id || r.id || idx} r={r} />
          ))
        )}
      </div>
    </div>
  );
};
