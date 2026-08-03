import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ModuleKpiRow from "@/components/shared/ModuleKpiRow";
import { History } from "lucide-react";
import {
  IconSearch,
  IconChartBar,
  IconMail,
  IconDeviceMobile,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

import { bgMap, colorMap } from "@/constants/colors";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailCampaignLogs,
  clearCampaignLogs,
} from "../store/notification-management.slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { TableLoader } from "@/app/loader/table.loader";
import Loader from "@/components/common/Loader";

import { format } from "date-fns";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2,
//     },
//   },
// };

export default function CampaignHistory({
  history,
  pagination,
  paginationState,
  onPaginationChange,
  channelFilter,
  setChannelFilter,
  statusFilter,
  setStatusFilter,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useSelector((state) => state.notificationManagement);
  const totalPages = pagination?.totalPages || 0;
  const currentPage = (paginationState?.pageIndex || 0) + 1;

  const formatError = (rawError) => {
    if (!rawError) return "Success";
    const err = rawError.toString();

    if (err.includes("Daily user sending limit exceeded")) {
      return "🚫 Gmail Daily Limit Reached (Google blocks sending more emails today).";
    }
    if (
      err.includes("Authentication failed") ||
      err.includes("Invalid login") ||
      err.includes("535 5.7.8")
    ) {
      return "🔑 SMTP Login Failed (Check your email password/App Password).";
    }
    if (err.includes("Connection timeout") || err.includes("ETIMEDOUT")) {
      return "⏳ Connection Timeout (Email server took too long to respond).";
    }
    if (
      err.includes("Recipient address rejected") ||
      err.includes("550 5.1.1")
    ) {
      return "📧 Invalid Email (Recipient address does not exist).";
    }
    if (err.includes("Too many concurrent connections")) {
      return "⚡ Too many active connections (Slow down the sending speed).";
    }

    return err.length > 80 ? err.substring(0, 80) + "..." : err;
  };

  const dispatch = useDispatch();
  const { campaignLogs, loading: logsLoading } = useSelector(
    (state) => state.notificationManagement,
  );
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const handleViewLogs = (campaign) => {
    setSelectedCampaign(campaign);
    setIsLogsModalOpen(true);
    dispatch(getEmailCampaignLogs(campaign._id));
  };

  const closeLogsModal = () => {
    setIsLogsModalOpen(false);
    setSelectedCampaign(null);
    dispatch(clearCampaignLogs());
  };

  const filteredHistory = history?.filter((item) => {
    const matchesSearch =
      item.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const stats = [
    {
      label: "Total Campaigns",
      value: pagination?.total || 0,
      icon: <IconChartBar size={22} />,
      tone: "blue",
      description: "Overall campaigns",
    },
    {
      label: "Emails Dispatched",
      value: pagination?.emailCount || 0,
      icon: <IconMail size={22} />,
      tone: "indigo",
      description: "Email communications",
      onClick: () => {
        setSearchTerm("");
        setChannelFilter("email");
        setStatusFilter("all");
        onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
      },
      isSelected: channelFilter === "email",
    },
    {
      label: "Pushes Dispatched",
      value: pagination?.pushCount || 0,
      icon: <IconDeviceMobile size={22} />,
      tone: "emerald",
      description: "Mobile notifications",
      onClick: () => {
        setSearchTerm("");
        setChannelFilter("push");
        setStatusFilter("all");
        onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
      },
      isSelected: channelFilter === "push",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card className="bg-white gap-5 border border-slate-300/60 rounded-xl shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-6 space-y-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Campaign History Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium ml-1">
            Log of all previously dispatched push and email campaigns with
            performance metrics
          </p>
        </div>
        <ModuleKpiRow items={stats} loading={loading && !history?.length} />
      </Card>

      {/* History Toolbar (Consistent with User Management) */}
      <div className="w-full flex flex-col md:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Search */}
        <div className="relative flex-1 min-w-0">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white border-slate-300/60 h-9 3xl:h-10 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-app-primary2 rounded-md w-full transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-1 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <IconX className="h-3.5 w-3.5 text-slate-500" />
            </button>
          )}
        </div>

        {/* Right Side: Filters & Count */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all text-xs w-full sm:w-auto">
              <SelectValue placeholder="All Channels" />
              {/* <IconChevronDown className="h-4 w-4 opacity-50 ml-auto" /> */}
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs rounded-lg">
                All Channels
              </SelectItem>
              <SelectItem value="email" className="text-xs rounded-lg">
                Email
              </SelectItem>
              <SelectItem value="push" className="text-xs rounded-lg">
                Push
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 3xl:h-10 px-3 3xl:px-4 gap-2 bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all text-xs w-full sm:w-auto">
              <SelectValue placeholder="All Status" />
              {/* <IconChevronDown className="h-4 w-4 opacity-50 ml-auto" /> */}
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs rounded-lg">
                All Status
              </SelectItem>
              <SelectItem value="delivered" className="text-xs rounded-lg">
                Delivered
              </SelectItem>
              <SelectItem value="failed" className="text-xs rounded-lg">
                Failed
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Result Count Badge */}
          <div className="pl-2 border-l border-slate-300/60 flex items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Results
              </span>
              <span className="text-xs font-black text-app-primary2">
                {pagination?.total || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mt-1 px-1 mb-1">
        {(channelFilter !== "all" || statusFilter !== "all") && (
          <div className="flex flex-wrap items-center gap-1.5">
            {channelFilter !== "all" && (
              <Badge
                variant="outline"
                className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md flex items-center"
              >
                <span className="text-[10px] font-bold uppercase opacity-50">
                  Channel:
                </span>
                <span className="capitalize text-[11px] font-semibold">
                  {channelFilter}
                </span>
                <button
                  onClick={() => setChannelFilter("all")}
                  className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                >
                  <IconX size={10} />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge
                variant="outline"
                className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md flex items-center"
              >
                <span className="text-[10px] font-bold uppercase opacity-50">
                  Status:
                </span>
                <span className="capitalize text-[11px] font-semibold">
                  {statusFilter}
                </span>
                <button
                  onClick={() => setStatusFilter("all")}
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
              onClick={() => {
                setChannelFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* History Table (High-Density Bento Grid) */}
      <div className="block rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative min-h-[400px]">
          {loading && history && history.length > 0 && (
            <TableLoader text="Updating history..." />
          )}
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="border-y border-slate-300/60 bg-app-primary2/5 hover:bg-app-primary2/5">
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-center">
                  SR.No
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Date Sent
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Channel
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Campaign Details
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Audience
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Metrics
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-left">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 h-10 first:pl-6 last:pr-6 whitespace-nowrap text-center">
                  Logs
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              className={cn(
                loading && "opacity-50 pointer-events-none transition-opacity",
              )}
            >
              <AnimatePresence mode="popLayout">
                {loading && (!history || history.length === 0) ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-60 text-center relative"
                    >
                      <TableLoader text="Fetching campaigns..." />
                    </TableCell>
                  </TableRow>
                ) : history && history.length > 0 ? (
                  history.map((item, idx) => (
                    <motion.tr
                      key={item._id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="hover:bg-slate-100/50 border-y border-slate-200/60 last:border-0 transition-colors group cursor-pointer"
                    >
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 text-center whitespace-nowrap">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-900">
                            {format(new Date(item.createdAt), "dd MMM, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                        <Badge
                          className={cn(
                            "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-none shadow-none flex items-center gap-1.5 transition-all duration-200 max-w-max",
                            item.channel === "email"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-emerald-50 text-emerald-600",
                          )}
                        >
                          <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
                          <span className="truncate">
                            {item.channel || "Push"}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex flex-col max-w-xs whitespace-nowrap">
                          <span className="text-[11px] font-bold text-slate-800 truncate">
                            {item.campaignName || "General Campaign"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-[11px] font-bold text-slate-600 capitalize whitespace-nowrap">
                        {item.target || "Community"}
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {(statusFilter === "all" ||
                            statusFilter === "delivered") && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                Sent
                              </span>
                              <span className="text-[13px] font-black text-emerald-600">
                                {item.sentCount || 0}
                              </span>
                            </div>
                          )}
                          {statusFilter === "all" && (
                            <div className="w-[1px] h-6 bg-slate-200" />
                          )}
                          {(statusFilter === "all" ||
                            statusFilter === "failed") && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                Failed
                              </span>
                              <span className="text-[13px] font-black text-red-500">
                                {item.failedCount || 0}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              item.status === "completed"
                                ? "bg-app-primary2 shadow-[0_0_8px_rgba(20,184,166,0.4)]"
                                : "bg-amber-400",
                            )}
                          />
                          <span
                            className={cn(
                              "text-[11px] font-bold uppercase tracking-wider",
                              item.status === "completed"
                                ? "text-app-primary2"
                                : "text-amber-600",
                            )}
                          >
                            {item.status || "Pending"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-medium text-slate-700 text-center whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={item.channel !== "email"}
                          className="h-7 px-2 text-[10px] font-bold uppercase border-slate-300/60 hover:bg-app-primary3 hover:text-white hover:border-app-primary2 transition-all"
                          onClick={() => handleViewLogs(item)}
                        >
                          Logs
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-60 text-center relative"
                    >
                      <DataNotFound message={"No campaigns history found"} />
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* --- PAGINATION SECTION (MERGED) --- */}
        <div className="flex flex-col items-start md:items-center justify-between p-4 sm:p-6 border-t border-slate-300/60 gap-6 sm:flex-row sm:gap-4">
          {/* Left Side: Showing results count */}
          <div className="text-xs font-medium text-slate-400 order-1 text-start">
            Showing{" "}
            {paginationState.pageIndex * paginationState.pageSize +
              (pagination?.total > 0 ? 1 : 0)}
            -
            {Math.min(
              (paginationState.pageIndex + 1) * paginationState.pageSize,
              pagination?.total || 0,
            )}{" "}
            of {pagination?.total || 0} results
          </div>

          {/* Right Side: Pagination Controls */}
          <div className="flex items-center gap-10 md:gap-6 order-2 w-full sm:w-auto">
            {/* Row Select Bar */}
            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Rows
              </span>
              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) =>
                  onPaginationChange((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }))
                }
              >
                <SelectTrigger className="h-8 w-[65px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:ring-0">
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
              {/* Navigation */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                onClick={() =>
                  onPaginationChange((prev) => ({
                    ...prev,
                    pageIndex: Math.max(0, prev.pageIndex - 1),
                  }))
                }
                disabled={currentPage === 1}
              >
                <IconChevronLeft size={16} />
              </Button>

              <div className="flex items-center gap-1.5">
                {(() => {
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
                        key={page}
                        onClick={() =>
                          onPaginationChange((prev) => ({
                            ...prev,
                            pageIndex: page - 1,
                          }))
                        }
                        className={cn(
                          "h-8 min-w-[32px] px-2 text-xs font-bold rounded-md transition-all",
                          isActive
                            ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-app-primary2"
                            : "bg-white border border-slate-300/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300/60 shadow-none",
                        )}
                      >
                        {page}
                      </Button>
                    );
                  });
                })()}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                onClick={() =>
                  onPaginationChange((prev) => ({
                    ...prev,
                    pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
                  }))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <IconChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY LOGS MODAL */}
      <Dialog open={isLogsModalOpen} onOpenChange={setIsLogsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] gap-0 overflow-hidden flex flex-col bg-white rounded-2xl border-none shadow-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-300/60 flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Campaign Delivery Logs
              </DialogTitle>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">
                {selectedCampaign?.campaignName} •{" "}
                {new Date(selectedCampaign?.createdAt).toLocaleString()}
              </p>
            </div>
          </DialogHeader>

          <div className="flex-1 flex flex-col p-4 bg-slate-50/30 relative min-h-[400px]">
            {logsLoading ? (
              <TableLoader text="Fetching granular logs..." />
            ) : campaignLogs && campaignLogs.length > 0 ? (
              <div className="rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-auto max-h-[460px] relative">
                <Table className="border-separate border-spacing-0 table-fixed min-w-[600px] w-full relative">
                  <TableHeader className="z-20 shadow-sm">
                    <TableRow className="w-full">
                      <TableHead className="sticky top-0 z-30 bg-white w-1/4 text-[10px] font-bold uppercase px-4 h-9">
                        Email
                      </TableHead>
                      <TableHead className="sticky top-0 z-30 bg-white w-1/6 text-[10px] font-bold uppercase px-4 h-9">
                        Status
                      </TableHead>
                      <TableHead className="sticky top-0 z-30 bg-white w-1/6 text-[10px] font-bold uppercase px-4 h-9">
                        Error Details
                      </TableHead>
                      <TableHead className="sticky top-0 z-30 bg-white w-2/12 text-[10px] font-bold uppercase pr-12 h-9 text-center">
                        Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignLogs.map((log, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-slate-50/80 border-slate-100"
                      >
                        <TableCell className="px-4 py-2.5">
                          <span className="text-[13px] font-bold text-slate-700">
                            {log.email}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2.5 text-left">
                          <Badge
                            className={cn(
                              "px-2 py-0 h-5 text-[9px] font-black uppercase rounded-md",
                              log.status === "sent"
                                ? "bg-emerald-100 text-emerald-600"
                                : log.status === "failed"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <span
                            className={cn(
                              "text-[11px] font-medium block max-w-sm",
                              log.status === "failed"
                                ? "text-red-500 font-bold"
                                : "text-slate-400",
                            )}
                          >
                            {log.status === "failed"
                              ? formatError(log.error)
                              : "Delivered Successfully"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2.5 text-center">
                          <span className="text-[11px] font-medium text-slate-400">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <History size={48} className="text-slate-200" />
                <p className="text-sm font-bold text-slate-400">
                  No logs found for this campaign.
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={closeLogsModal}
              className="border-slate-300/60 bg-white text-slate-400 hover:text-white hover:bg-app-primary3 text-xs font-medium px-6 h-9 rounded-lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
