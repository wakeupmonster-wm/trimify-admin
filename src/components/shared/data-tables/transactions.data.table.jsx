import { React, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";
import { IoLogoApple } from "react-icons/io5";
import { AiFillAndroid } from "react-icons/ai";

export default function TransactionDataTables({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  meta,
  filters, // Destructure the new filters prop
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    rowCount,
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    onSortingChange: setSorting,
    manualSorting: false, // 4. Tell TanStack you'll handle it via API
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, pagination, globalFilter },
    meta: meta,
  });

  // 2. Updated to match your actual filter key "drawStatus"
  const hasActiveFilters = filters.drawStatus;

  return (
    <div className="w-full space-y-4">
      {/* --- TOOLBAR SECTION --- */}
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-1">
          {/* 1. LEFT SIDE: Search Input (Expanded) */}
          <div className="relative flex-1 min-w-0 w-full">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 pr-10 bg-white border-slate-300/60 h-9 3xl:h-10 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-brand-blue rounded-md w-full transition-all outline-none"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center justify-center rounded-full p-1 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <IconX className="h-3.5 w-3.5 text-slate-500" />
              </button>
            )}
          </div>

          {/* 2. RIGHT SIDE CONTAINER: Separate Dropdowns + Count */}
          <div className="flex items-center justify-between gap-2.5 w-full md:w-auto">
            {/* 1. PLATFORM SELECT */}
            <div className="flex-1 md:w-auto">
              <Select
                value={filters.platform}
                onValueChange={filters.setPlatform}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 3xl:h-10 w-full md:w-auto md:min-w-[130px] bg-white border-slate-300/60 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-all justify-between",
                    filters.platform && "border-brand-blue text-brand-blue",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!filters.platform && (
                      <span className="text-sm">Platform</span>
                    )}
                    <SelectValue placeholder="Platform" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1.5">
                  <SelectItem value="ios" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <IoLogoApple className="w-4 h-4" />
                      <span>IOS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="android" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <AiFillAndroid className="w-4 h-4 text-emerald-600" />
                      <span>Android</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. ITEM COUNT INDICATOR */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-300/60">
              <span className="text-xs 3xl:text-sm font-bold text-brand-blue">
                {rowCount ?? data.length}
              </span>
              <span className="text-xs 3xl:text-sm text-slate-400 font-medium">
                transactions
              </span>
            </div>
          </div>
        </div>

        {/* 3. ACTIVE FILTER CHIPS */}
        <div className="flex flex-wrap items-center gap-2 mt-1 px-1">
          <AnimatePresence>
            {(filters.platform || filters.drawStatus) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-wrap items-center gap-1.5"
              >
                {filters.platform && (
                  <Badge
                    variant="outline"
                    className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                  >
                    <span className="text-[10px] font-bold uppercase opacity-50">
                      Platform:
                    </span>
                    <span className="uppercase text-[11px] font-semibold">
                      {filters.platform}
                    </span>
                    <button
                      onClick={() => filters.setPlatform("")}
                      className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                    >
                      <IconX size={10} />
                    </button>
                  </Badge>
                )}
                {filters.drawStatus && (
                  <Badge
                    variant="outline"
                    className="h-7 px-2.5 gap-1.5 bg-slate-100 border-slate-300/60 text-slate-600 rounded-md"
                  >
                    <span className="text-[10px] font-bold uppercase opacity-50">
                      Status:
                    </span>
                    <span className="capitalize text-[11px] font-semibold">
                      {filters.drawStatus}
                    </span>
                    <button
                      onClick={() => filters.setDrawStatus("")}
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
                    filters.setPlatform("");
                    filters.setDrawStatus("");
                  }}
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- DATA AREA (RESPONSIBLE) & PAGINATION MERGED --- */}
      <div className="relative rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative">
          <AnimatePresence>
            {isLoading && data.length > 0 && (
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
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-foreground/80 px-6 font-semibold h-10 bg-slate-100/50 text-xs text-left"
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
            <TableBody
              className={cn(
                isLoading &&
                  "opacity-50 pointer-events-none transition-opacity",
              )}
            >
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className={cn(
                        "transition-all duration-200 hover:bg-slate-50/50 border-b border-slate-300/60/50 group cursor-pointer",
                        isLoading && "opacity-50 pointer-events-none",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-3 px-6 text-left"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-60 text-center relative"
                    >
                      {isLoading ? (
                        <TableLoader text="Fetching transactions..." />
                      ) : (
                        <DataNotFound message="No transactions found" />
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* --- PAGINATION SECTION (MERGED) --- */}
        <div className="flex flex-col items-start justify-between p-4 sm:p-6 border-t border-slate-300/60 gap-6 sm:flex-row sm:gap-4">
          {/* Left Side: Showing results count */}
          <div className="text-xs font-medium text-slate-400 order-1 text-center sm:text-left">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              rowCount,
            )}{" "}
            of {rowCount} transactions
          </div>

          {/* Right Side: Pagination Controls */}
          <div className="flex items-center gap-10 order-2 w-full sm:w-auto">
            {/* Row Select Bar */}
            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Rows
              </span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
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
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft size={16} />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
                {(() => {
                  const totalPages = table.getPageCount();
                  const currentPage = table.getState().pagination.pageIndex + 1;
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
                        onClick={() => table.setPageIndex(page - 1)}
                        className={cn(
                          "h-8 min-w-[32px] px-2 text-xs font-bold rounded-md transition-all",
                          isActive
                            ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-brand-blue"
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
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
