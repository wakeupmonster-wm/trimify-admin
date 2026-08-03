import React from "react";
import {
  CreditCard,
  Loader2,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, Pill, EmptyState } from "./UserProfileView";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function TabTransactions({ data }) {
  const {
    transactionsState,
    onTransactionsPageChange,
    onTransactionsStatusChange,
  } = data;
  const { loading, loaded, transactions, summary, page, totalPages, status } =
    transactionsState;
  const isLoading = loading || !loaded;

  const getStatusTone = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "success";
      case "failed":
      case "disputed":
        return "danger";
      case "pending":
      case "refunded":
        return "warning";
      default:
        return "neutral";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
    } catch (e) {
      return "—";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "—";
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Transactions",
            value: summary.totalTransactions || 0,
            icon: CreditCard,
            valClass: "text-slate-900 text-xl",
          },
          {
            label: "Total Spent",
            value: formatCurrency(summary.totalSpent),
            icon: FileText,
            valClass: "text-emerald-600 text-xl",
          },
          {
            label: "First Purchase",
            value: formatDate(summary.firstPurchaseAt),
            icon: Calendar,
            valClass: "text-slate-800 text-lg",
          },
          {
            label: "Last Transaction",
            value: formatDate(summary.lastTransactionAt),
            icon: Clock,
            valClass: "text-slate-800 text-lg",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm flex items-start gap-3 transition-all hover:border-slate-300 hover:shadow-md"
          >
            <item.icon className="h-10 w-10 text-slate-500 bg-slate-100 rounded-xl p-2" />
            <div className="flex flex-col items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </span>
              <div
                className={cn(
                  "font-black tabular-nums tracking-tight",
                  item.valClass,
                )}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions List */}
      <Card
        title="Transaction History"
        subtitle="All payments and refunds"
        right={
          <Select
            value={status}
            onValueChange={(val) => onTransactionsStatusChange(val)}
          >
            <SelectTrigger className="h-9 w-30 rounded-md border border-slate-300/60 bg-white text-xs font-medium text-slate-600 focus:ring-1 focus:ring-app-primary2 transition-all hover:bg-slate-50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {isLoading ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-app-primary2" />
            <span className="text-xs font-medium">Loading transactions...</span>
          </div>
        ) : transactions.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-y border-slate-300/60 bg-app-primary2/5">
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      SR.No
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Transaction ID
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Date
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Plan
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Amount
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Status
                    </th>
                    <th className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-[12px] font-medium text-slate-500">
                        {((page || 1) - 1) * 10 + idx + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] font-medium text-slate-900">
                        {tx.transaction_id || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px]">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-medium">
                        {tx.plan_title || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Pill tone={getStatusTone(tx.status)}>{tx.status}</Pill>
                        {tx.refund_reason && (
                          <div className="mt-1 text-[10px] text-slate-400">
                            {tx.refund_reason}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {tx.invoice_url ? (
                          <a
                            href={tx.invoice_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-app-primary2 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onTransactionsPageChange(Math.max(1, page - 1))
                    }
                    disabled={page === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300/60 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      onTransactionsPageChange(Math.min(totalPages, page + 1))
                    }
                    disabled={page === totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300/60 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No transactions found"
            subtitle="This user hasn't made any transactions yet."
          />
        )}
      </Card>
    </div>
  );
}
