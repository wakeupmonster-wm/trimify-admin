import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ChartCard from "./ChartCard";

export default function RecentTransactionsCard({ transactions = [] }) {
  return (
    <ChartCard
      title="Recent Transactions"
      subtitle="Last 24 hours"
      icon={Receipt}
      isEmpty={!transactions.length}
      emptyMessage="No transactions in the last 24 hours"
    >
      <div className="space-y-1.5 overflow-y-auto max-h-[280px] pr-1">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-slate-100/70 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{txn.user_name}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {txn.plan_title} &middot; {formatDistanceToNow(new Date(txn.created_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs font-black text-slate-900">
                ${Number(txn.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <Badge
                className={cn(
                  "text-[9px] font-black uppercase border-none shadow-none rounded-full px-2 py-0",
                  txn.status === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {txn.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
