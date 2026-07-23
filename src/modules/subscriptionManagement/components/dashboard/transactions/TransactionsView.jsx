import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  DollarSign,
  Receipt,
  Calculator,
  Download,
  Loader2,
  Star,
  Crown,
} from "lucide-react";
import {
  DataTable,
  DataTableFilters,
  DataTableActiveChips,
} from "@/components/shared/datatable";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { getTransactionColumns } from "./transaction.columns";
import {
  fetchTransactions,
  exportTransactions,
} from "../../../store/subscription-dashboard.slice";
import { fetchSubscriptionPlans } from "../../../store/subscription.slice";
import { downloadCsvBlob } from "../../../utils/downloadCsvBlob";

// Only "success" is confirmed in the API docs — extend this list once backend
// confirms the full enum (e.g. failed/pending).
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
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

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

  const kpiItems = useMemo(
    () => [
      {
        label: "Gross Revenue",
        value: `$${Number(transactionsSummary.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: DollarSign,
        tone: "blue",
        description: "All-time, unfiltered",
      },
      {
        label: "Total Transactions",
        value: transactionsSummary.totalTransactions || 0,
        icon: Receipt,
        tone: "emerald",
        description: "All-time, unfiltered",
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
    [transactionsSummary, avgTransactionValue],
  );

  const filterConfig = useMemo(() => [
    {
      type: "select",
      id: "statusFilter",
      label: "Status",
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
      options: [
        { label: "Success", value: "success" },
      ],
      placeholder: "All Statuses",
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
      options: plans?.map((p) => ({ label: p.title, value: String(p.id) })) || [],
      placeholder: "All Plans",
    },
  ], [statusFilter, planFilter, plans]);

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
        toolbarChildren={
          <>
            <DataTableFilters filterConfig={filterConfig} />
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={exportLoading}
              className="h-9 3xl:h-10 border-slate-300/60 bg-slate-50 hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white text-xs font-medium transition-all active:scale-95"
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
            filterConfig={filterConfig}
            onClearAll={() => {
              setStatusFilter("");
              setPlanFilter("");
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
        }
      />
    </div>
  );
}
