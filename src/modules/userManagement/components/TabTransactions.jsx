import React from "react";
import {
  CreditCard,
  Loader2,
  FileText,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Pill, EmptyState } from "./UserProfileShared";
import DashboardHead from "@/components/shared/dashboard.head";
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
            valClass: "text-slate-900 text-lg",
          },
          {
            label: "Total Spent",
            value: formatCurrency(summary.totalSpent),
            icon: FileText,
            valClass: "text-emerald-600 text-lg",
          },
          {
            label: "First Purchase",
            value: formatDate(summary.firstPurchaseAt),
            icon: Calendar,
            valClass: "text-slate-800 text-base",
          },
          {
            label: "Last Transaction",
            value: formatDate(summary.lastTransactionAt),
            icon: Clock,
            valClass: "text-slate-800 text-base",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-start gap-4 transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 shadow-sm">
              <item.icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {item.label}
              </span>
              <div className={cn("font-black tracking-tight", item.valClass)}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/50">
          <DashboardHead
            title="Payment Records"
            subtitle="Transaction history and invoices"
            Icon={FileText}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
          <Select
            value={status}
            onValueChange={(val) => onTransactionsStatusChange(val)}
          >
            <SelectTrigger className="h-10 w-32 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-app-primary2/20 transition-all hover:bg-slate-50">
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
        </div>
        <div className="p-0 bg-white">
          {isLoading ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-app-primary2" />
              <span className="text-xs font-medium">
                Loading transactions...
              </span>
            </div>
          ) : transactions.length > 0 ? (
            <div className="flex flex-col w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="h-11 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        SR.No
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Transaction ID
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Date
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Plan
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Amount
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Status
                      </th>
                      <th className="h-11 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx, idx) => (
                      <tr
                        key={tx.id}
                        className="transition-colors hover:bg-slate-50/50 even:bg-slate-50/30"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-slate-500">
                          {((page || 1) - 1) * 10 + idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold text-slate-900">
                          {tx.transaction_id || "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[11px] font-medium text-slate-600">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-5 py-4">
                          {(() => {
                            const title = tx.plan_title;
                            if (!title)
                              return (
                                <span className="text-[11px] font-bold text-slate-700">
                                  —
                                </span>
                              );

                            const lower = title.toLowerCase();
                            let colorClass = "text-slate-600";

                            if (lower.includes("premium"))
                              colorClass = "text-app-primary2";
                            else if (
                              lower.includes("basic") ||
                              lower.includes("starter")
                            )
                              colorClass = "text-app-primary3";

                            return (
                              <div
                                className={`font-bold text-[10px] 3xl:text-[11px] uppercase tracking-wider whitespace-nowrap ${colorClass}`}
                              >
                                {title}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[12px] font-black text-slate-900">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Pill tone={getStatusTone(tx.status)}>
                            {tx.status}
                          </Pill>
                          {tx.refund_reason && (
                            <div className="mt-1 text-[10px] text-slate-400">
                              {tx.refund_reason}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {tx.invoice_url ? (
                            <a
                              href={tx.invoice_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wide text-app-primary2 bg-app-primary2/10 hover:bg-app-primary2 hover:text-white px-3 py-1.5 rounded-md transition-all uppercase"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              View
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onTransactionsPageChange(Math.max(1, page - 1))
                      }
                      disabled={page === 1}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 shadow-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        onTransactionsPageChange(Math.min(totalPages, page + 1))
                      }
                      disabled={page === totalPages}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 shadow-sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 pb-12">
              <EmptyState
                icon={CreditCard}
                title="No transactions found"
                subtitle="This user hasn't made any transactions yet."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
