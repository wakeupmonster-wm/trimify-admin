import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const getTransactionManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[11px] font-bold text-foreground">
        SR.No
      </div>
    ),
    size: 60,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-10 text-left font-medium text-[11px] text-slate-700">
          {serialNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "transaction_id",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Transaction Id
      </div>
    ),
    size: 200,
    minSize: 200,
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate text-[11px] font-medium text-slate-700 tracking-tight"
        title={row.getValue("transaction_id")}
      >
        {row.getValue("transaction_id") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Amount Paid
      </div>
    ),
    size: 130,
    minSize: 130,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700">
        {row.getValue("amount") ? `$${row.getValue("amount")}` : "-"}
      </span>
    ),
  },
  {
    id: "subscriptionPlan",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Subscription Plan
      </div>
    ),
    size: 160,
    minSize: 160,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700">
        {row.original.plan?.title || "-"}
      </span>
    ),
  },
  {
    id: "userName",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        User Name
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700">
        {row.original.user?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Created At
      </div>
    ),
    size: 120,
    minSize: 120,
    cell: ({ row }) => {
      // Optional: Format date here using date-fns if desired
      const rawDate = row.getValue("created_at");
      const displayDate = rawDate
        ? new Date(rawDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-";
      return (
        <span className="text-[11px] font-medium text-slate-700">
          {displayDate}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-center">
        Status
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") || "Success";
      const isSuccess = status.toLowerCase() === "success";
      return (
        <div className="flex justify-center">
          <Badge
            className={`${isSuccess ? "bg-[#1ea82c] hover:bg-[#1ea82c]/90" : "bg-red-500 hover:bg-red-600"} text-white rounded text-[10px] px-2 py-0.5 font-semibold shadow-none border-none pointer-events-none capitalize`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "invoice",
    header: () => (
      <div className="text-center text-[11px] font-bold text-foreground">
        Invoice
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="h-7 px-3 bg-brand-blue hover:bg-brand-hoverBlue text-white rounded text-[10px] font-semibold shadow-none border-none flex items-center gap-1.5"
          onClick={() => onAction && onAction(row.original, "download-invoice")}
        >
          <Download className="w-3 h-3" />
          Download
        </Button>
      </div>
    ),
  },
];
