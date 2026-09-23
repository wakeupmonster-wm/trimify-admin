import React, { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

export default function DataTable({
  columns,
  data,
  rowCount = 0,
  pagination,
  onPaginationChange,
  searchPlaceholder = "Search...",
  globalFilter,
  setGlobalFilter,
  isLoading,
  meta,
  itemName = "items",
  onRowClick,
  toolbarChildren, // Custom filters to be placed in toolbar
  activeFiltersChildren, // Custom active chips
  manualPagination = true,
  manualFiltering = true,
  manualSorting = false,
  rowClassName, // custom function or string for row class
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    rowCount,
    pageCount: Math.ceil(rowCount / (pagination?.pageSize || 10)) || 1,
    onSortingChange: setSorting,
    manualSorting,
    manualPagination,
    manualFiltering,
    onPaginationChange,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, pagination, globalFilter },
    meta,
  });

  const skeletonRowCount = Math.min(Math.max(data?.length || 0, 7), 10);

  return (
    <div className="w-full space-y-3">
      <DataTableToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder={searchPlaceholder}
        rowCount={rowCount ?? data.length}
        itemName={itemName}
      >
        {toolbarChildren}
      </DataTableToolbar>

      {/* ACTIVE FILTERS AREA */}
      {activeFiltersChildren && (
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-wrap items-center gap-1.5"
            >
              {activeFiltersChildren}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* TABLE DATA AREA */}
      <div className="relative rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative">
          <Table className="min-w-[900px]">
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-app-primary2/5 hover:bg-app-primary2/5"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                      className="text-foreground/80 px-3 font-bold uppercase h-10 text-[10px] text-left whitespace-nowrap"
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
              {isLoading ? (
                Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                  <TableRow
                    key={`skeleton-row-${rowIndex}`}
                    className="even:bg-slate-50/50 hover:bg-transparent border-b border-slate-100"
                  >
                    {columns.map((col, colIndex) => {
                      const widths = [
                        "w-8",
                        "w-36",
                        "w-28",
                        "w-20",
                        "w-32",
                        "w-24",
                        "w-16",
                      ];
                      const widthClass = widths[colIndex % widths.length];
                      return (
                        <TableCell
                          key={`skeleton-cell-${colIndex}`}
                          className="py-3.5 px-4 text-left"
                        >
                          <Skeleton
                            className={cn(
                              "h-4 rounded bg-slate-200/80 animate-pulse",
                              widthClass,
                            )}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
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
                          "transition-all duration-200 even:bg-slate-50 hover:bg-slate-100/70 border-b border-slate-300/60/50 group",
                          onRowClick ? "cursor-pointer" : "",
                          typeof rowClassName === "function"
                            ? rowClassName(row)
                            : rowClassName,
                        )}
                        onClick={(e) => {
                          if (
                            e.target.closest("button") ||
                            e.target.closest("[role='menuitem']")
                          ) {
                            return;
                          }
                          if (onRowClick) {
                            onRowClick(row);
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width:
                                cell.column.getSize() !== 150
                                  ? cell.column.getSize()
                                  : undefined,
                            }}
                            className="py-3 px-4 text-left"
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
                        className="min-h-[260px] py-8 text-center relative"
                      >
                        {globalFilter ? (
                          <DataNotFound
                            isSearch={true}
                            title="No matching results found"
                            subtitle={`No entries matching "${globalFilter}". Try adjusting your keyword or clear the search.`}
                            action={
                              setGlobalFilter ? (
                                <button
                                  type="button"
                                  onClick={() => setGlobalFilter("")}
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
                                >
                                  Clear search
                                </button>
                              ) : null
                            }
                          />
                        ) : (
                          <DataNotFound
                            title={`No ${itemName} available`}
                            subtitle={`There are currently no ${itemName} recorded in the system. New entries will appear here once added.`}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <DataTablePagination
          table={table}
          rowCount={rowCount}
          itemName={itemName}
        />
      </div>
    </div>
  );
}
