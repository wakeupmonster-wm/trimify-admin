import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  DollarSign,
  Receipt,
  Calculator,
  Download,
  Loader2,
} from "lucide-react";
import { DataTable, DataTableFilters, DataTableActiveChips } from "@/components/shared/datatable";
import StatsGrid from "@/components/common/stats.grid";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { colorMap, bgMap } from "@/constants/colors";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { subDays, startOfDay, endOfDay, format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransactionColumns } from "./transaction.columns";
import RevokeTransactionDialog from "./RevokeTransactionDialog";
import {
  fetchTransactions,
  exportTransactions,
  revokeTransaction,
} from "../../../store/subscription-dashboard.slice";
import { getTransactionsAPI } from "../../../services/subscription-dashboard.services";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { downloadCsvBlob } from "../../../utils/downloadCsvBlob";

const STATUS_OPTIONS = ["success", "failed", "pending", "refunded", "disputed"];

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

  const location = useLocation();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(location.state?.filterId || "");
  const [planFilter, setPlanFilter] = useState("");

  const [revokeTransactionData, setRevokeTransactionData] = useState(null);

  // Date range — initialise from navigation state if the user clicked a
  // date-scoped KPI on the subscription dashboard, otherwise null (= all time).
  const [dateRange, setDateRange] = useState(() => {
    const nav = location.state?.dateRange;
    if (nav?.from && nav?.to) {
      return {
        from: parseISO(nav.from),
        to: endOfDay(parseISO(nav.to)),
      };
    }
    return null; // null = no date filter (all time)
  });

  const isUnfiltered = !statusFilter && !planFilter && !debouncedSearch && !dateRange;
  const [pinnedSummary, setPinnedSummary] = useState(null);

  useEffect(() => {
    // If we arrived with a filter, background fetch the true unfiltered stats
    if (!isUnfiltered && !pinnedSummary) {
      getTransactionsAPI({ limit: 1 }).then((res) => {
        if (res && res.success) {
          setPinnedSummary({
            grossRevenue: res.data.grossRevenue || 0,
            totalTransactions: res.data.totalTransactions || 0,
          });
        }
      }).catch(() => {});
    }
  }, [isUnfiltered, pinnedSummary]);

  // Capture unfiltered when the main list loads unfiltered
  useEffect(() => {
    if (isUnfiltered && transactionsSummary.totalTransactions > 0 && !pinnedSummary) {
      setPinnedSummary({ ...transactionsSummary });
    }
  }, [isUnfiltered, transactionsSummary, pinnedSummary]);

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
      status: statusFilter,
      plan_id: planFilter,
      ...(dateRange ? { from: format(dateRange.from, "yyyy-MM-dd"), to: format(dateRange.to, "yyyy-MM-dd") } : {}),
    }),
    [pagination, debouncedSearch, statusFilter, planFilter, dateRange],
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

  const kpiSummary = pinnedSummary || transactionsSummary || { grossRevenue: 0, totalTransactions: 0 };

  const avgTransactionValue =
    kpiSummary.totalTransactions > 0
      ? kpiSummary.grossRevenue / kpiSummary.totalTransactions
      : 0;

  const stats = useMemo(
    () => [
      {
        label: "Gross Revenue",
        val: `$${Number(kpiSummary.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <DollarSign size={22} />,
        color: "blue",
        description: "Tap to clear filters",
        onClick: () => {
          setStatusFilter("");
          setPlanFilter("");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "" && planFilter === "",
      },
      {
        label: "Total Transactions",
        val: kpiSummary.totalTransactions || 0,
        icon: <Receipt size={22} />,
        color: "emerald",
        description: "Tap to clear filters",
        onClick: () => {
          setStatusFilter("");
          setPlanFilter("");
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        },
        isSelected: statusFilter === "" && planFilter === "",
      },
      {
        label: "Avg. Transaction",
        val: `$${avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <Calculator size={22} />,
        color: "aqua",
        description: "Gross revenue / transactions",
      },
    ],
    [kpiSummary, avgTransactionValue, statusFilter],
  );

  const handleAction = (txn, action) => {
    if (action === "revoke") {
      setRevokeTransactionData(txn);
    }
  };

  const handleRevokeConfirm = async (data) => {
    if (!revokeTransactionData) return;
    const result = await dispatch(revokeTransaction({ 
      id: revokeTransactionData.id, 
      ...data 
    }));

    if (revokeTransaction.fulfilled.match(result)) {
      setRevokeTransactionData(null);
      toast.loading("Processing refund...", { id: "refund-toast" });
      
      // Wait for 4 seconds to allow webhook to process before refreshing
      setTimeout(() => {
        dispatch(fetchTransactions(fetchParams)).then((refetched) => {
          toast.success("Transaction refunded successfully", { id: "refund-toast" });
          if (fetchTransactions.fulfilled.match(refetched)) {
            setPinnedSummary({
              grossRevenue: refetched.payload.grossRevenue || 0,
              totalTransactions: refetched.payload.totalTransactions || 0,
            });
          }
        });
      }, 4000);
    } else {
      const payload = result.payload;
      const message = payload?.message || "Failed to refund transaction";
      toast.error(message);
    }
  };

  const columns = useMemo(() => getTransactionColumns(handleAction), [handleAction]);

  const isFirstLoad = transactionsLoading && transactionsPagination === null;

  const filterConfig = [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: STATUS_OPTIONS.map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
      placeholder: "All Status",
    },
    {
      type: "select",
      id: "planFilter",
      label: "Plan",
      value: planFilter,
      onChange: (v) => {
        setPlanFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: plans?.map((plan) => ({ label: plan.title, value: String(plan.id) })) || [],
      placeholder: "All Plans",
    },
  ];

  // Formatted label for the date range chip
  const dateRangeLabel = dateRange
    ? `${format(dateRange.from, "MMM dd, yyyy")} – ${format(dateRange.to, "MMM dd, yyyy")}`
    : "";

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
            <DataTableFilters filterConfig={filterConfig} />
            <CalendarDateRangePicker
              value={dateRange}
              onDateChange={setDateRange}
              className="h-9 3xl:h-10"
              compact
            />
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
        activeFiltersChildren={
          <DataTableActiveChips
            filterConfig={[
              ...filterConfig,
              ...(dateRange ? [{ id: "dateRange", label: "Date Range", value: dateRangeLabel, onChange: () => {} }] : []),
            ]}
            onClearAll={() => {
              setStatusFilter("");
              setPlanFilter("");
              setDateRange(null);
            }}
          />
        }
      />

      <RevokeTransactionDialog
        open={!!revokeTransactionData}
        onOpenChange={(open) => !open && setRevokeTransactionData(null)}
        transaction={revokeTransactionData}
        onConfirm={handleRevokeConfirm}
        loading={transactionsLoading} // Or specific revoke loading state if added
      />
    </div>
  );
}
