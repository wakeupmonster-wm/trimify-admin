import React from "react";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function DataTablePagination({ table, rowCount, itemName = "items" }) {
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  
  const startRow = table.getState().pagination.pageIndex * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, rowCount || 0);

  return (
    <div className="flex flex-col items-start justify-between p-4 sm:p-6 border-t border-slate-200 gap-6 sm:flex-row sm:gap-4">
      {/* Left Side: Showing results count */}
      <div className="text-xs font-medium text-slate-400 order-1 text-center sm:text-left">
        Showing {rowCount > 0 ? startRow : 0}-{endRow} of {rowCount || 0} {itemName}
      </div>

      {/* Right Side: Pagination Controls */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-10 order-2 w-full sm:w-auto">
        {/* Row Select Bar */}
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Rows
          </span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[65px] border-slate-200 rounded-md bg-white text-xs font-semibold focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
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
            className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft size={16} />
          </Button>

          {/* Page Numbers */}
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
                    onClick={() => table.setPageIndex(page - 1)}
                    className={cn(
                      "h-8 min-w-[32px] px-2 text-xs font-bold rounded-md transition-all",
                      isActive
                        ? "bg-brand-blue text-white hover:bg-brand-hoverBlue shadow-md shadow-blue-100 border-none"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-none",
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
            className="h-8 w-8 border-slate-200 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 shrink-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
