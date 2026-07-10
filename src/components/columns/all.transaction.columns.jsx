import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Hash, User, Smartphone } from "lucide-react";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";

export const transactionColumns = [
  {
    accessorKey: "userId",
    header: () => (
      <div className="flex items-center gap-2">
        <User className="w-3 h-3" /> Customer
      </div>
    ),
    cell: ({ row }) => {
      const user = row.getValue("userId");
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-bold">
              {user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-foreground/90 leading-none mb-1">
              {user?.email}
            </span>
            <span className="text-[10px] text-foreground/70">
              {user?.phone || "No phone linked"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionId",
    header: () => (
      <div className="w-max flex items-center gap-1">
        <Hash className="w-3 h-3" /> Transaction ID
      </div>
    ),
    cell: ({ row }) => (
      // <span className="font-mono text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
      //   {row.getValue("transactionId").slice(0, 12) || "-"}...
      // </span>
      <div className="flex items-center gap-2 group">
        <span className="font-mono text-[11px] text-foreground/70 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 group-hover:text-brand-aqua group-hover:border-brand-aqua/30 transition-colors">
          {row.getValue("transactionId")
            ? `${row.getValue("transactionId").slice(0, 12)}...`
            : "-"}
        </span>

        {/* Optional: Hover par copy button ya full ID ka indicator */}
        {row.getValue("transactionId") && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                navigator.clipboard.writeText(row.getValue("transactionId"))
              }
              className="text-[10px] text-blue-500 hover:underline font-bold uppercase tracking-tighter"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "platform",
    header: () => (
      <div className="flex items-center gap-2">
        <Smartphone className="w-3 h-3" /> Platform
      </div>
    ),
    cell: ({ row }) => {
      const platform = row.getValue("platform");
      return platform === "ios" ? (
        <Badge
          variant="outline"
          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-slate-500/10 text-slate-600 w-fit"
        >
          <AiFillApple className="w-3 h-3" />
          IOS
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 w-fit"
        >
          <AiFillAndroid className="w-3 h-3" />
          Android
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);

      return (
        <div className="text-[11px] font-bold text-foreground/90">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "eventType",
    header: () => <div className="w-max">Status / Event</div>,
    cell: ({ row }) => {
      const type = row.getValue("eventType");
      return (
        <Badge
          variant="outline"
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 ${
            type === "PURCHASE"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-blue-500/10 text-blue-600"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "occurredAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("occurredAt"));
      return (
        <div className="flex flex-col min-w-24">
          <span className="text-[11px] font-medium text-foreground/90">
            {format(date, "dd MMM, yyyy")}
          </span>
          <span className="text-[10px] text-foreground/70 uppercase">
            {format(date, "EEEE")}
          </span>
        </div>
      );
    },
  },
];
