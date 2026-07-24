import React, { useEffect, useState } from "react";
import { CreditCard, Loader2, Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Pill, KV, EmptyState } from "./UserProfileView";
import { getUserTransactionsAPI } from "../services/user.services";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TabTransactions({ data }) {
  const { user } = data;
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("all");

  const fetchTransactions = async (currentPage, currentStatus) => {
    try {
      setLoading(true);
      const params = { page: currentPage };
      if (currentStatus !== "all") {
        params.status = currentStatus;
      }
      const response = await getUserTransactionsAPI(user.id, params);
      if (response?.success) {
        setTransactions(response.data?.transactions || []);
        setSummary(response.data?.summary || {});
        setTotalPages(response.data?.pagination?.last_page || 1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page, status);
  }, [user.id, page, status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Total Transactions
          </div>
          <div className="text-xl font-black tabular-nums text-slate-900">
            {summary.totalTransactions || 0}
          </div>
        </div>
        <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Total Spent
          </div>
          <div className="text-xl font-black tabular-nums text-emerald-600">
            {formatCurrency(summary.totalSpent)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            First Purchase
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {formatDate(summary.firstPurchaseAt)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-300/60 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Last Transaction
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {formatDate(summary.lastTransactionAt)}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <Card
        title="Transaction History"
        subtitle="All payments and refunds"
        right={
          <select
            value={status}
            onChange={handleStatusChange}
            className="h-8 rounded-md border border-slate-300/60 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
          </select>
        }
      >
        {loading ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#007FC0]" />
            <span className="text-xs font-medium">Loading transactions...</span>
          </div>
        ) : transactions.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="transition-colors hover:bg-slate-50/50">
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
                        <Pill tone={getStatusTone(tx.status)}>
                          {tx.status}
                        </Pill>
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
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#007FC0] hover:underline"
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300/60 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
