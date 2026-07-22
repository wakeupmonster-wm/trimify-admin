import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stripHtml = (html) => {
  if (!html) return "";
  return html.toString().replace(/<[^>]*>?/gm, "");
};

export const getNotificationColumns = ({
  statusFilter,
  handleViewLogs,
} = {}) => [
  {
    id: "sno",
    header: () => (
      <div className="w-16 text-center text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 60,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-16 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Date Sent
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const dateValue = row.original.createdAt || row.original.created_at;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-[11px]">-</span>;
      }
      return (
        <div className="text-[11px] font-bold text-slate-900 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "channel",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Channel
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const channel = row.original.channel || "Push";
      return (
        <Badge
          className={cn(
            "px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border-transparent",
            channel.toLowerCase() === "email"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-brand-aqua/10 text-brand-aqua",
          )}
        >
          {channel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "campaignName",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Campaign Details
      </div>
    ),
    size: 250,
    minSize: 200,
    cell: ({ row }) => {
      const campaignName =
        row.original.campaignName ||
        row.original.campaign_name ||
        row.original.title ||
        "General Campaign";
      const rawSubtitle =
        row.original.message || row.original.title || "No description";
      const subtitle = stripHtml(rawSubtitle);
      return (
        <div className="flex flex-col max-w-xs whitespace-nowrap">
          <span
            className="text-[13px] font-bold text-slate-800 truncate"
            title={campaignName}
          >
            {campaignName}
          </span>
          <span
            className="text-[11px] font-medium text-slate-500 line-clamp-1"
            title={subtitle}
          >
            {subtitle}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "target",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Audience
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const target =
        row.original.target_audience || row.original.target || "Community";
      return (
        <div className="text-[12px] font-bold text-slate-600 capitalize whitespace-nowrap">
          {target}
        </div>
      );
    },
  },
  {
    accessorKey: "metrics",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Metrics
      </div>
    ),
    size: 200,
    minSize: 150,
    cell: ({ row }) => {
      const sentCount = row.original.sentCount || row.original.sent_count || 0;
      const failedCount =
        row.original.failedCount || row.original.failed_count || 0;

      return (
        <div className="flex items-center gap-3">
          {(statusFilter === "all" || statusFilter === "delivered") && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Sent
              </span>
              <span className="text-[13px] font-black text-emerald-600">
                {sentCount}
              </span>
            </div>
          )}
          {statusFilter === "all" && (
            <div className="w-[1px] h-6 bg-slate-200" />
          )}
          {(statusFilter === "all" || statusFilter === "failed") && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Failed
              </span>
              <span className="text-[13px] font-black text-red-500">
                {failedCount}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Status
      </div>
    ),
    size: 120,
    minSize: 120,
    cell: ({ row }) => {
      const status = row.original.status || "Pending";
      return (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              status.toLowerCase() === "completed"
                ? "bg-brand-aqua shadow-[0_0_8px_rgba(20,184,166,0.4)]"
                : "bg-amber-400",
            )}
          />
          <span
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider",
              status.toLowerCase() === "completed"
                ? "text-brand-aqua"
                : "text-amber-600",
            )}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "logs",
    header: () => (
      <div className="w-20 text-center text-[10px] font-bold uppercase tracking-wider">
        Logs
      </div>
    ),
    size: 80,
    minSize: 80,
    cell: ({ row }) => {
      const item = row.original;
      const channel = item.channel || "Push";
      return (
        <div className="w-20 text-center">
          <Button
            variant="outline"
            size="sm"
            disabled={item.status?.toLowerCase() !== "completed"}
            className="h-7 px-2 text-[10px] font-bold uppercase border-slate-200 hover:bg-brand-aqua hover:text-white hover:border-brand-aqua transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-900 disabled:hover:border-slate-200"
            onClick={() => handleViewLogs && handleViewLogs(channel.toLowerCase(), item)}
          >
            Logs
          </Button>
        </div>
      );
    },
  },
];
