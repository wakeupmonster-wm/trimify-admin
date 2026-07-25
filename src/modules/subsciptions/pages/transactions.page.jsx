/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/common/headSubhead";
import { Badge } from "@/components/ui/badge";
import { getProductDisplayName } from "@/utils/productDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Download,
  Loader2,
  X,
  CheckCircle2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  IconRefresh,
  IconSearch,
  IconX,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconReceipt,
  IconCurrencyDollar,
  IconArrowBackUp,
  IconReportMoney,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getTransactionsAPI,
  getTransactionSummaryAPI,
} from "../services/subscription.services";
import {
  exportTransactionsStream,
  setExportProgress,
} from "../store/subscription.slice";
import { useSelector, useDispatch } from "react-redux";

import { PreLoader } from "@/app/loader/preloader";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";
import {
  EVENT_TYPE_MAP,
  PLATFORM_MAP,
  STATUS_MAP,
} from "@/constants/transection.config";
import { bgMap, colorMap } from "@/constants/colors";
import { Container } from "@/components/common/container";
import { useNavigate } from "react-router-dom";
import { TbTransactionDollar } from "react-icons/tb";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { LiaUserTieSolid } from "react-icons/lia";
import { PiDevicesDuotone } from "react-icons/pi";
import { format } from "date-fns";
import { TableLoader } from "@/app/loader/table.loader";
import { FaUserTie } from "react-icons/fa6";

// ─── Animation variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function TransactionsPage() {
  // Data states
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { exportLoading, exportProgress } = useSelector(
    (state) => state.subscription,
  );

  // Filters
  const [search, setSearch] = useState(
    () => sessionStorage.getItem("transactionsManagementSearch") || "",
  );
  const [eventTypeFilter, setEventTypeFilter] = useState(
    () => sessionStorage.getItem("transactionsManagementEventType") || "",
  );
  const [itemTypeFilter, setItemTypeFilter] = useState(
    () => sessionStorage.getItem("transactionsManagementItemType") || "",
  );
  const [platformFilter, setPlatformFilter] = useState(
    () => sessionStorage.getItem("transactionsManagementPlatform") || "",
  );
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem("transactionsManagementPage");
    return saved ? Number(saved) : 1;
  });
  const [limit, setLimit] = useState(() => {
    const saved = sessionStorage.getItem("transactionsManagementLimit");
    return saved ? Number(saved) : 10;
  });
  const [sortBy, setSortBy] = useState(
    () =>
      sessionStorage.getItem("transactionsManagementSortBy") || "occurredAt",
  );
  const [sortOrder, setSortOrder] = useState(
    () => sessionStorage.getItem("transactionsManagementSortOrder") || "desc",
  );

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    sessionStorage.setItem("transactionsManagementSearch", search);
    sessionStorage.setItem("transactionsManagementEventType", eventTypeFilter);
    sessionStorage.setItem("transactionsManagementItemType", itemTypeFilter);
    sessionStorage.setItem("transactionsManagementPlatform", platformFilter);
    sessionStorage.setItem("transactionsManagementPage", String(page));
    sessionStorage.setItem("transactionsManagementLimit", String(limit));
    sessionStorage.setItem("transactionsManagementSortBy", sortBy);
    sessionStorage.setItem("transactionsManagementSortOrder", sortOrder);
  }, [
    search,
    eventTypeFilter,
    itemTypeFilter,
    platformFilter,
    page,
    limit,
    sortBy,
    sortOrder,
  ]);

  /* ───── Fetch Transactions ───── */
  const normalizePlatformFilter = (platform) => {
    if (!platform) return "";
    return platform === "admin_granted" ? "admin" : platform;
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, sortOrder };
      if (search) params.search = search;
      if (eventTypeFilter) params.eventType = eventTypeFilter;
      if (itemTypeFilter) params.itemType = itemTypeFilter;
      const apiPlatform = normalizePlatformFilter(platformFilter);
      if (apiPlatform) params.platform = apiPlatform;
      const res = await getTransactionsAPI(params);
      if (res?.success) {
        setTransactions(res.transactions || []);
        setPagination(res.pagination || {});
      }
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    eventTypeFilter,
    itemTypeFilter,
    platformFilter,
    page,
    limit,
    sortBy,
    sortOrder,
  ]);

  /* ───── Fetch Summary ───── */
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await getTransactionSummaryAPI();
      if (res?.success) setSummary(res.data);
    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchTransactions(), 400);
    return () => clearTimeout(delay);
  }, [fetchTransactions]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  /* ───── CSV Export ───── */
  const handleExport = async () => {
    try {
      const filters = {
        eventType: eventTypeFilter,
        itemType: itemTypeFilter,
        platform: normalizePlatformFilter(platformFilter),
      };

      const resultAction = await dispatch(exportTransactionsStream(filters));

      if (exportTransactionsStream.fulfilled.match(resultAction)) {
        const csvContent = resultAction.payload;
        if (!csvContent) return;

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("CSV exported successfully!");
      }
    } catch (err) {
      toast.error("Failed to export CSV");
      dispatch(setExportProgress(0));
    }
  };

  /* ───── Sort Handler ───── */
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column)
      return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-app-primary2" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-app-primary2" />
    );
  };

  /* ───── Filter helpers ───── */
  const activeFilterCount = [
    eventTypeFilter,
    itemTypeFilter,
    platformFilter,
  ].filter(Boolean).length;
  const hasActiveFilter = activeFilterCount > 0;

  const clearFilters = () => {
    setEventTypeFilter("");
    setItemTypeFilter("");
    setPlatformFilter("");
    setSearch("");
    setPage(1);
  };

  const overview = summary?.overview;
  const refunds = summary?.refunds;

  /* ───── Stats ───── */
  const stats = useMemo(
    () => [
      {
        label: "Gross Revenue",
        val: summaryLoading
          ? "..."
          : `$${overview?.grossRevenue?.toFixed(2) || "0.00"}`,
        icon: <IconCurrencyDollar size={22} />,
        color: "blue",
        description: overview?.currency || "AUD",
      },
      {
        label: "Net Revenue",
        val: summaryLoading
          ? "..."
          : `$${overview?.netRevenue?.toFixed(2) || "0.00"}`,
        icon: <IconReportMoney size={22} />,
        color: "emerald",
        description: `Commission: $${overview?.totalCommission?.toFixed(2) || "0.00"}`,
      },
      {
        label: "Refund Rate",
        val: summaryLoading ? "..." : refunds?.refundRate || "0%",
        icon: <IconArrowBackUp size={22} />,
        color: refunds && !refunds.isHealthy ? "rose" : "emerald",
        description: `${refunds?.totalRefunds || 0} refunds · $${refunds?.totalRefundAmount?.toFixed(2) || "0.00"}`,
      },
      {
        label: "Total Transactions",
        val: loading ? "..." : pagination.totalItems?.toLocaleString() || "0",
        icon: <IconReceipt size={22} />,
        color: "blue",
        description: `Page ${pagination.currentPage} of ${pagination.totalPages}`,
      },
    ],
    [summary, summaryLoading, loading, pagination, overview, refunds],
  );

  return (
    <Container>
      <div className="@container/main space-y-5">
        {/* ─── HEADER ─── */}
        <header className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="w-full">
              <PageHeader
                heading="Transactions"
                icon={
                  <TbTransactionDollar className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading="Revenue tracking, transaction history & export."
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage(1);
                  fetchTransactions();
                }}
                disabled={loading}
                className="h-9 flex-1 md:flex-none border-slate-300/60 bg-slate-50 hover:bg-app-primary3 shadow-sm text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <IconRefresh
                  className={cn("h-4 w-4 mr-1.5", loading && "animate-spin")}
                />
                Refresh
              </Button> */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exportLoading}
                className="h-9 flex-1 md:flex-none border-slate-300/60 bg-slate-50 hover:bg-app-primary3 shadow-sm text-slate-400 hover:text-white transition-all active:scale-95"
              >
                {exportLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <Download className="mr-1.5 h-4 w-4" />
                )}
                Export CSV
              </Button>
            </div>
          </div>
        </header>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsGrid
            stats={stats}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all filters first
              setSearch("");
              setEventTypeFilter("");
              setItemTypeFilter("");
              setPlatformFilter("");

              if (label === "Refund Rate") {
                setEventTypeFilter("REFUND");
              }
              // Pagination reset
              setPage(1);
            }}
          />
        </div>

        {/* ─── TOOLBAR (Search + Filters) ─── */}
        <div className="flex flex-col">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <div className="w-full flex flex-col md:flex-row lg:items-center justify-between gap-4">
              {/* 1. LEFT SIDE: Search Input */}
              <div className="relative flex-1 min-w-0">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by email."
                  className="pl-10 pr-10 bg-slate-50/50 border-slate-300/60/60 h-9 3xl:h-10 placeholder:text-slate-400 shadow-none outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-app-primary2 focus-visible:border-app-primary2 rounded-md w-full transition-all"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <IconX className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                )}
              </div>

              {/* 2. RIGHT SIDE CONTAINER: Separate Dropdowns + Count */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* 1. EVENT TYPE DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all",
                        eventTypeFilter &&
                          "border-app-primary2 text-app-primary2",
                      )}
                    >
                      <span className="text-xs">
                        {eventTypeFilter
                          ? EVENT_TYPE_MAP[eventTypeFilter]?.label ||
                            eventTypeFilter
                          : "All Types"}
                      </span>
                      <IconChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 p-1.5 rounded-xl"
                  >
                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                      Event Type
                    </DropdownMenuLabel>
                    {[
                      "PURCHASE",
                      "RENEW",
                      "REFUND",
                      "FAILED",
                      "ADMIN_GRANT",
                    ].map((type) => (
                      <DropdownMenuCheckboxItem
                        key={type}
                        className="rounded-lg capitalize text-xs"
                        checked={eventTypeFilter === type}
                        onCheckedChange={() => {
                          setEventTypeFilter(
                            eventTypeFilter === type ? "" : type,
                          );
                          setPage(1);
                        }}
                      >
                        {EVENT_TYPE_MAP[type]?.label || type}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 1.5 ITEM TYPE DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all",
                        itemTypeFilter &&
                          "border-app-primary2 text-app-primary2",
                      )}
                    >
                      <span className="text-xs">
                        {itemTypeFilter === "CONSUMABLE"
                          ? "Consumable"
                          : itemTypeFilter === "SUBSCRIPTION"
                            ? "Subscription"
                            : "All Items"}
                      </span>
                      <IconChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-40 p-1.5 rounded-xl"
                  >
                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                      Item Type
                    </DropdownMenuLabel>
                    {[
                      { value: "SUBSCRIPTION", label: "Subscription" },
                      { value: "CONSUMABLE", label: "Consumable" },
                    ].map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item.value}
                        className="rounded-lg capitalize text-xs"
                        checked={itemTypeFilter === item.value}
                        onCheckedChange={() => {
                          setItemTypeFilter(
                            itemTypeFilter === item.value ? "" : item.value,
                          );
                          setPage(1);
                        }}
                      >
                        {item.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 2. PLATFORM DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all",
                        platformFilter &&
                          "border-app-primary2 text-app-primary2",
                      )}
                    >
                      <span className="text-xs">
                        {platformFilter
                          ? PLATFORM_MAP[platformFilter] || platformFilter
                          : "All Platforms"}
                      </span>
                      <IconChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 p-1.5 rounded-xl"
                  >
                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                      Platform
                    </DropdownMenuLabel>
                    {[
                      { value: "ios", label: "iOS" },
                      { value: "android", label: "Android" },
                      { value: "admin_granted", label: "Admin" },
                    ].map((p) => (
                      <DropdownMenuCheckboxItem
                        key={p.value}
                        className="rounded-lg capitalize text-xs"
                        checked={platformFilter === p.value}
                        onCheckedChange={() => {
                          setPlatformFilter(
                            platformFilter === p.value ? "" : p.value,
                          );
                          setPage(1);
                        }}
                      >
                        {p.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 3. COUNT INDICATOR */}
                <div className="pl-2 pr-1 border-l border-slate-300/60 ml-1.5 flex items-center gap-1.5">
                  <span className="text-xs 3xl:text-sm font-bold text-app-primary2">
                    {pagination.totalItems || 0}
                  </span>
                  <span className="text-xs 3xl:text-sm text-slate-400 font-medium">
                    transactions
                  </span>
                </div>
              </div>
            </div>

            {/* 3. ACTIVE FILTER CHIPS */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <AnimatePresence>
                {hasActiveFilter && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    {eventTypeFilter && (
                      <Badge
                        variant="outline"
                        className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                      >
                        <span className="text-[10px] font-bold uppercase opacity-50">
                          Type:
                        </span>
                        <span className="capitalize text-[11px] font-semibold">
                          {EVENT_TYPE_MAP[eventTypeFilter]?.label ||
                            eventTypeFilter}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEventTypeFilter("")}
                          className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                        >
                          <IconX size={10} />
                        </button>
                      </Badge>
                    )}
                    {itemTypeFilter && (
                      <Badge
                        variant="outline"
                        className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                      >
                        <span className="text-[10px] font-bold uppercase opacity-50">
                          Item Type:
                        </span>
                        <span className="capitalize text-[11px] font-semibold">
                          {itemTypeFilter.toLowerCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => setItemTypeFilter("")}
                          className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                        >
                          <IconX size={10} />
                        </button>
                      </Badge>
                    )}
                    {platformFilter && (
                      <Badge
                        variant="outline"
                        className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                      >
                        <span className="text-[10px] font-bold uppercase opacity-50">
                          Platform:
                        </span>
                        <span className="capitalize text-[11px] font-semibold">
                          {PLATFORM_MAP[platformFilter] || platformFilter}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlatformFilter("")}
                          className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                        >
                          <IconX size={10} />
                        </button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 uppercase tracking-tight px-2 rounded-lg"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* ─── DATA TABLE ─── */}
        <div className="relative rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
          <div
            className={cn(
              "overflow-x-auto relative",
              loading && transactions.length > 0 && "min-h-[180px]",
            )}
          >
            <AnimatePresence>
              {loading && transactions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20"
                >
                  <TableLoader text="Updating Results..." />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Table content is always rendered to show headers, but rows vary based on state */}
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-300/60">
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px] text-center whitespace-nowrap">
                    Sr.No.
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px] text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleSort("occurredAt")}
                      className="flex items-center uppercase transition-colors"
                    >
                      Date
                      <span className="ml-2">
                        <ArrowUpDown
                          column="occurredAt"
                          className="svg text-muted-foreground"
                        />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px]">
                    User
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px]">
                    Product
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-5 font-bold h-10 bg-slate-100/50 text-[10px]">
                    Type
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-3 font-bold h-10 bg-slate-100/50 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSort("amount")}
                      className="flex items-center uppercase transition-colors"
                    >
                      Amount
                      <span className="ml-2">
                        <ArrowUpDown
                          column="amount"
                          className="svg text-muted-foreground"
                        />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px] text-left hidden sm:table-cell whitespace-nowrap">
                    Platform
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-5 font-bold h-10 bg-slate-100/50 text-[10px] text-left whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground/80 uppercase px-4 font-bold h-10 bg-slate-100/50 text-[10px] text-center whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((txn, index) => {
                    const eventConfig = EVENT_TYPE_MAP[txn.eventType] || {
                      label: txn.eventType,
                      color: "bg-slate-100 text-slate-600 border-slate-300/60",
                    };
                    const status =
                      txn.status ||
                      (txn.eventType === "REFUND"
                        ? "REFUNDED"
                        : txn.eventType === "CANCEL"
                          ? "FAILED"
                          : "SUCCESS");
                    const statusClass =
                      STATUS_MAP[status] || STATUS_MAP.PENDING;
                    const serialNo =
                      (pagination.currentPage - 1) * (limit || 15) + index + 1;

                    return (
                      <TableRow
                        key={txn._id}
                        className={cn(
                          "transition-all duration-200 even:bg-slate-50 hover:bg-slate-100/70 border-b border-slate-300/60/80 group cursor-pointer",
                          loading && "opacity-50 pointer-events-none",
                        )}
                        onClick={() =>
                          navigate(
                            `/admin/management/subscription-management/transactions/view/${txn._id}`,
                            {
                              state: { transaction: txn },
                            },
                          )
                        }
                      >
                        <TableCell className="px-4 py-3.5 text-center">
                          <span className="text-[11px] font-semibold">
                            {serialNo}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <div>
                            <p className="text-xs font-semibold">
                              {txn.date || txn.occurredAt
                                ? format(
                                    new Date(txn.date || txn.occurredAt),
                                    "dd MMM yyyy",
                                  )
                                : "—"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold">
                              {txn.date || txn.occurredAt
                                ? format(
                                    new Date(txn.date || txn.occurredAt),
                                    "hh:mm a",
                                  )
                                : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell
                          className="px-4 py-3.5 hidden sm:table-cell cursor-pointer"
                          title={
                            txn.user?.nickname || txn.user?.email || "Unknown"
                          }
                        >
                          <div className="flex flex-col">
                            <p
                              className="text-xs font-bold text-foreground/80 truncate max-w-[120px]"
                              title={
                                txn.user?.nickname ||
                                txn.user?.email ||
                                "Unknown"
                              }
                            >
                              {txn.user?.nickname || txn.user?.email || "—"}
                            </p>
                            <p
                              className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]"
                              title={txn.user?.email}
                            >
                              {txn.user?.email || txn.user?.phone || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3.5 hidden lg:table-cell truncate max-w-[120px]">
                          <span className="text-[11px] font-bold text-slate-500 font-mono">
                            {getProductDisplayName(txn.productId)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <Badge
                            className={cn(
                              "text-[10px] font-black uppercase border-none shadow-none rounded-lg px-2.5 py-0.5",
                              eventConfig.color,
                            )}
                          >
                            {eventConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-900 tabular-nums">
                              $
                              {(txn.grossAmount || txn.amount)?.toFixed(2) ||
                                "0.00"}
                            </span>
                            {txn.netAmount > 0 &&
                              txn.netAmount !==
                                (txn.grossAmount || txn.amount) && (
                                <span className="text-[10px] font-bold text-emerald-600 tabular-nums">
                                  Net: ${txn.netAmount.toFixed(2)}
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3.5 hidden sm:table-cell">
                          {(() => {
                            const platform = txn.platform?.toLowerCase();
                            let icon = <PiDevicesDuotone className="size-4" />;
                            let style =
                              "text-slate-600 border-slate-300/60 bg-slate-50";

                            if (platform === "ios") {
                              icon = <AiFillApple className="size-3.5" />;
                              style =
                                "text-slate-900 border-slate-300/60 bg-slate-100";
                            } else if (platform === "android") {
                              icon = <AiFillAndroid className="size-3.5" />;
                              style =
                                "text-emerald-600 border-emerald-100 bg-emerald-50";
                            } else if (
                              platform === "admin_granted" ||
                              platform === "admin"
                            ) {
                              icon = <FaUserTie className="size-3.5" />;
                              style =
                                "text-app-primary2 border-app-primary2 bg-app-primary2";
                            }

                            return (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-black rounded-lg px-2 py-1 h-7 gap-2 shadow-none border uppercase tracking-widest inline-flex items-center",
                                  style,
                                )}
                              >
                                {icon}
                                <span>
                                  {PLATFORM_MAP[platform] || platform || "—"}
                                </span>
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] font-black uppercase tracking-widest border-none shadow-none px-2 py-0.5 rounded-full",
                              statusClass,
                            )}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="px-4 py-3.5 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-md hover:bg-slate-100"
                              >
                                <MoreHorizontal
                                  size={18}
                                  className="text-slate-600"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 p-2 shadow-sm rounded-2xl border-slate-300/60"
                            >
                              <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5 tracking-widest">
                                Actions
                              </DropdownMenuLabel>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/management/subscription-management/transactions/view/${txn._id}`,
                                    {
                                      state: { transaction: txn },
                                    },
                                  )
                                }
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 rounded-xl hover:bg-app-primary3 hover:text-app-primary2 transition-colors"
                              >
                                <Eye size={16} />
                                <span>View Transaction</span>
                              </button>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-56 text-center relative"
                    >
                      {loading ? (
                        <TableLoader text="Fetching Transactions..." />
                      ) : (
                        <DataNotFound message="No transactions found" />
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* ─── PAGINATION ─── */}
            <div className="flex flex-col items-start justify-between p-4 sm:p-6 border-t border-slate-300/60 gap-6 sm:flex-row sm:gap-4">
              {/* Left Side: Showing results count */}
              <div className="text-xs font-medium text-slate-400 order-1 text-center sm:text-left">
                Showing{" "}
                {Math.min((page - 1) * limit + 1, pagination.totalItems || 0)}-
                {Math.min(page * limit, pagination.totalItems || 0)} of{" "}
                {pagination.totalItems || 0} transactions
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center gap-10 order-2 w-full sm:w-auto">
                {/* Row Select Bar */}
                <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Rows
                  </span>
                  <Select
                    value={`${limit}`}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger
                      type="button"
                      className="h-8 w-[65px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:ring-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-300/60 shadow-xl">
                      {[10, 20, 50].map((size) => (
                        <SelectItem
                          key={size}
                          value={`${size}`}
                          className="text-xs font-medium rounded-lg"
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
                  {/* Previous Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.currentPage <= 1}
                  >
                    <IconChevronLeft size={16} />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const totalPages = pagination.totalPages || 1;
                      const currentPage = pagination.currentPage || 1;
                      const pages = [];

                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (currentPage <= 3) {
                          pages.push(1, 2, 3, 4, "...", totalPages);
                        } else if (currentPage >= totalPages - 2) {
                          pages.push(
                            1,
                            "...",
                            totalPages - 3,
                            totalPages - 2,
                            totalPages - 1,
                            totalPages,
                          );
                        } else {
                          pages.push(
                            1,
                            "...",
                            currentPage - 1,
                            currentPage,
                            currentPage + 1,
                            "...",
                            totalPages,
                          );
                        }
                      }

                      return pages.map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span
                              key={`dots-${idx}`}
                              className="px-1 text-slate-400 text-xs font-bold"
                            >
                              ...
                            </span>
                          );
                        }
                        const isActive = currentPage === p;
                        return (
                          <Button
                            type="button"
                            key={p}
                            onClick={() => setPage(p)}
                            className={cn(
                              "h-8 w-8 text-xs font-bold rounded-md transition-all",
                              isActive
                                ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-app-primary2 border-none"
                                : "bg-white border border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300/60 shadow-none",
                            )}
                          >
                            {p}
                          </Button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    <IconChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── EXPORT PROGRESS CARD ─── */}
        <AnimatePresence>
          {(exportLoading || exportProgress > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-[100]"
            >
              <style>
                {`
                  @keyframes shimmer-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                  }
                `}
              </style>
              <div className="bg-white border border-slate-300/60 p-6 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-80 relative group">
                {/* Close Button */}
                <button
                  onClick={() => dispatch(setExportProgress(0))}
                  className="absolute -top-2 -right-1 h-6 w-6 bg-white border border-slate-300/60 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-all z-[101] text-slate-400 hover:text-slate-600 hover:scale-110 active:scale-95"
                >
                  <X size={14} strokeWidth={2} />
                </button>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-500",
                        exportProgress === 100
                          ? "bg-emerald-50 border-emerald-100 shadow-emerald-100/50"
                          : "bg-app-primary2 border-app-primary2",
                      )}
                    >
                      {exportProgress === 100 ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 12 }}
                        >
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        </motion.div>
                      ) : (
                        <Loader2 className="animate-spin h-5 w-5 text-app-primary2" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight">
                        {exportProgress === 100
                          ? "Export Ready"
                          : "Exporting Data"}
                      </h3>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                        {exportProgress === 100
                          ? "File Downloaded"
                          : "Generating CSV"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-xl border transition-colors duration-500",
                      exportProgress === 100
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-app-primary2 border-app-primary2 text-app-primary2",
                    )}
                  >
                    <span className="font-mono text-base font-bold tracking-tighter">
                      {exportProgress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-300/60/60 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 120,
                      }}
                      className={cn(
                        "h-full relative rounded-full transition-colors duration-500",
                        exportProgress === 100
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          : "bg-app-primary2 shadow-[0_0_10px_rgba(34,211,238,0.3)]",
                      )}
                    >
                      {/* Active Shimmer Effect */}
                      {exportProgress < 100 && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          style={{
                            width: "100px",
                            animation: "shimmer-progress 2s infinite linear",
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] px-1">
                    <div className="flex items-center gap-1.5">
                      {exportProgress < 100 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-app-primary2 animate-pulse" />
                      )}
                      <span className="text-slate-600 font-semibold tracking-tight">
                        {exportProgress === 100
                          ? "Export completed successfully"
                          : "Processing records..."}
                      </span>
                    </div>
                    {exportProgress === 100 && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-500 font-black uppercase tracking-tighter"
                      >
                        Success
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
