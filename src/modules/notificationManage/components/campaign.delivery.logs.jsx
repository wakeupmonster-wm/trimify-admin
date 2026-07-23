import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { TableLoader } from "@/app/loader/table.loader";
import { cn } from "@/lib/utils";

const formatError = (rawError) => {
  if (!rawError) return "Success";
  const err = rawError.toString();

  if (err.includes("Daily user sending limit exceeded")) {
    return "🚫 Gmail Daily Limit Reached (Google blocks sending more emails today).";
  }
  if (
    err.includes("Authentication failed") ||
    err.includes("Invalid login") ||
    err.includes("535 5.7.8")
  ) {
    return "🔑 SMTP Login Failed (Check your email password/App Password).";
  }
  if (err.includes("Connection timeout") || err.includes("ETIMEDOUT")) {
    return "⏳ Connection Timeout (Email server took too long to respond).";
  }
  if (err.includes("Recipient address rejected") || err.includes("550 5.1.1")) {
    return "📧 Invalid Email (Recipient address does not exist).";
  }
  if (err.includes("Too many concurrent connections")) {
    return "⚡ Too many active connections (Slow down the sending speed).";
  }

  return err.length > 80 ? err.substring(0, 80) + "..." : err;
};

export default function CampaignDeliveryLogs({
  isOpen,
  onClose,
  campaign,
  logs,
  loading,
}) {
  console.log("campaign: ", campaign);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] gap-0 overflow-hidden flex flex-col bg-white rounded-2xl border-none shadow-2xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Campaign Delivery Logs
            </DialogTitle>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">
              {campaign?.campaign_name} •{" "}
              {campaign?.created_at &&
                new Date(campaign?.created_at).toLocaleString()}
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-4 bg-slate-50/30 relative min-h-[400px]">
          {loading ? (
            <TableLoader text="Fetching granular logs..." />
          ) : logs && logs.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-auto max-h-[460px] relative">
              <Table className="border-separate border-spacing-0 table-fixed min-w-[600px] w-full relative">
                <TableHeader className="z-20 shadow-sm">
                  <TableRow className="w-full">
                    <TableHead className="sticky top-0 z-30 bg-slate-200/50 w-1/12 text-center text-[10px] font-bold uppercase px-2 h-9">
                      Sr. No
                    </TableHead>
                    <TableHead className="sticky top-0 z-30 bg-slate-200/50 w-1/4 text-[10px] font-bold uppercase px-4 h-9">
                      Recipient
                    </TableHead>
                    <TableHead className="sticky top-0 z-30 bg-slate-200/50 w-1/6 text-[10px] font-bold uppercase px-4 h-9">
                      Status
                    </TableHead>
                    <TableHead className="sticky top-0 z-30 bg-slate-200/50 w-4/12 text-[10px] font-bold uppercase px-4 h-9">
                      Error Details
                    </TableHead>
                    <TableHead className="sticky top-0 z-30 bg-slate-200/50 w-1/6 text-[10px] font-bold uppercase px-4 h-9 text-center">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-slate-50/80 border-slate-100"
                    >
                      <TableCell className="w-1/12 px-2 py-2.5 text-center">
                        <span className="text-[11px] font-bold text-slate-500">
                          {i + 1}
                        </span>
                      </TableCell>
                      <TableCell className="w-1/4 px-4 py-2.5">
                        <span className="text-[13px] font-bold text-slate-700 block truncate">
                          {log.name || log.email || `User ${log.user_id}`}
                        </span>
                        {log.name && log.email && (
                          <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5">
                            {log.email}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="w-1/6 px-4 py-2.5 text-left">
                        <Badge
                          className={cn(
                            "px-2 py-0 h-5 text-[9px] font-black uppercase rounded-md",
                            log.status === "sent" || log.status === "success"
                              ? "bg-emerald-100 text-emerald-600"
                              : log.status === "failed"
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-4/12 px-4 py-2.5">
                        <span
                          className={cn(
                            "text-[11px] font-medium block max-w-sm line-clamp-2",
                            log.status === "failed"
                              ? "text-red-500 font-bold"
                              : "text-slate-400",
                          )}
                        >
                          {log.status === "failed"
                            ? formatError(log.error || log.failure_reason)
                            : "Delivered Successfully"}
                        </span>
                      </TableCell>
                      <TableCell className="w-1/6 px-4 py-2.5 text-center">
                        <span className="text-[11px] font-medium text-slate-400">
                          {log.createdAt || log.created_at
                            ? new Date(
                                log.createdAt || log.created_at,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-2">
              <History size={48} className="text-slate-200" />
              <p className="text-sm font-bold text-slate-400">
                No logs found for this campaign.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-slate-200 bg-white text-slate-400 hover:text-white hover:bg-brand-aqua text-xs font-medium px-6 h-9 rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
