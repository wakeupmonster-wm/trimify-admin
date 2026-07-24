/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { fetchSubscribers } from "../store/subscription.slice";
import { getSubscriberColumns } from "../components/subscriber.columns";
import { PageHeader } from "@/components/common/headSubhead";

import { bgMap, colorMap } from "@/constants/colors";
import { PreLoader } from "@/app/loader/preloader";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";
import { RiUserForbidLine } from "react-icons/ri";
import { LuUserRoundCheck, LuUserRound, LuUsersRound } from "react-icons/lu";
import { Container } from "@/components/common/container";
import { TableLoader } from "@/app/loader/table.loader";

// ─── Animation variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function SubscriberManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    subscribers = [],
    subscribersLoading: loading,
    pagination: serverPagination,
  } = useSelector((state) => state.subscription);

  // ─── Pagination ───
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem("subscriberManagementPagination");
    return saved ? JSON.parse(saved) : { pageIndex: 0, pageSize: 10 };
  });

  // ─── Filters ───
  const [search, setSearch] = useState(
    () => sessionStorage.getItem("subscriberManagementSearch") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState(
    () => sessionStorage.getItem("subscriberManagementStatusFilter") || "",
  );
  const [planFilter, setPlanFilter] = useState(
    () => sessionStorage.getItem("subscriberManagementPlanFilter") || "",
  );
  const [platformFilter, setPlatformFilter] = useState(
    () => sessionStorage.getItem("subscriberManagementPlatformFilter") || "",
  );

  // Save to sessionStorage whenever filters change
  useEffect(() => {
    sessionStorage.setItem(
      "subscriberManagementPagination",
      JSON.stringify(pagination),
    );
    sessionStorage.setItem("subscriberManagementSearch", search);
    sessionStorage.setItem("subscriberManagementStatusFilter", statusFilter);
    sessionStorage.setItem("subscriberManagementPlanFilter", planFilter);
    sessionStorage.setItem(
      "subscriberManagementPlatformFilter",
      platformFilter,
    );
  }, [pagination, search, statusFilter, planFilter, platformFilter]);

  // Debounce search input to avoid API spam on keystrokes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ─── Sorting ───
  const [sorting, setSorting] = useState([]);

  // ─── Fetch data ───
  useEffect(() => {
    dispatch(
      fetchSubscribers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter,
        planType: planFilter,
        platform: platformFilter,
      }),
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    statusFilter,
    planFilter,
    platformFilter,
  ]);

  // ─── Helpers ───
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPlanFilter("");
    setPlatformFilter("");
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const getFilterLabel = (type, val) => {
    if (!val) return "";
    if (type === "status") return val;
    if (type === "plan") {
      if (val === "1_MONTH" || val === "ONE_MONTH") return "1 Month";
      if (val === "3_MONTH" || val === "THREE_MONTHS") return "3 Month";
      return val;
    }
    if (type === "platform") {
      if (val === "ios") return "iOS";
      if (val === "android") return "Android";
      if (val === "admin_granted") return "Admin Granted";
      return val;
    }
    return val;
  };

  const activeFilterCount = [statusFilter, planFilter, platformFilter].filter(
    Boolean,
  ).length;
  const hasActiveFilter = activeFilterCount > 0;

  // ─── Stats ───
  const stats = useMemo(() => {
    return [
      {
        label: "Total Subscribers",
        val: serverPagination?.total || 0,
        icon: <LuUserRound size={22} />,
        color: "blue",
        description: "Across all platforms",
      },
      {
        label: "Active Users",
        val:
          serverPagination?.totalActive ??
          subscribers.filter((s) => s.status === "ACTIVE" && !s.isExpired)
            .length,
        icon: <LuUserRoundCheck size={22} />,
        color: "emerald",
        description: "Currently subscribed",
      },
      {
        label: "Expired",
        val:
          serverPagination?.totalExpired ??
          subscribers.filter((s) => s.isExpired || s.status === "EXPIRED")
            .length,
        icon: <RiUserForbidLine size={22} />,
        color: "amber",
        description: "Subscription ended",
      },
      {
        label: "Revoked",
        val:
          serverPagination?.totalRevoked ??
          subscribers.filter((s) => s.status === "REVOKED").length,
        icon: <RiUserForbidLine size={22} />,
        color: "rose",
        description: "Access removed",
      },
    ];
  }, [
    subscribers,
    serverPagination?.total,
    serverPagination?.totalActive,
    serverPagination?.totalExpired,
    serverPagination?.totalRevoked,
  ]);

  // ─── Table columns ───
  const columns = useMemo(() => getSubscriberColumns(navigate), [navigate]);

  // ─── TanStack Table ───
  const table = useReactTable({
    data: subscribers,
    columns,
    rowCount: serverPagination?.total ?? 0,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    manualSorting: false,
    manualPagination: true,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading && subscribers.length === 0) return <PreLoader />;

  return (
    <Container className="py-6">
      <div className="space-y-5">
        {/* ─── HEADER ─── */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full">
              <PageHeader
                heading="Subscriber Management"
                icon={<LuUsersRound className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading="Monitor and manage all application subscribers."
              />
            </div>
          </div>
        </header>

        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsGrid
            stats={stats}
            colorMap={colorMap}
            bgMap={bgMap}
            onCardClick={(label) => {
              // Reset all filters first
              setSearch("");
              setStatusFilter("");
              setPlanFilter("");
              setPlatformFilter("");

              if (label === "Active Users") {
                setStatusFilter("ACTIVE");
              } else if (label === "Expired") {
                setStatusFilter("EXPIRED");
              } else if (label === "Revoked") {
                setStatusFilter("REVOKED");
              }
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        {/* ─── CONTROLS: SEARCH & FILTERS ─── */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="w-full flex flex-col md:flex-row lg:items-center justify-between gap-4">
            {/* 1. LEFT SIDE: Search Input */}
            <div className="relative flex-1 min-w-0">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by nickname, email or phone..."
                className="pl-10 pr-10 bg-white border-slate-300/60 h-9 3xl:h-10 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-app-primary2 rounded-md w-full transition-all outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <IconX className="h-3.5 w-3.5 text-slate-500" />
                </button>
              )}
            </div>

            {/* 2. RIGHT SIDE CONTAINER: Separate Dropdowns + Count */}
            <div className="grid grid-cols-2 md:flex items-center gap-2.5 w-full md:w-auto">
              {/* 1. STATUS DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto",
                      statusFilter && "border-app-primary2 text-app-primary2",
                    )}
                  >
                    <span className="text-xs truncate">
                      {statusFilter
                        ? statusFilter.charAt(0).toUpperCase() +
                          statusFilter.slice(1).toLowerCase()
                        : "All Status"}
                    </span>
                    <IconChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 p-1.5 rounded-xl"
                >
                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                    Account Status
                  </DropdownMenuLabel>
                  {["ACTIVE", "CANCELLED", "REVOKED", "EXPIRED"].map(
                    (status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        className="rounded-lg capitalize text-xs"
                        checked={statusFilter === status}
                        onCheckedChange={() => {
                          setStatusFilter(
                            statusFilter === status ? "" : status,
                          );
                          setPagination((p) => ({ ...p, pageIndex: 0 }));
                        }}
                      >
                        {status.toLowerCase()}
                      </DropdownMenuCheckboxItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 2. PLAN DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto",
                      planFilter && "border-app-primary2 text-app-primary2",
                    )}
                  >
                    <span className="text-xs truncate">
                      {planFilter
                        ? getFilterLabel("plan", planFilter)
                        : "All Plans"}
                    </span>
                    <IconChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 p-1.5 rounded-xl"
                >
                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                    Plan Type
                  </DropdownMenuLabel>
                  {["1_MONTH", "3_MONTH"].map((plan) => (
                    <DropdownMenuCheckboxItem
                      key={plan}
                      className="rounded-lg text-xs"
                      checked={planFilter === plan}
                      onCheckedChange={() => {
                        setPlanFilter(planFilter === plan ? "" : plan);
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                      }}
                    >
                      {getFilterLabel("plan", plan)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 3. PLATFORM DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all w-full md:w-auto",
                      platformFilter && "border-app-primary2 text-app-primary2",
                    )}
                  >
                    <span className="text-xs truncate">
                      {platformFilter
                        ? getFilterLabel("platform", platformFilter)
                        : "All Platforms"}
                    </span>
                    <IconChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 p-1.5 rounded-xl"
                >
                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5">
                    Platform
                  </DropdownMenuLabel>
                  {["ios", "android", "admin_granted"].map((platform) => (
                    <DropdownMenuCheckboxItem
                      key={platform}
                      className="rounded-lg capitalize text-xs"
                      checked={platformFilter === platform}
                      onCheckedChange={() => {
                        setPlatformFilter(
                          platformFilter === platform ? "" : platform,
                        );
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                      }}
                    >
                      {getFilterLabel("platform", platform)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 4. COUNT INDICATOR */}
              <div className="flex items-center gap-1.5 pl-2 md:pl-2 border-l-0 md:border-l border-slate-300/60 md:ml-1.5 justify-center md:justify-start py-1 md:py-0">
                <span className="text-xs 3xl:text-sm font-bold text-app-primary2">
                  {serverPagination?.total || 0}
                </span>
                <span className="text-xs 3xl:text-sm text-slate-400 font-medium whitespace-nowrap">
                  subscribers
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
                  {statusFilter && (
                    <Badge
                      variant="outline"
                      className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                    >
                      <span className="text-[10px] font-bold uppercase opacity-50">
                        Status:
                      </span>
                      <span className="capitalize text-[11px] font-semibold">
                        {statusFilter.toLowerCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("")}
                        className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                      >
                        <IconX size={10} />
                      </button>
                    </Badge>
                  )}
                  {planFilter && (
                    <Badge
                      variant="outline"
                      className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                    >
                      <span className="text-[10px] font-bold uppercase opacity-50">
                        Plan:
                      </span>
                      <span className="text-[11px] font-semibold">
                        {getFilterLabel("plan", planFilter)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPlanFilter("")}
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
                        {getFilterLabel("platform", platformFilter)}
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
        </motion.div>

        {/* ─── DATA TABLE ─── */}
        <motion.div variants={itemVariants}>
          <div className="relative rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
            <div
              className={cn(
                "overflow-x-auto relative",
                loading && subscribers.length > 0 && "min-h-[180px]",
              )}
            >
              <AnimatePresence>
                {loading && subscribers.length > 0 && (
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
              <Table className="min-w-[900px]">
                <TableHeader className="bg-slate-50/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent border-b border-slate-300/60"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "even:bg-slate-50 hover:bg-slate-100/70 transition-all border-b border-slate-100/60 cursor-pointer",
                          loading && "opacity-50 pointer-events-none",
                        )}
                        onClick={(e) => {
                          if (
                            e.target.closest("button") ||
                            e.target.closest("[role='menuitem']")
                          )
                            return;
                          const sub = row.original;
                          const targetId =
                            sub.user?._id || sub.userId?._id || sub.userId;
                          if (targetId)
                            navigate(
                              `/admin/management/subscription-management/view-subscription/${targetId}`,
                            );
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-3 px-3 text-left"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-60 text-center relative"
                      >
                        {loading ? (
                          <TableLoader text="Fetching subscribers..." />
                        ) : (
                          <DataNotFound message="No subscribers found matching your criteria" />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ─── PAGINATION ─── */}
            <div className="flex flex-col items-start justify-between p-4 sm:p-6 border-t border-slate-300/60 gap-6 sm:flex-row sm:gap-4">
              {/* Left Side: Showing results count */}
              <div className="text-xs font-medium text-slate-400 order-1 text-center sm:text-left">
                Showing {pagination.pageIndex * pagination.pageSize + 1}-
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  serverPagination?.total || 0,
                )}{" "}
                of {serverPagination?.total || 0} subscribers
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center gap-10 order-2 w-full sm:w-auto">
                {/* Row Select Bar */}
                <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Rows
                  </span>
                  <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) =>
                      setPagination({ pageIndex: 0, pageSize: Number(value) })
                    }
                  >
                    <SelectTrigger
                      type="button"
                      className="h-8 w-[65px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:ring-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-300/60 shadow-xl">
                      {[10, 15, 25, 50].map((size) => (
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
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: prev.pageIndex - 1,
                      }))
                    }
                    disabled={pagination.pageIndex === 0}
                  >
                    <IconChevronLeft size={16} />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const totalPages = serverPagination?.totalPages || 1;
                      const currentPage = pagination.pageIndex + 1;
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

                      return pages.map((page, idx) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`dots-${idx}`}
                              className="px-1 text-slate-400 text-xs font-bold"
                            >
                              ...
                            </span>
                          );
                        }
                        const isActive = currentPage === page;
                        return (
                          <Button
                            type="button"
                            key={page}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                pageIndex: page - 1,
                              }))
                            }
                            className={cn(
                              "h-8 w-8 text-xs font-bold rounded-md transition-all",
                              isActive
                                ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-app-primary2 border-none"
                                : "bg-white border border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300/60 shadow-none",
                            )}
                          >
                            {page}
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
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: prev.pageIndex + 1,
                      }))
                    }
                    disabled={!serverPagination?.hasNextPage}
                  >
                    <IconChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
