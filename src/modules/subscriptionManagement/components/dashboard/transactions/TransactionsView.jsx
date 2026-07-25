import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { DollarSign, Receipt, Calculator } from "lucide-react";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import ErrorState from "@/components/shared/ErrorState";
import { useLocation, useNavigate } from "react-router-dom";
import { endOfDay, format, parseISO } from "date-fns";
import { getTransactionColumns } from "./transaction.columns";
import RevokeTransactionDialog from "./RevokeTransactionDialog";
import ExportLoadingModal from "@/components/shared/ExportLoadingModal";
import {
  fetchTransactions,
  exportTransactions,
  revokeTransaction,
} from "../../../store/subscription-dashboard.slice";
import { getTransactionsAPI } from "../../../services/subscription-dashboard.services";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { downloadCsvBlob } from "../../../utils/downloadCsvBlob";

const STATUS_OPTIONS = ["success", "failed", "pending", "refunded", "disputed"];

export default function TransactionsView({ exportRef, onExportLoadingChange }) {
  const dispatch = useDispatch();
  const {
    transactions,
    transactionsSummary,
    transactionsPagination,
    transactionsLoading,
    transactionsError,
  } = useSelector((state) => state.subscriptionDashboard);
  const { plans } = useSelector((state) => state.subscriptionManagement);

  const location = useLocation();
  const navigate = useNavigate();

  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    location.state?.filterId || "",
  );
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

  const isUnfiltered =
    !statusFilter && !planFilter && !debouncedSearch && !dateRange;
  const [pinnedSummary, setPinnedSummary] = useState(null);

  useEffect(() => {
    // If we arrived with a filter, background fetch the true unfiltered stats
    if (!isUnfiltered && !pinnedSummary) {
      getTransactionsAPI({ limit: 1 })
        .then((res) => {
          if (res && res.success) {
            setPinnedSummary({
              grossRevenue: res.data.grossRevenue || 0,
              totalTransactions: res.data.totalTransactions || 0,
            });
          }
        })
        .catch(() => {});
    }
  }, [isUnfiltered, pinnedSummary]);

  // Capture unfiltered when the main list loads unfiltered
  useEffect(() => {
    if (
      isUnfiltered &&
      transactionsSummary.totalTransactions > 0 &&
      !pinnedSummary
    ) {
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
      ...(dateRange
        ? {
            from: format(dateRange.from, "yyyy-MM-dd"),
            to: format(dateRange.to, "yyyy-MM-dd"),
          }
        : {}),
    }),
    [pagination, debouncedSearch, statusFilter, planFilter, dateRange],
  );

  useEffect(() => {
    dispatch(fetchTransactions(fetchParams));
  }, [dispatch, fetchParams]);

  const handleExport = async () => {
    setExportLoading(true);
    if (onExportLoadingChange) onExportLoadingChange(true);
    setExportProgress(0);

    let currentStep = 0;
    const intervalTime = 50;
    const maxFakeProgress = 90;
    const steps = 1500 / intervalTime;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(
        Math.round((currentStep / steps) * maxFakeProgress),
        maxFakeProgress,
      );
      setExportProgress(progress);
    }, intervalTime);

    const { page, limit, ...exportParams } = fetchParams;
    const result = await dispatch(exportTransactions(exportParams));

    clearInterval(interval);

    if (exportTransactions.fulfilled.match(result)) {
      setExportProgress(100);
      setTimeout(() => {
        downloadCsvBlob(
          result.payload,
          `transactions_${new Date().toISOString().split("T")[0]}.csv`,
        );
        setTimeout(() => {
          setExportLoading(false);
          if (onExportLoadingChange) onExportLoadingChange(false);
          setExportProgress(0);
        }, 2000);
      }, 500);
    } else {
      setExportLoading(false);
      if (onExportLoadingChange) onExportLoadingChange(false);
      setExportProgress(0);
      toast.error("Failed to export transactions");
    }
  };

  useEffect(() => {
    if (exportRef) {
      exportRef.current = handleExport;
    }
  }, [exportRef, handleExport]);

  const kpiSummary = pinnedSummary ||
    transactionsSummary || { grossRevenue: 0, totalTransactions: 0 };

  const avgTransactionValue =
    kpiSummary.totalTransactions > 0
      ? kpiSummary.grossRevenue / kpiSummary.totalTransactions
      : 0;

  const kpiItems = useMemo(
    () => [
      {
        label: "Gross Revenue",
        value: `$${Number(kpiSummary.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
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
        value: kpiSummary.totalTransactions || 0,
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
      // {
      //   label: "Basic Plan",
      //   value: transactionsSummary.basic || 0,
      //   icon: Star,
      //   tone: "slate",
      //   description: "Standard tier",
      // },
      // {
      //   label: "Premium Plan",
      //   value: transactionsSummary.premium || 0,
      //   icon: Crown,
      //   tone: "amber",
      //   description: "Pro tier",
      // },
      {
        label: "Avg. Transaction",
        value: `$${avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: Calculator,
        tone: "aqua",
        description: "Gross revenue / transactions",
      },
    ],
    [kpiSummary, avgTransactionValue, statusFilter],
  );

  const goToUserTransactions = (txn) => {
    const userId =
      txn?.user_id || txn?.userId || txn?.user?.id || txn?.user?.user_id;
    if (!userId) {
      console.warn("Transaction is missing a linkable user id:", txn);
      toast.error("Couldn't open this user's profile — no user ID on this transaction.");
      return;
    }
    navigate(`/admin/users/view-user/${userId}`, {
      state: { userData: txn.user, initialTab: "transactions" },
    });
  };

  const handleAction = (txn, action) => {
    if (action === "revoke") {
      setRevokeTransactionData(txn);
    } else if (action === "view") {
      goToUserTransactions(txn);
    }
  };

  const handleRevokeConfirm = async (data) => {
    if (!revokeTransactionData) return;
    const result = await dispatch(
      revokeTransaction({
        id: revokeTransactionData.id,
        ...data,
      }),
    );

    if (revokeTransaction.fulfilled.match(result)) {
      setRevokeTransactionData(null);
      toast.loading("Processing refund...", { id: "refund-toast" });

      // Wait for 4 seconds to allow webhook to process before refreshing
      setTimeout(() => {
        dispatch(fetchTransactions(fetchParams)).then((refetched) => {
          toast.success("Transaction refunded successfully", {
            id: "refund-toast",
          });
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

  const columns = useMemo(
    () => getTransactionColumns(handleAction),
    [handleAction],
  );

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
      options:
        plans?.map((plan) => ({ label: plan.title, value: String(plan.id) })) ||
        [],
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
      <ModuleKpiRow items={kpiItems} loading={isFirstLoad} />

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
        onRowClick={(row) => goToUserTransactions(row.original)}
        toolbarChildren={
          <>
            <DataTableFilters filterConfig={filterConfig} />
          </>
        }
        activeFiltersChildren={
          <DataTableActiveChips
            filterConfig={[
              ...filterConfig,
              // ...(dateRange ? [{ id: "dateRange", label: "Date Range", value: dateRangeLabel, onChange: () => {} }] : []),
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

      <ExportLoadingModal
        exportLoading={exportLoading}
        exportProgress={exportProgress}
        setExportLoading={setExportLoading}
        setExportProgress={setExportProgress}
      />
    </div>
  );
}
