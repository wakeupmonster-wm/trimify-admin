import React from "react";
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
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TableLoader } from "@/app/loader/table.loader";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export function ProductsDataTable({
  columns,
  data,
  loading,
  searchQuery,
  pagination,
  setPagination,
  totalPages,
  filteredCount,
}) {
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      sorting,
    },
  });

  return (
    <div className="relative rounded-xl border border-slate-300/60 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative">
        <AnimatePresence>
          {loading && data.length > 0 && (
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
              <ShadcnTableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-slate-300/60"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-foreground/80 px-3 font-bold uppercase h-10 bg-slate-100/50 text-[10px] text-left"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </ShadcnTableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    className={cn(
                      "transition-all duration-200 even:bg-slate-50 hover:bg-slate-100/70 border-b border-slate-300/60/50 group cursor-pointer",
                      !row.original.isActive && "opacity-50",
                      loading && "opacity-50 pointer-events-none",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 px-3 md:px-4 text-left"
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
                <ShadcnTableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-60 text-center relative"
                  >
                    {loading ? (
                      <TableLoader text="Fetching products..." />
                    ) : (
                      <DataNotFound
                        message={
                          searchQuery
                            ? "No products match your search"
                            : "No products found. Click 'Add Product' to get started."
                        }
                      />
                    )}
                  </TableCell>
                </ShadcnTableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* --- PAGINATION SECTION (MERGED) --- */}
      <div className="flex flex-col items-start justify-between p-4 sm:p-6 border-t border-slate-300/60 gap-6 sm:flex-row sm:gap-4">
        {/* Left Side: Showing results count */}
        <div className="text-xs font-medium text-slate-400 order-1 text-center sm:text-left">
          Showing {pagination.pageIndex * pagination.pageSize + 1}-
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            filteredCount,
          )}{" "}
          of {filteredCount} products
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
              <SelectTrigger className="h-8 w-[65px] border-slate-300/60 rounded-md bg-white text-xs font-semibold focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all shadow-sm">
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(0, prev.pageIndex - 1),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              <IconChevronLeft size={16} />
            </Button>

            <div className="flex items-center gap-1.5">
              {(() => {
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
                      key={page}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: page - 1,
                        }))
                      }
                      className={cn(
                        "h-8 min-w-[32px] px-2 text-xs font-bold rounded-md transition-all",
                        isActive
                          ? "bg-app-primary2 text-white hover:bg-brand-hoverAqua shadow-md shadow-brand-blue border-none"
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
              className="h-8 w-8 border-slate-300/60 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
                }))
              }
              disabled={pagination.pageIndex >= totalPages - 1}
            >
              <IconChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
