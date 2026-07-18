import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  DollarSign,
  Receipt,
  Calculator,
  Download,
  Loader2,
} from "lucide-react";
import { DataTable } from "@/components/shared/datatable";
import StatsGrid from "@/components/common/stats.grid";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { colorMap, bgMap } from "@/constants/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransactionColumns } from "./transaction.columns";
import {
  fetchTransactions,
  exportTransactions,
} from "../../../store/subscription-dashboard.slice";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { downloadCsvBlob } from "../../../utils/downloadCsvBlob";

// Only "success" is confirmed in the API docs — extend this list once backend
// confirms the full enum (e.g. failed/pending).
const STATUS_OPTIONS = ["All", "success"];

export default function TransactionsView() {
  const dispatch = useDispatch();
  const {
    transactions,
    transactionsSummary,
    transactionsPagination,
    transactionsLoading,
    transactionsError,
    exportLoading,
  } = useSelector((state) => state.subscriptionDashboard);
  const { plans } = useSelector((state) => state.subscriptionManagement);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    if (!plans?.length) dispatch(fetchSubscriptionPlans({ limit: 100 }));
  }, [dispatch, plans]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch,
      status: statusFilter === "All" ? "" : statusFilter,
      plan_id: planFilter === "all" ? "" : planFilter,
    }),
    [pagination, debouncedSearch, statusFilter, planFilter],
  );

  useEffect(() => {
    dispatch(fetchTransactions(fetchParams));
  }, [dispatch, fetchParams]);

  const handleExport = async () => {
    const { page, limit, ...exportParams } = fetchParams;
    const result = await dispatch(exportTransactions(exportParams));
    if (exportTransactions.fulfilled.match(result)) {
      downloadCsvBlob(
        result.payload,
        `transactions_${new Date().toISOString().split("T")[0]}.csv`,
      );
      toast.success("CSV exported successfully");
    } else {
      toast.error("Failed to export transactions");
    }
  };

  const avgTransactionValue =
    transactionsSummary.totalTransactions > 0
      ? transactionsSummary.grossRevenue / transactionsSummary.totalTransactions
      : 0;

  const stats = useMemo(
    () => [
      {
        label: "Gross Revenue",
        val: `$${Number(transactionsSummary.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <DollarSign size={22} />,
        color: "blue",
        description: "All-time, unfiltered",
      },
      {
        label: "Total Transactions",
        val: transactionsSummary.totalTransactions || 0,
        icon: <Receipt size={22} />,
        color: "emerald",
        description: "All-time, unfiltered",
      },
      {
        label: "Avg. Transaction",
        val: `$${avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <Calculator size={22} />,
        color: "aqua",
        description: "Gross revenue / transactions",
      },
    ],
    [transactionsSummary, avgTransactionValue],
  );

  const columns = useMemo(() => getTransactionColumns(), []);

  const isFirstLoad = transactionsLoading && transactionsPagination === null;

  if (transactionsError && !transactionsPagination) {
    return (
      <ErrorState
        error="We couldn't load transactions."
        fetchVisitorData={() => dispatch(fetchTransactions(fetchParams))}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isFirstLoad ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-xl" />
          ))
        ) : (
          <StatsGrid stats={stats} colorMap={colorMap} bgMap={bgMap} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        rowCount={transactionsPagination?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={search}
        setGlobalFilter={setSearch}
        searchPlaceholder="Search by email..."
        itemName="transactions"
        isLoading={transactionsLoading}
        manualPagination
        manualFiltering
        toolbarChildren={
          <>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-9 3xl:h-10 w-[130px] bg-white border-slate-300/60 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={planFilter}
              onValueChange={(v) => {
                setPlanFilter(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-9 3xl:h-10 w-[150px] bg-white border-slate-300/60 text-xs font-medium">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Plans
                </SelectItem>
                {plans?.map((plan) => (
                  <SelectItem
                    key={plan.id}
                    value={String(plan.id)}
                    className="text-xs"
                  >
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={exportLoading}
              className="h-9 3xl:h-10 border-slate-300/60 bg-slate-50 hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white transition-all active:scale-95"
            >
              {exportLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              Export CSV
            </Button>
          </>
        }
      />
    </div>
  );
}
