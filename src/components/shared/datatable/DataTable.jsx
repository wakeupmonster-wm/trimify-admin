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
import { TableLoader } from "@/app/loader/table.loader";
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
  isLoading: _isLoading,
  loading,
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
  const isLoading = _isLoading || loading;
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
        <div
          className={cn(
            "overflow-x-auto relative",
            isLoading && data.length > 0 && "min-h-[180px]",
          )}
        >
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
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                      className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-200/40 text-[10px] text-left whitespace-nowrap"
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
                  data.length > 0 &&
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
                        "transition-all duration-200 even:bg-slate-50 hover:bg-slate-100/70 border-b border-slate-300/60/50 group",
                        onRowClick ? "cursor-pointer" : "",
                        isLoading && "opacity-50 pointer-events-none",
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
                      className="h-60 text-center relative"
                    >
                      {isLoading ? (
                        <TableLoader text={`Fetching ${itemName}...`} />
                      ) : (
                        <DataNotFound
                          message={
                            globalFilter
                              ? "No results found for your search"
                              : `No ${itemName} found`
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
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
